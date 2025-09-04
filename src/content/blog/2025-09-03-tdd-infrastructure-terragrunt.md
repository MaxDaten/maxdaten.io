---
title: 'Test-Driven Infrastructure'
slug: 2025-09-03-tdd-infrastructure-terragrunt
excerpt:
    How to set up a fast, repeatable TDD loop for IaC using shell-native tests with CI reporting
date: 2025-09-03T20:00:21.109Z
updated: null
authorId: jloos
hidden: false
tags:
    - infrastructure-as-code
    - continuous-delivery
    - software-development
    - agile
    - design-pattern
keywords:
    - infrastructure as code
    - test-driven development
    - continuous delivery
    - terragrunt
    - bats
    - agile development
    - test automation
    - pipeline automation
    - software development process
    - team productivity
    - continuous integration
---

<script>
    import { authors } from '$lib/data/authors';
    import Author from '$lib/components/molecules/Author.svelte';
    const jloos = authors.jloos;
</script>

## Why Test-Driven Development for Infrastructure?

One bitter truth of my career: I've never encountered a project that implemented comprehensive
automated testing for infrastructure code. This is particularly concerning given that infrastructure
is often one of the most essential but complex aspects of modern software systems to debug and
validate.

Infrastructure as Code (IaC) manages intricate systems with many interconnected components, from
networking and infamous IAM rules to service deployments and data storage solutions. When something
goes wrong, it sometimes go horribly wrong, and the debugging process can be time-consuming and
risky, especially in production environments.

This is where Test-Driven Development (TDD) comes to the rescue. By asking ourselves "what does good
look like?" before making changes, we can:

1. Define the desired state and behavior of our infrastructure
2. Create automated tests that validate these requirements
3. Implement changes knowing tests will catch potential issues
4. Maintain a reliable way to verify infrastructure integrity over time

Test-Driven brings the same benefits to infrastructure that it brings to application code: faster
and direct feedback loops, better design decisions, and increased confidence in changes. Instead of
manually verifying infrastructure changes work as intended, we can prove it through automated
testing. We test and verify changes nevertheless, so why not automated?

This pattern uses Terragrunt hooks to execute shell-native tests in a conventional directory
structure. It's straightforward, lightweight, and immediately actionable.

## Tool Stack

### Terragrunt & Terraform

Terragrunt orchestrates Terraform modules through dependency graphs and provides execution hooks. We
leverage these hooks to run tests automatically after infrastructure changes.

### Bats & Bats-Detik

Bats is a shell-native testing framework that brings bash scripting capabilities with easy command
execution and comprehensive output validation. Combined with bats-detik, we can write
natural-language assertions against Kubernetes resources. The power lies in simplicity: `kubectl`,
`flux`, `helm`, `gcloud`, and `aws` commands can be used directly in tests.

### GitHub Actions with Test Reporting

Deploy infrastructure through CI/CD pipelines for consistency and auditability. The
`dorny/test-reporter@v2` action transforms Bats' JUnit XML output into readable test reports.

## The Pattern: Test-Driven Infrastructure: A Shell-Native Loop

TODO: Drawing Board

- TODO: Visual: Diagram showing flow: Terragrunt apply → after-apply test hook → Bats tests (
  kubectl/Flux) → JUnit XML → CI report
- Callout: “Assert what good looks like at the boundary” (Flux controllers, CRDs, reconciliations)

### Test Layout Convention and Hooking Up Test Execution

Convention over configuration: The tests are placed in a `tests` directory parallel to the terraform
module root on the same level as the `terraform.hcl` file. Every module SHOULD have a `tests`
directory, and bats will execute all tests in this directory, after terraform has been applied, if
the `tests` directory is present. The hook will be defined in the `root.hcl` file of the terragrunt
project. This way, the hook will be executed for all modules in the project.

```hcl filename=root.hcl showLineNumbers
terraform {
    after_hook "tests" {
        commands = ["apply"]
        execute = [
            "bash", "-c", <<EOF
        if [ -d tests ]; then
          mkdir -p test-results
          bats --report-formatter junit --output test-results tests/
        else
          echo '⚠️ No tests found'
        fi
      EOF
        ]
    }
}
```

### Writing Tests Style

Using bats is not a requirement for this pattern. But to draw a clearer picture of the
implementation, a short example of an infrastructure test written with bats + bats-detik is
provided:

First use the `setup_suite` _bats hook_ to get cluster credentials (here via gcloud) for the tests.
This hook will be executed before any tests are run.

```bash
#!/usr/bin/env bash
# cluster/tests/setup_suite.bash
set -euo pipefail

function setup_suite() {
  tf_output_json=$(terragrunt output -json)

  PROJECT_ID=$(echo ${tf_output_json} | jq -r .platform_project.value.id)
  CLUSTER_NAME=$(echo ${tf_output_json} | jq -r .platform_cluster.value.name)
  CLUSTER_REGION=$(echo ${tf_output_json} | jq -r .platform_cluster.value.location)
  KUBECONFIG=~/.kube/config

  gcloud container clusters get-credentials "${CLUSTER_NAME}" \
    --region "${CLUSTER_REGION}" --project "${PROJECT_ID}"
  kubectl version
  export KUBECONFIG PROJECT_ID CLUSTER_NAME CLUSTER_REGION
}
```

