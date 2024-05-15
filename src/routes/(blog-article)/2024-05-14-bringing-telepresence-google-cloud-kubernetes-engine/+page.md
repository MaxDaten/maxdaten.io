---
title: Bringing Telepresence to Google Cloud Kubernetes Engine
slug: 2024-05-14-bringing-telepresence-google-cloud-kubernetes-engine
coverImage: /images/posts/portal-telepresence.png
excerpt: Guide for using Telepresence with GKE & NEGs, focusing on health check challenges and providing two methods for seamless development & debugging.
date: 2024-05-13T23:39:16.936Z
updated: 2024-05-13T23:39:16.936Z
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

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
  import CodeBlock from "$lib/components/molecules/CodeBlock.svelte";
  import Image from "$lib/components/atoms/Image.svelte";
</script>

In my current project [Qwiz'n'Buzz](https://qwiz.buzz) we are actively working
on a discord integration as an Discord Activity. In sake of user protection
Discord uses a proxy as a middleman for requests to our services. Additionally,
the Discord SDK relies on your application been integrated in a iframe provided
by Discord. This brings some challenges to the development process.

To test the integration locally Discord suggests
[`cloudflared`](https://github.com/cloudflare/cloudflared) to tunnel the
local service to a public endpoint. Unless you are using a paid plan, the
endpoint URL is ephemeral and changes between restarts. This requires you have
to update the Discord application settings every time you restart the tunnel.

## Telepresence

This is where I remembered [Telepresence](https://www.telepresence.io/).
Telepresence allows you to proxy a local development environment into a remote
Kubernetes cluster. This enables you to test and debug services within the
context of the full system without deploying the service to the cluster.
This way we can provision stable development domains and cluster infrastructure
to iterate quickly on the Discord integration locally.

Telepresence brings two ways for redirecting traffic from a kubernetes
service to your local machine. The first way [replaces](https://www.getambassador.io/docs/telepresence/latest/reference/intercepts/cli#replacing-a-running-workload) the service-backing
pod with a Telepresence pod that forwards traffic to your local machine.
The second pattern adds a sidecar container (`traffic-agent`) to the
service-backing pod that forwards traffic to your local machine. The second
pattern is the _default behavior_ and is the one I will focusing in
this post.

Telepresence installs the sidecar in the service-backing pod
(e.g. provided by a `Deployment`) and renames the original port while the
sidecar provides the original port.

## Google Kubernetes Engine (GKE) and Network Endpoint Groups (NEGs)

While I used telepresence in the past I had some challenges using it with our
Google Kubernetes Engine (GKE, managed kubernetes cluster) which I pinpointed
to the Network Endpoint Groups (NEGs) Google Cloud offers for a performant and
managed load balancing solution by utilizing Googles Cloud's network infrastructure.
NEGs require health checks to ensure that the traffic is only routed to healthy
pods. These aren't optional and their kubernetes configuration is limited to
HTTP, HTTPS, and HTTP/2 and gRPC (TODO: check).

Without special considerations this brings a chicken-egg problem. Telepresence
replaces the service-backing pod with a sidecar container that forwards traffic
to your local machine but the traffic is not routed to the sidecar container as
long as the NEGs health check fails. Since the NEGs health checks aren't optional
and TCP health checks are not supported, we need to find a way to satisfy the
health checks while using Telepresence.

### Strategy 1: Utilizing a Sidecar for Health Checks

One strategy to provide the NEGs health check an healthy endpoint is the use of
an additional sidecar.

1. **Implement a Sidecar Container**: Deploy a lightweight sidecar container
   alongside your main application container within the same pod. This sidecar
   serves a simple HTTP server that responds to the health check requests from
   the NEG.

<CodeBlock lang="yaml">

```yaml
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
      - name: healthz
        image: nginx:latest
        # Using 80 as the health check port to simplify example.
        ports:
          - containerPort: 80
            name: healthz
```

</CodeBlock>

2. **Configure Health Checks**: Point the NEG’s health check configuration to
   the port exposed by the sidecar. This ensures that the health check passes as
   long as the sidecar is running, regardless of telepresence currently
   intercepting the main service’s traffic.

<CodeBlock lang="yaml">

```yaml
apiVersion: cloud.google.com/v1
kind: BackendConfig
metadata:
  name: my-backend-config
spec:
  healthCheck:
    type: HTTP
    port: 80
    requestPath: /
```

</CodeBlock>

With the sidecar handling health checks, you can use Telepresence to intercept
the main service’s traffic without affecting the pod's health status in the eyes
of the NEG.

### Strategy 2: Dedicated Health Check Port on the Service

Another approach is to expose a dedicated health check port directly on the
service that you want to debug. This method involves minimal changes and can
be set up as follows:

1. **Expose an Additional Port**: Modify your service’s deployment to include
   an additional port that serves HTTP health checks. This port should be separate
   from the main service port. Minor code changes may be required to support the
   new health check port.

<CodeBlock lang="yaml">

```yaml
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

</CodeBlock>

2. **Update Service and NEG Configuration**: Adjust the service and NEG
   configuration to recognize the new port specifically for health checks.

<CodeBlock lang="yaml">

```yaml
apiVersion: cloud.google.com/v1
kind: BackendConfig
metadata:
  name: my-backend-config
spec:
  healthCheck:
    type: HTTP
    port: 8081
    requestPath: /
```

</CodeBlock>

As long as not using the replacement mode, Telepresence will not interfere with
the health check port and the NEG will continue to route traffic to the pod as
long as the health check endpoint is healthy.

### Benefits and Considerations

Both strategies ensure that the NEG’s requirements for health checks are met
while providing flexibility in debugging and developing applications using
Telepresence. However, each approach has its considerations:

- **Sidecar Approach**: This method increases resource usage slightly due to
  the additional container but keeps the health check logic separate from the
  main application code.

- **Dedicated Port Approach**: This method is simpler to implement but requires
  modifications to the application code to support an additional HTTP server
  for health checks.

### Conclusion

Integrating Telepresence with GKE and NEGs offers powerful capabilities for
real-time debugging and development within a cloud-native infrastructure.
Despite the challenges posed by health check limitations, the strategies
discussed provide robust solutions to ensure smooth and efficient development
workflows. By either leveraging a sidecar container or introducing a dedicated
health check port, developers can maintain the health check integrity required
by NEGs while gaining the full benefits of using Telepresence for local
development against a live Kubernetes environment.

As Kubernetes and its associated technologies continue to evolve, it’s
essential to stay informed and adapt to new tools and methods that enhance
development efficiency and robustness. Whether you're a seasoned Kubernetes
developer or just starting, understanding and implementing these strategies will
help you maximize your productivity and leverage the full power of cloud-native technologies.
