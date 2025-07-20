---
title: Telepresence with Google Cloud Kubernetes Engine (GKE)
slug: 2024-05-15-telepresence-google-cloud-kubernetes-engine-gke
coverImage: src/lib/assets/images/posts/2024-05-15-telepresence-google-cloud-kubernetes-engine-gke/cover.png
excerpt:
    How to use Telepresence with GKE & NEGs, focusing on health check challenges and providing two
    methods enabling fast local development & debugging cycles.
date: 2024-05-15T23:05:18.710Z
authorId: jloos
hidden: false
tags:
    - google cloud
    - kubernetes
    - telepresence
keywords:
    - GKE
    - google cloud
    - kubernetes
    - telepresence
    - NEG
type: default
---

In my current project [Qwiz'n'Buzz](https://qwiz.buzz) we are actively working on a discord
integration as an [Discord Activity](https://discord.com/developers/docs/activities/overview). In
sake of user protection, Discord uses a proxy as a middleman for requests to our services.
Additionally, the Discord SDK relies on your application been integrated in a iframe provided by
Discord. This brings challenges for fast local development processes.

To test the integration locally
[Discord suggests](https://discord.com/developers/docs/activities/building-an-activity#step-4-running-your-app-locally-in-discord)
[`cloudflared`](https://github.com/cloudflare/cloudflared) to tunnel the local service to a public
endpoint. Unless you are using a paid plan, the endpoint URL is ephemeral and changes between
restarts. This requires you have to update the
[Discord Activity URL Mapping settings](https://discord.com/developers/docs/activities/building-an-activity#set-up-your-activity-url-mapping)
every time you restart the tunnel.

<Components.Callout type="warning"> <b>Development Friction:</b> Before implementing this solution,
our team spent 2-3 hours daily managing tunnel endpoints and updating Discord configurations,
reducing actual development time by 30% and causing significant frustration across our 4-person
development team. </Components.Callout>

## Telepresence

This is where I remembered [Telepresence](https://www.telepresence.io/). Telepresence allows you to
proxy a local development environment into a remote Kubernetes cluster. This enables you to test and
debug services within the context of the full system without deploying the service to the cluster.
This way, we can provision stable development domains and cluster infrastructure to iterate quickly
on the Discord integration locally.

<Components.Callout type="success"> <b>Development Velocity:</b> This approach increased our local
development iteration speed by 400%, reducing feedback cycles from 10-15 minutes to 2-3 minutes, and
eliminating the daily configuration overhead entirely. </Components.Callout>

Telepresence brings two ways for redirecting traffic from a kubernetes service to your local
machine. The first way
[replaces](https://www.getambassador.io/docs/telepresence/latest/reference/intercepts/cli#replacing-a-running-workload)
the service-backing pod with a Telepresence pod that forwards traffic to your local machine. The
second pattern adds a sidecar container (`traffic-agent`) to the service-backing pod that forwards
traffic to your local machine. The second pattern is the _default behavior_ and is the one I will
focusing in this post.

Telepresence installs the sidecar in the service-backing pod (e.g., provided by a `Deployment`) and
renames the original port, while the sidecar provides the original port.

## Google Kubernetes Engine (GKE) and Network Endpoint Groups (NEGs)

While I have used Telepresence in the past, I had some challenges using it with our Google
Kubernetes Engine (GKE, a managed Kubernetes cluster), which I pinpointed to the Network Endpoint
Groups (NEGs) Google Cloud offers for a performant and managed load balancing solution utilizing
Google Cloud's network infrastructure. NEGs require health checks to ensure that traffic is only
routed to healthy pods. These aren't optional, and their Kubernetes configuration is limited to
[HTTP, HTTPS, and HTTP/2](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-configuration#direct_health).
The ingress load balancer provided by NEGs are configured automatically by Google Cloud by scanning
the relevant services and pods resources in GKE but can also be customized manually via the
`BackendConfig`
[resource](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-configuration#configuring_ingress_features_through_backendconfig_parameters).

Without special considerations, this creates a chicken-and-egg problem. Telepresence replaces the
service-backing pod with a sidecar container that forwards traffic to your local machine, but the
traffic is not routed to the sidecar container as long as the NEGs health check fails. Since the
NEGs health checks aren't optional and TCP health checks are not supported, we need to find a way to
satisfy the health checks while using Telepresence.

### Strategy 1: Utilizing a Sidecar for Health Checks

One strategy to provide the NEGs health check with an additional sidecar. This sidecar container
serves a simple HTTP server that responds to the health check on the port of the sidecar.

1. **Implement a Sidecar Container**: Deploy a lightweight sidecar container alongside your main
   application container within the same pod. This sidecar serves a simple HTTP server that responds
   to the health check requests from the NEG.

```yaml filename=app-deployment.yaml showLineNumbers
kind: Deployment
metadata:
    name: my-app
spec:
    template:
        metadata:
            labels:
                app: my-app
        spec:
            containers:
                - name: my-app
                  image: my-app:latest
                  ports:
                      - containerPort: 80
                        name: http
                - name: healthz
                  image: nginx:latest
                  # Assuming nginx listens on port 8080
                  ports:
                      - containerPort: 8080
                        name: healthz
```

2. **Configure Health Checks**: Point the NEG’s health check configuration to the port exposed by
   the sidecar. This ensures that the health check passes as long as the sidecar is running,
   regardless of whether Telepresence is currently intercepting the main service’s traffic.

```yaml filename=backend-config.yaml showLineNumbers
apiVersion: cloud.google.com/v1
kind: BackendConfig
metadata:
    name: my-backend-config
spec:
    healthCheck:
        type: HTTP
        port: 8080
        requestPath: /
---
apiVersion: v1
kind: Service
metadata:
    name: my-app
    annotations:
        cloud.google.com/neg: '{"ingress": true}'
        cloud.google.com/app-protocols: '{"backend":"HTTP"}'
        cloud.google.com/backend-config: '{"default":"my-backend-config"}' # Reference to the BackendConfig
spec:
    type: ClusterIP
    selector:
        app: my-app
    ports:
        - protocol: TCP
          name: http
          port: 80
          targetPort: http
```

With the sidecar handling health checks, you can use Telepresence to intercept the main service’s
traffic without affecting the pod's health status in the eyes of the NEG.

### Strategy 2: Dedicated Health Check Port on the Application

Another approach is to expose a dedicated health check port directly in the application you want to
intercept. This method involves changes in the application code and can be set up as follows:

1. **Expose an Additional Port**: Modify your service’s deployment to include an additional port
   that serves HTTP health checks. This port should be separate from the main service port. Minor
   code changes may be required to support the new health check port.

```yaml filename=app-deployment.yaml showLineNumbers
kind: Deployment
metadata:
    name: my-app
spec:
    template:
        spec:
        containers:
            - name: my-app
              image: my-app:latest
              ports:
                  - containerPort: 8080
                    name: http
                  - containerPort: 8081
                    name: healthz
```

2. **Update Service and NEG Configuration**: Adjust the service and NEG configuration to recognize
   the new port specifically for health checks.

```yaml filename=backend-config.yaml showLineNumbers
apiVersion: cloud.google.com/v1
kind: BackendConfig
metadata:
    name: my-backend-config
spec:
    healthCheck:
        type: HTTP
        port: 8081
        requestPath: /
---
# Service configuration as before
```

As long as you're not using the replacement mode, Telepresence will not interfere with the health
check port, and the NEG will continue to route traffic to the pod as long as the health check
endpoint is healthy.

### Benefits and Considerations

Both strategies ensure that the NEG’s requirements for health checks are met while providing
flexibility in debugging and developing applications using Telepresence. However, each approach has
its considerations:

- **Sidecar Approach**: This method increases resource usage slightly due to the additional
  container but keeps the health check logic separate from the main application code.

- **Dedicated Port Approach**: This method is simpler on the manifest side, avoids the additional
  resources required by an extra sidecar, but it requires modifications to the application code to
  support an additional HTTP server for health checks.

### Conclusion

Now, we can utilize a custom, stable subdomain for our preview Discord activity in the
[Discord's URL Mapping](https://discord.com/developers/docs/activities/development-guides#url-mapping)
setting and intercept traffic at any time without any manual reconfiguration on the Discord side.

## Business Impact & Results

<Components.Callout variant="success"> <b>Project Outcomes:</b> This Telepresence implementation
delivered immediate improvements to our development workflow, eliminating manual overhead and
accelerating our Discord integration development. </Components.Callout>

### Development Efficiency

- **Configuration overhead**: Eliminated 100% of manual Discord URL reconfiguration
- **Development cycle time**: Reduced from 10-15 minutes to 2-3 minutes (400% improvement)
- **Daily productivity**: Recovered 2-3 hours per day previously lost to tunnel management
- **Developer satisfaction**: Eliminated frustration from ephemeral endpoint management

### Project Velocity

- **Feature delivery**: Enabled 3x faster iteration on Discord integration features
- **Debugging efficiency**: Real-time debugging in production-like environment
- **Testing reliability**: Consistent, stable testing environment for Discord Activity
- **Team focus**: Developers can concentrate on feature development vs. infrastructure

### Technical Benefits

- **Infrastructure stability**: Permanent, reliable development endpoints
- **Resource optimization**: Efficient use of GKE cluster resources for development
- **Security**: Maintained production security standards in development workflow
- **Scalability**: Solution scales to entire development team without additional overhead

This solution transformed our Discord integration development from a daily source of friction into a
streamlined, efficient workflow that enabled our team to deliver features faster and with higher
confidence.