Next an example test, to validate the flux installation on the cluster:

```bash filename=cluster/tests/flux.bats showLineNumbers
#!/usr/bin/env bats

bats_load_library bats-support
bats_load_library bats-assert
bats_load_library bats-detik/detik.bash

DETIK_CLIENT_NAME="kubectl"
DETIK_CLIENT_NAMESPACE="flux-system"

@test "Flux controllers healthy" {
  flux check
}

@test "Flux Kustomization reconciled successfully" {
  verify "'status.conditions[*].reason' matches 'ReconciliationSucceeded' for kustomization named 'flux-system'"
}

@test "Given image automation is enabled, Then its CRDs are installed" {
  for crd in \
    imagerepositories.image.toolkit.fluxcd.io \
    imagepolicies.image.toolkit.fluxcd.io \
    imageupdateautomations.image.toolkit.fluxcd.io
  do
    verify "there is 1 crd named '$crd'"
  done
}

@test "When a managed label on flux-system namespace is tampered, Then Flux reconciles it back" {
  kubectl label namespace flux-system drift-test=temporary --overwrite
  flux reconcile kustomization flux-system
  try "at most 3 times every 1s \
      to get namespace named 'flux-system' \
      and verify that 'metadata.labels.drift-test' is '<none>'"
}
```

Assume the `cluster` directory is a terragrunt enabled terraform module which provisions a
kubernetes cluster with flux also being bootstrapped via terraform. This test will verify that the
flux controllers are healthy, that the flux kustomization is reconciled successfully, that the image
automation CRDs are installed, and that the flux can reconciled its own configuration.

> It's strongly recommended to write tests on this level in a most high-level way, focus on the
> desired behavior and not on concrete properties or state of the infrastructure.
>
> For example, if you need to attach an IAM Role to a principal, don't validate that an exact role
> is present on the principal. Instead, validate that the principal can act according to the role's
> permissions, like uploading to a bucket. This way you avoid writing tests that are too tightly
> coupled to the infrastructure code, which otherwise will tend to be unmaintainable on every small
> aspect of a change, like composing multiple roles to a new role.

### CI Integration and Reporting

Just a cherry on top: bats (and almost all other test runners) can report test results in JUnit XML
or other
[format supported by `dorny/test-reporter@v2`](https://github.com/dorny/test-reporter?tab=readme-ov-file#supported-formats).
This way, we can integrate the test results into our CI pipeline, to provide a quick overview when
failures and unexpected behavior occur. A short trimmed-down example of how to integrate reporting:

```yaml
name: 'Infrastructure Apply'
on:
    push:
        branches:
            - 'main'
    workflow_dispatch:

env:
    TF_IN_AUTOMATION: 'true'
    TG_NON_INTERACTIVE: 'true'

permissions:
    # Minimal permissions required for reports
    contents: read
    actions: read
    checks: write

jobs:
    apply:
        name: 'Apply'
        environment: 'infrastructure'
        runs-on: ubuntu-latest
        concurrency:
            group: infrastructure
        steps:
            - uses: 'actions/checkout@v5'

            # Install bats and bats-detik

            # Add validation and plan if needed

            - id: apply-all
              name: '🚀 Apply All'
              run: terragrunt apply --all

            - name: Test Report
              uses: dorny/test-reporter@v2
              if: ${{ !cancelled() }}
              with:
                  name: Foundation Apply Tests
                  path: '**/test-results/report.xml'
                  reporter: java-junit
```

Example of a test report in GitHub action workflow:

![A screenshot of a bats report in GitHub action workflow](/src/lib/assets/images/posts/2025-09-03-tdd-infrastructure-terragrunt/f5133fa4-d832-400a-8024-12592e99fbf5.png)

## Pattern Summary

- Place tests in a optional `tests` directory parallel to the terraform module root
- Utilize terragrunt hooks to execute test runner (e.g bats) after terraform apply, when `tests`
  directory is present
- Write high-level tests that validate desired behavior and not concrete properties or state of the
  infrastructure
- Optionally: Use `dorny/test-reporter@v2` to integrate test results into CI pipeline

This is a lightweight and adaptable pattern. bats is selected for its close relationship to shell
scripting and small dependency footprint, but every test runner can be used.

As a bonus, the pattern allows combining all infrastructure tests into one single validation suite,
which can help pinpoint infrastructure issues and help rule out a bunch of possible causes. A
recommended discipline is to update and extend tests on every issue you encountered to continuously
improve the validation power of the suite.

---

> [!NOTE]
>
> **Ready to implement TDD for your infrastructure?**
>
> _I help teams build robust, test-driven infrastructure practices. Available for consultations,
> architecture reviews, team training, and hands-on implementation._
>
> <Author author={jloos} />
