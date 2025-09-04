---
title: "Continuous Care: Why You Don't Need a Maintenance Process"
slug: 2025-07-31-continuous-care-no-to-maintenance-processes
excerpt:
    'All you need is: No Maintenance backlog – No maintenance lane – No maintenance days or Sprints.'
date: 2025-07-31T01:52:21.109Z
updated: null
authorId: jloos
hidden: true
tags:
    - agile
    - kanban
    - productivity
    - software-development
    - maintenance
keywords:
    - agile development
    - developer frustration
    - kanban
    - scrum
    - software development process
    - team productivity
    - continuous delivery
---

What I learned in recent projects, separating maintenance from your daily feature work is causing
high frustration among the development team. If you understand feature work as the value-raising
work for the company, maintenance is often the unloved stepsister. Preserving value is as important
as gaining new value. I perceived that both business people and engineering agree on that, but there
is still conflict in the implementation of how maintenance is performed.

Even when there was a clear commitment to maintenance in the process, I was hearing a lot of "we had
no time for maintenance" from the development team. On otherwise the management was promoting "we
have 30% maintenance per sprint", "we have a maintenance lane". So is there never been enough
maintenance for a developer? Is this just a hollow promise to support maintenance from bad
management, just to sugar coat to squeeze more out of development?

## Communication Gap and a Bug in the System

There is a communication gap and a huge implementation bug in observed processes.

## Continuous Care: Empty the Dishwasher

Not inventing a new bussword, maintenance should be part of the work. Keeping boyscout rule in mind,
just maintain the code as you touch it. If you are reading logs and see some deprecation warnings,
fix them right away. Even looking it up in a sin backlog, if someone already added the deprecation
warnings, it is often unnecessary overhead. Emptying the dishwasher is unavoidable if you want to
use it again. No way in prioritizing it away. It can be annoying, but the passiveness falls into the
category of
[recklessness technical debt](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html), which is
the worst category of technical debt, like skipping your
[firebase authentication at all](https://www.engadget.com/cybersecurity/tea-app-suffers-breach-exposing-thousands-of-user-images-190731414.html).

Sure, there is a huge difference between deprecation warnings and skipping authentication. But you
might plan to bump the dependency version in question from time to time, and maintaining your
dependencies will keep your options more reachable and dependency updates controllable.
