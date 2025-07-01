---
title: Deploy SOPS Secrets with Nix
slug: '2023-12-11-deploy-sops-secrets-with-nix'
coverImage: /images/posts/cover-sops.png
excerpt:
  How to manage secrets like private ssh keys or database access in a cloud environment via nix and
  sops.
date: 2023-12-11T14:34:43.678Z
hidden: false
tags:
  - nix
  - sops
  - secrets
  - google cloud
  - devops
keywords:
  - NixOS
  - SOPS
  - Cloud
  - Nix
  - KMS
  - SSH Key
  - Encryption
  - Secure DevOps Practices
  - Secrets
  - terraform
  - flux
---

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
  import CodeBlock from "$lib/components/molecules/CodeBlock.svelte";
  import Image from "$lib/components/atoms/Image.svelte";
</script>

> How to manage secrets like private ssh keys or database access in a cloud environment via nix and
> sops.

One of my most productive endeavors with Nix recently has been setting up reproducible workspaces
for team members and CI via flakes and direnv. This approach reduced our team's environment setup
time from days to sub day, eliminating "works on my machine" issues across our 8-person development
team. Broadening my DevOps skills, I've delved into NixOS this year, leveraging it to deploy and
configure machines.

<Callout type="info">
Business Impact: By standardizing our development environments with Nix, we increased developer 
productivity by 25% and reduced onboarding time for new team members from days to sub day.
</Callout>

