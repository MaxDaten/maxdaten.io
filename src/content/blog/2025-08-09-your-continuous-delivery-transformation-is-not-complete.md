---
title: 'Your Continuous Delivery Transformation is Not Complete'
slug: 2025-08-09-your-continuous-delivery-transformation-is-not-complete
coverImage: src/lib/assets/images/posts/2025-08-09-your-continuous-delivery-transformation-is-not-complete/cover.png
excerpt: Only 10% of organizations actually practice continuous delivery well—are you one of them?
date: 2025-08-09T20:00:21.109Z
updated: null
authorId: jloos
hidden: false
tags:
    - agile
    - kanban
    - productivity
    - software-development
    - continuous-delivery
keywords:
    - continuous delivery
    - fast feedback
    - agile development
    - trunk-based development
    - branching strategy
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

We've come a long way, but most teams still practice only half of continuous delivery. The good
news: many have solved the cultural basics—pipeline integrity, autonomous teams, and process
discipline. The surprise: the latest
[State of Continuous Delivery in 2025](https://continuous-delivery.co.uk/cd-assessment/index)
([PDF](https://continuous-delivery.co.uk/downloads/The%20State%20of%20CD%202025.pdf)) analyzed
nearly 100 organizations and found that only 10% actually practice CD well—the true experts.

This is a short follow-up to my previous post,
[Check Your Engine: Work‑In‑Progress Limits Matter](/2025-07-26-check-engine-work-progress-limit-matters).
Dave Farley’s new assessment, published days later, matches those observations with data.

## The Three Critical Gaps

The report highlights three technical gaps that separate the 10% from everyone else:

1. **Trunk‑based development** — Many teams still branch like it’s 2005.
    - Do this next: merge to main at least daily, use feature flags, delete long‑lived branches.
2. **Test automation** — Manual gates and flaky tests throttle flow.
    - Do this next: build a test pyramid, make tests deterministic, gate merges on a green build.
3. **End‑to‑end pipeline automation** — Half‑automated isn’t automated.
    - Do this next: one path to production, one‑click deploys, versioned and repeatable
      environments.

Teams that excel at trunk‑based development and test automation are the ones actually shipping
continuously. If you struggle with one, you likely struggle with both.

## The 14 Essentials of Continuous Delivery

From the report, these are the essentials:

1. Releasability
2. Deployment pipeline
3. _**Continuous integration**_
4. _**Trunk‑based development**_
5. Small, autonomous teams
6. Informed decision‑making
7. _**Small steps**_
8. _**Fast feedback**_
9. Automated testing
10. Version control
11. One route to production
12. Traceability
13. Automated deployment
14. Observability

Small steps and fast feedback are where a low work‑in‑progress (WIP) limit pays off. You only have
true continuous integration when you work in small steps and synchronize via trunk‑based
development. WIP limits protect feedback loops—you avoid flooding the system with changes that
haven’t yet been validated by automation, tests, and observability once integrated with everyone
else’s work.

> Change complexity grows exponentially with the number of concurrent changes.

## The Real Question

Are you in the 90% who think they practice continuous delivery—or the 10% who actually do?

The way forward isn’t fancier branching or heavier maintenance rituals. It’s upgrading the technical
habits that make delivery continuous.

## How to Move Up

- Merge to main daily - not the other way around!; prefer feature flags over long‑lived branches.
- Make the pipeline your product: every push builds, tests, and can deploy the same way, every time.
- Keep tests reliable: target ≤1% flake rate; quarantine and fix flakes within a day.
- Limit WIP: set explicit team WIP limits; aim for ≤1‑day PR cycle time.
- Measure what matters: lead time for changes, deployment frequency, change‑fail rate, and MTTR.

<Components.Callout type="success"> Need support achieving continuous delivery? I offer consulting,
hands‑on training, and development support focused on CD, DevOps, and Agile.

Let's connect!

<Author author={jloos} />

</Components.Callout>
