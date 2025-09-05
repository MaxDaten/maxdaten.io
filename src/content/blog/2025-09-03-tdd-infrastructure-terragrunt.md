---
title: 'Test-Driven Infrastructure'
slug: 2025-09-03-tdd-infrastructure-terragrunt
excerpt: |
    Bring TDD to your infrastructure. 
    Use Terragrunt hooks and shell-native tests to catch failures early, boost confidence, and make every change safer.
date: 2025-09-03T20:00:21.109Z
updated: null
authorId: jloos
hidden: false
tags:
    - infrastructure-as-code
    - test-driven-development
    - continuous-delivery
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

> [!NOTE] Most teams ship infrastructure without tests. That’s like writing application code with no
> CI and hoping for the best. Infrastructure is critical, complex, and fragile—but too often it’s
> left unchecked.
>
> With Test-Driven Development (TDD), we can flip the script. Instead of praying our Terraform and
> IAM rules “just work,” we define what good looks like, write tests, and let automation keep us
> safe.

## Why Test-Driven Development for Infrastructure?

In 15 years of building systems, I’ve never seen a project with comprehensive automated
infrastructure tests. That gap is dangerous. Infrastructure touches everything: networking, IAM,
deployments, storage. When something breaks, it often breaks catastrophically.

By asking ourselves "what does good look like?" before making changes, TDD gives us:

1. **Defined outcomes** — clarity on what “good” infrastructure means.
2. **Automated checks** — fast feedback loops that catch issues early.
3. **Confidence in change** — safer refactors and upgrades.
4. **A living safety net** — tests that evolve with the system.
5. **Bonus: Quick Validation Suite** — Troubleshooting built-in.

We already test changes manually. Automating those tests turns fragile rituals into repeatable,
trustworthy pipelines.

## The Lightweight TDD Pattern

We don’t need heavyweight test frameworks. With Terragrunt hooks and bats, we can build lightweight,
shell-native, and adaptable infrastructure tests.

![A diagram showing the flow of Terragrunt, Bats, and GitHub Actions](/src/lib/assets/images/posts/2025-09-03-tdd-infrastructure-terragrunt/660ed575-b0d0-46e1-bbb3-2a7849ff73d1.svg)

**Key idea**: Assert behavior at the boundaries. For example, don’t test whether an IAM role is
attached—test whether the service account can actually upload to a bucket.

## Tool Stack

### Terragrunt & Terraform

[Terragrunt](https://terragrunt.gruntwork.io/) orchestrates Terraform and provides execution hooks.
We use these hooks to run tests right after infrastructure changes.

### Bats & Bats-Detik

[Bats](https://bats-core.readthedocs.io/en/stable/) is a Bash-native testing framework. Combined
with [bats-detik](https://github.com/bats-core/bats-detik), it gives us natural-language assertions
against Kubernetes resources. The power is simplicity: call kubectl, helm, flux, gcloud, or aws
directly in tests.

### GitHub Actions with Test Reporting

CI pipelines ensure consistency. With
[ `dorny/test-reporter`](https://github.com/dorny/test-reporter), we turn JUnit XML output into
clean GitHub reports.

## Test Layout Convention and Hooking Up Test Execution

Keep it conventional:

- Place tests in a `tests` directory next to the module’s `terragrunt.hcl`.
- Terragrunt’s `root.hcl` defines a hook that runs all tests of a module after `apply`.
- If no tests exist, it simply warns.

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

## Writing Tests Style

Use Bats’ `setup_suite` to fetch cluster credentials once before running tests.

```bash filename=cluster/tests/setup_suite.bash showLineNumbers
#!/usr/bin/env bash
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

@test "Flux controllers are healthy" {
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

> It's strongly recommended to write tests on this level in a most high-level way: Focus on the
> desired behavior and not on concrete properties or state of the infrastructure.
>
> For example, if you need to attach an IAM Role to a principal, don't validate the exact role
> presence. Instead, verify that the principal can perform its intended actions—for example,
> uploading to a bucket. This avoids brittle tests coupled to implementation details that break on
> minor changes like role composition.

## CI Integration and Reporting

Just a cherry on top: bats (and almost all other test runners) can report test results in JUnit XML
or in another
[format supported by `dorny/test-reporter@v2`](https://github.com/dorny/test-reporter?tab=readme-ov-file#supported-formats).
This way, we can integrate the test results into our CI pipeline to provide a quick overview when
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

Result: a clean pass/fail report embedded in your GitHub Actions workflow.

![A screenshot of a bats report in GitHub action workflow](/src/lib/assets/images/posts/2025-09-03-tdd-infrastructure-terragrunt/f5133fa4-d832-400a-8024-12592e99fbf5.png)

## Pattern Summary

- **Place** tests in a `tests` directory at root of the Terraform module.
- **Hook** Terragrunt to run them automatically after `apply`.
- **Write** high-level behavior tests, not brittle state checks.
- **Integrate** results into CI for instant visibility.

This pattern is lightweight, shell-native, and adaptable. You can extend it to any test runner.

As a bonus, the pattern allows combining all infrastructure tests into one single validation suite,
which can help pinpoint infrastructure issues and help rule out a bunch of possible causes. A
recommended discipline is to update and extend tests on every issue you encountered to continuously
improve the validation power of the suite.

> [!NOTE]
>
> **Ready to make your infrastructure iterations safer and faster?**
>
> _I help teams build test-driven infrastructure practices—through consultations, architecture
> reviews, trainings and hands-on implementation._
>
> <Author author={jloos} />