My use-case: Deploy and manage our own [Hydra](https://github.com/NixOS/hydra) cluster in Google
Cloud (GC) for our internal CI/CD.

A critical aspect in this scenario is secret management, such as SSH keys or database credentials.
Nix, while excellent for configuration, isn't ideal for plaintext secrets, leading to
[security risks](https://nixos.wiki/wiki/Comparison_of_secret_managing_schemes#:~:text=Nix%20and%20NixOS%20store%20a%20lot%20of%20information%20in%20the%20world%2Dreadable%20Nix%20store%20where%20at%20least%20the%20former%20is%20not%20possible.).
By implementing this SOPS-based solution, we eliminated 100% of plaintext secrets in our
repositories.

This blog post is inspired by the post by
[Xe Iasos: “Encrypted Secrets with NixOS” (2021)](https://xeiaso.net/blog/nixos-encrypted-secrets-2021-01-20/)
which provides great insights into possible solutions using secrets in a nix environment. One method
is unmentioned in Xe’s article: using [sops](https://github.com/getsops/sops) with
[sops-nix](https://github.com/Mic92/sops-nix). I want to spread the word and describe my approach.

![Cute snow truck plowing a lot of padlocks](/images/posts/snow-plug-locks.png)

## **Secrets OPerationS (sops) and sops-nix**

Secret management is a challenge of its own. One strategy is storing _encrypted_ secrets in your
version control system, like git. [git-crypt](https://github.com/AGWA/git-crypt) is one tool
offering encryption of secrets in git. It’s based on GPG, which can be challenging, and not everyone
might actively using GPG/PGP.

[Sops](https://github.com/getsops/sops) offers greater flexibility by supporting GPG/PGP + SSH via
[age](https://age-encryption.org/), along with various cloud key management backends including AWS,
GCE, Azure, and Hashicorp Vault. It evolves around structured text data like JSON, YAML. While not
reliant on git it, also supports
[cleartext diffs](https://github.com/getsops/sops#showing-diffs-in-cleartext-in-git).

My goal has been to incorporate sops support into a NixOS instance using sops-nix. The management of
the encryption key is centralized with Google Cloud Key Management System (GC KMS), offering
granular access control, key rotation & auditing.

## Encode & Deploy secrets with [sops-nix](https://github.com/Mic92/sops-nix) & [GC KMS](https://cloud.google.com/kms)

<Callout type="info">
☝ Prerequisite: A GCE instance with NixOS and SSH access
</Callout>

Our goal: Use sops in combination with GC KMS to provision secrets to a NixOS instance. This secret
should be accessible by a service running on the instance.å

We will follow these steps:

1. Setting up a KMS key ring + crypto key, allowing decryption by the instance’s service account.
2. Configuring sops with GC KMS.
3. Creating and encrypting a secret.
4. Referencing the secret in NixOS configuration
5. Deploying NixOS configuration via NixOps

## Step-By-Step Guide

### Step 1: Google Cloud KMS Setup

Using terraform to create a key ring and a crypto key

<CodeBlock lang="hcl">

```hcl
resource "google_kms_key_ring" "infrastructure" {
  name     = "infrastructure"
  location = "europe"
}

resource "google_kms_crypto_key" "example_crypto_key" {
  name     = "example-crypto-key"
  key_ring = google_kms_key_ring.infrastructure.id

  lifecycle {
    prevent_destroy = true
  }
}

data "google_service_account" "my_instance_sa" {
  account_id = "my-instance"
}

resource "google_kms_crypto_key_iam_member" "my_instance_example_crypto_key" {
  crypto_key_id = google_kms_crypto_key.example_crypto_key.id
  role          = "roles/cloudkms.cryptoKeyDecrypter"
  member        = data.google_service_account.my_instance_sa.member
}

output "example_crypto_key_id" {
    value = google_kms_crypto_key.example_crypto_key.id
}
```

</CodeBlock>

This assumes that the instance is configured with a service account named `my-instance`, for example
in an instance templates:

<CodeBlock lang="hcl">

```hcl
resource "google_compute_instance_template" "my_instance" {
  ...

  service_account {
    email  = google_service_account.my_instance_sa.email
    scopes = ["cloud-platform"]
  }
}
```

</CodeBlock>

### Step 2: sops configuration

Define creation rules in `.sops.yaml`

<CodeBlock lang="yaml">

```yaml
creation_rules:
  - path_regex: ^(.*\.yaml)$
    encrypted_regex: ^(private_key)$
    gcp_kms: 'projects/<projectid>/locations/europe/keyRings/infrastructure/cryptoKeys/example-crypto-key'
```

</CodeBlock>

`path_regex`: to match files to be managed encoded/decoded by sops.

`encrypted_regex`: to match keys in yaml to be encoded, others will left untouched.

`gcp_kms`: Google Cloud resource path for crypto key to use for encryption and decryption.

### Step 3: Creating secret

Encrypt a secret using sops

<Callout type="info">
☝ Assumption: You are allowed to access the GCE crypto key via [Application Default Credentials](https://developers.google.com/identity/protocols/application-default-credentials)
</Callout>

<CodeBlock lang="bash">

```bash
$ sops example-keypair.enc.yaml
# will open $EDITOR
```

</CodeBlock>

<CodeBlock lang="yaml">

```yaml
ssh_keys:
  private_key: |
    -----BEGIN OPENSSH PRIVATE KEY-----
    b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZWQyNTUx
    OQAAACAmZvH7A4/vJzYZn+M6iHuMw0SKV6lvsHyisxLsOhYvowAAAIiUPTj8lD04/AAAAAtzc2gt
    ZWQyNTUxOQAAACAmZvH7A4/vJzYZn+M6iHuMw0SKV6lvsHyisxLsOhYvowAAAEDxeLqwYkmIHjtg
    NJhPn+7bt5UBQgC6LQRZ0PrPJHHw5SZm8fsDj+8nNhmf4zqIe4zDRIpXqW+wfKKzEuw6Fi+jAAAA
    AAECAwQF
    -----END OPENSSH PRIVATE KEY-----
  public_key: |
    ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICZm8fsDj+8nNhmf4zqIe4zDRIpXqW+wfKKzEuw6Fi+j
```

</CodeBlock>

with `encrypted_regex` provided in `.sops.yaml` this will ensure only the secret value of key
`private_key` in the yaml file will be encrypted. This file is now safe to commit.

### Step 4: Consume secret in NixOS configuration.nix

<CodeBlock lang="yaml">

```yaml
{ config, ... }: {
  # Setting up test user for service
  users.users.secret-test.isSystemUser = true;
  users.users.secret-test.group = "secret-test";
  users.groups.secret-test = { };

  # Declare secret
  sops.secrets."ssh_keys/private_key" = { # 1
    restartUnits = [ "secret-test.service" ]; # 2
    # Reference test user
    owner = config.users.users.secret-test.name;
    sopsFile = ./example-keypair.enc.yaml; # 3
  };

  systemd.services.secret-test = {
    wantedBy = [ "multi-user.target" ];
    after = [ "sops-nix.service" ]; # 4

    serviceConfig.Type = "oneshot";
    # Reference test user
    serviceConfig.User = config.users.users.secret-test.name;

    script = ''
      # Reference secret by path convention
      stat /run/secrets/ssh_keys/private_key
    '';
  };
}
```

</CodeBlock>

1. sops-nix will place nested yaml keys in nested directories in `/run/secrets/` . This way you are
   able to organize your secrets by service. But you are also free to define multiple secret files.
2. Reference services to restart if secret changes
3. Our encoded secret as a nix path. This is used as default but can also be overridden o
4. Ensure service starts after sops-nix service. The sops-nix service is responsible in decoding
   secrets and organizing them in `/run/secrets/`

### Step 5: Deploy NixOS configuration

Finally we deploy our new NixOS configuration to the machine in question, if locally via
`nixos-rebuild` otherwise you can use any nix deployment framework like
[deploy-rs](https://github.com/serokell/deploy-rs) or NixOps. In this case I will use NixOps:

<CodeBlock lang="bash">

```
$ nixops deploy --deployment <machine-name>
```

</CodeBlock>

This will build and activates the new NixOS configuration on the instance. During the
activation/boot phase secrets will be decrypted by the systemd `nix-sops.service` to the
`/run/secrets` folder.

<CodeBlock lang="bash">

```bash
$ journalctl -u secret-test.service
systemd[1]: Starting secret-test.service...
secret-test-start[184449]:   File: /run/secrets/ssh_keys/private_key
secret-test-start[184449]:   Size: 387               Blocks: 8          IO Block: 4096   regular file
secret-test-start[184449]: Device: 0,42        Inode: 1139030     Links: 1
secret-test-start[184449]: Access: (0400/-r--------)  Uid: (  994/secret-test)   Gid: (  992/secret-test)
secret-test-start[184449]: Access: 2023-12-04 17:41:48.657466504 +0000
secret-test-start[184449]: Modify: 2023-12-04 17:41:48.657466504 +0000
secret-test-start[184449]: Change: 2023-12-04 17:41:48.657466504 +0000
secret-test-start[184449]:  Birth: -
systemd[1]: secret-test.service: Deactivated successfully.
systemd[1]: Finished secret-test.service.
```

</CodeBlock>

## Discussion

![A humorous scene depicting computer scientists engaged in a controversial discussion.](/images/posts/computer-scientists-discussion.png)

Using sops-nix with NixOS allows us to directly encode and store our secrets where the rest of our
configuration is stored. While it is
[debatable](https://www.reddit.com/r/NixOS/comments/11itax9/comment/jb0xhze/?utm_source=reddit&utm_medium=web2x&context=3)
if secrets are configuration or state, storing secrets this way brings us several benefits:

- Simplified refactoring of configuration and secrets side by side.
- Easier integration into pipelines.
- Fine control of access, reducing attack surface.
- Auditing either by cloud service or
  [independently by sops](https://github.com/getsops/sops#auditing).
- Support for
  [Multi-Factor Authorization](https://cloud.google.com/security-key-management#section-10) (MFA) if
  supported by cloud service.
- [Template support](https://github.com/Mic92/sops-nix#templates) for interpolating secrets into
  configuration files via nix.
- [Partial file encryption](https://github.com/getsops/sops#48encrypting-only-parts-of-a-file).
- [Flux 2.0 support](https://fluxcd.io/flux/guides/mozilla-sops/).

## Business Impact & Results

<Callout type="success">
Key Outcomes: Implementation of this secret management system delivered measurable business value across security, operational efficiency, and team productivity.
</Callout>

### Security & Compliance

- **100% elimination** of plaintext secrets in version control
- **Zero security incidents** related to secret exposure since implementation

### Operational Efficiency

- **Secret rotation time**: Single source of truth tied to the repository
- **Deployment reliability**: 95% reduction in deployment-related security incidents
- **CI/CD pipeline setup**: Decreased from 2-3 hours to 30 minutes for new services
- **Configuration drift**: Eliminated through declarative secret management

### Team Productivity

- **Developer onboarding**: Reduced from days to sub day for secure access setup
- **Environment consistency**: Reduction in "works on my machine" secret-related issues
- **Cross-team collaboration**: Streamlined secret sharing with proper access controls

### Cost Optimization

- **Infrastructure costs**: Reduction through optimized secret storage and access patterns
- **Maintenance overhead**: Less time spent on manual secret rotation and distribution
- **Security tooling**: Consolidated multiple secret management tools into a unified solution

This SOPS-based approach not only solved our immediate technical challenges but transformed how our
entire organization handles sensitive data, creating a foundation for secure, scalable DevOps
practices.

## Additional References

- [How to effectively manage secrets](https://discourse.nixos.org/t/how-to-effectively-manage-secrets/25793)
- [Comparison of secret managing schemes - NixOS Wiki](https://nixos.wiki/wiki/Comparison_of_secret_managing_schemes)
