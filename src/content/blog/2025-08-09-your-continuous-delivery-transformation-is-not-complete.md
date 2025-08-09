---
title: 'Your Continuous Delivery Transformation is Not Complete'
slug: 2025-08-09-your-continuous-delivery-transformation-is-not-complete
coverImage: src/lib/assets/images/posts/2025-08-09-your-continuous-delivery-transformation-is-not-complete/cover.png
excerpt:
    Only 10% of organizations are actually doing continuous delivery well, is yours one of them?
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
    - agile development
    - continuous delivery
    - trunk-based development
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

We came a long way, but most organizations are just applying half of the essential CD practices. The
good news? Most organizations have tackled the cultural challenges around pipeline integrity,
autonomous teams, and process discipline according to the recently released
[State of Continuous Delivery in 2025](https://continuous-delivery.co.uk/cd-assessment/index)
([PDF](https://continuous-delivery.co.uk/downloads/The%20State%20of%20CD%202025.pdf)). The report
analyzed nearly 100 organizations and revealed: **only 10% of organizations are actually doing
continuous delivery well and can be considered _experts_**!

This a short follow-up to my previous post about
[Check your Engine: Work In Progress Limit Matters](/2025-07-26-check-engine-work-progress-limit-matters);
I want to highlight the latest continuous delivery assessment from Dave Farley, which was published
shortly after my post. This report backs up my observations from the previous post with interesting
facts.

## The Three Critical Gaps

The report identifies three main technical gaps that separate the 10% of experts from everyone else:

1. **Trunk-based development** - Still branching like it's 2005
2. **Test automation** - Manual testing bottlenecks everywhere, unreliable or unmaintainable tests
3. **End-to-end pipeline automation** - Half-automated is not automated

What's particularly telling is the correlation between trunk-based development and test automation.
Organizations that excel at both are the ones actually delivering continuously. Those struggling
with one typically struggle with both.

## 14 Attributes Essential for Continuous Delivery

These are the 14 attributes essential for continuous delivery, identified by the report:

1. Releasability
2. Deployment Pipeline
3. _**Continuous Integration**_
4. _**Trunk-Based Development**_
5. Small Autonomous Teams
6. Informed Decision-Making
7. _**Small Steps**_
8. _**Fast Feedback**_
9. Automated Testing
10. Version Control
11. One Route to Production
12. Traceability
13. Automated Deployment
14. Observability

I emphasize the importance of **small steps** and **fast feedback** in the list to highlight
important goals you can achieve with a low work-in-progress limit. You only have true **continuous
integration** if you progress in **small steps** and synchronize changes via **trunk-based
development**. Work-in-progress limits are essential to ensure that you're not overloading your
project with too many changes that still don't have their feedback from all your automatization,
testing and observability tools when integrated with all other changes.

> The complexity of changes is exponential to the number of changes.

## The Real Question

Are you part of the 90% who think they're doing continuous delivery, or the 10% who actually are?

The path forward isn't about better maintenance processes or more sophisticated branching
strategies. It's about hardening the skill set of developers to change common technical practices
that make continuous delivery actually continuous.

<Components.Callout type="success"> Need Support achieving Continuous Delivery? I'm offering
consulting services for your organization and project as well as hands-on training and development
support, with a strong focus on continuous delivery practices, DevOps, and Agile.

Let's connect!

<Author author={jloos} />

</Components.Callout>
