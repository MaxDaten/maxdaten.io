---
title: 'Check your Engine: Work In Progress Limit Matters'
slug: 2025-07-26-check-engine-work-progress-limit-matters
excerpt:
    Being busy is not inherently productive. Why limiting Work In Progress (WIP) is a best-practice
    for improving a development team’s effectiveness and indicator of process health.
date: 2025-07-26T01:52:21.109Z
updated: null
authorId: jloos
hidden: false
tags:
    - agile
    - kanban
    - productivity
    - software-development
keywords:
    - agile development
    - cost of delay
    - developer frustration
    - DORA metrics
    - kanban
    - scrum
    - software development process
    - team productivity
    - wip limit
    - work in progress limit
    - continuous delivery
---

In recent years, I have worked on projects where keeping developers busy was a primary rule.
Understandably, developers are expensive. Keeping them busy is one way of getting the most value out
of them, right?

This is not only a common management view; often developers themselves are eager to stay busy. For a
freelancer, being busy is billable—spinning in your chair while waiting for a review doesn't pay the
bills. As a developer, it's easy to keep yourself busy and signal this to others, including
management. You are there to work, so you pull a new ticket and report your progress in the daily
stand-up while your other ticket is waiting for a review or some other feedback. But is that really
productive? Being busy is not inherently productive and can even be counterproductive, causing more
harm than value.

## Keep Pushing Down the Line

![Convey belt with yellow packages, rough minimalistic sketch](/src/lib/assets/images/posts/2025-07-26-check-engine-work-progress-limit-matters/a160e274-a456-447f-9052-9dfb66c2b1e8.png)

A common pattern I've observed is the decoupling of ongoing developer work. The result is often an
attempt to optimize the number of tickets in progress—not by decreasing the count, but by increasing
it. This isn't a willful act, but rather the result of a sloppy habit gaining the upper hand.

> DE: Das Gegenteil von gut ist gut gemeint
>
> EN: The opposite of good is good intentions
>
> _– German proverb_

In an attempt to be productive and valuable, developers can harm the project by continually "pushing
down the line." Your implementation is done but requires approval. Why not stay busy in the meantime
by starting the next work package? It has to be done anyway! What’s the alternative, spinning in
your chair? Is there any problem with interleaving work to maximize throughput?

There are a lot of problems with this approach of unintentionally increasing the amount of work in
progress. Most of them have been common sense for a long time, but to underline my conclusion, let's
examine a few.

## The Problem of Decoupled Work

To be fair, there are projects where decoupling work is the only way forward, for example, in a
multi-timezone or decentralized open-source project. But often enough, developers work more
traditionally together in a company setting. Sure, fully remote teams are more common now, but it's
also easier than ever to collaborate with live interactions. In short: there is often no reason not
to have direct and ongoing interactions between developers and business people.

> 4. Business people and developers must work together daily throughout the project.
>
> _– Agile Manifesto_

From a developer's perspective, there shouldn't be a "personal" ticket. Nothing a developer starts
should be worked on exclusively. It's harmful and unproductive to have five developers working on
five different tickets simultaneously because it hinders direct interaction and raises communication
overhead exponentially. In this scenario, when one developer needs help, they have to contact and
onboard at least one other developer. This involves context switching, introduces delays, and often
results in suboptimal support. Sometimes you have to call in a third developer, and so on.

It's more effective to work together on one ticket. Studies indicate that pairing or ensemble
programming leads to higher quality code
[1](https://ps.ipd.kit.edu/downloads/ka_2003_analyzing_cost_benefit_pair_programming.pdf),[2](https://nrc-publications.canada.ca/eng/view/accepted/?id=fa72ee73-13b7-41db-9d23-9928b9618ff1).

> 6. The most efficient and effective method of conveying information to and within a development
>    team is face-to-face conversation.
>
> _– Agile Manifesto_

If this is your normal modus operandi, you tend to have the ideal information flow within your team.
Are you able to work efficiently on multiple topics at the same time? Probably not. Why should a
development team, if parallelizing work is not advised and considered harmful? It should also be
common sense that working together to find an excellent solution is better for the health of a
project than working in isolation. A team should share the same goals, the same understanding of
problems, and their solutions—so why shouldn't they find those solutions in a shared effort, too?

## Cost of Delay & Missing Early Feedback

> 1. Our highest priority is to satisfy the customer through early and continuous delivery of
>    valuable software.
>
> _– Agile Manifesto_

Being agile is all about getting feedback as early as possible and acting on it. This enables
continuous value delivery, which is not only a selling point for management but also raises the
self-efficacy and well-being of the development team when they see they can deliver value quickly
and with less friction.

> 3. Deliver working software frequently, from a couple of weeks to a couple of months, with a
>    preference for the shorter timescale.
>
> _– Agile Manifesto_

We've come a long way; it's now more common to have daily releases than releases every three years.
The implementation may not always be perfect, but the common understanding is that shorter release
cycles are better than longer ones.

Abandoning a ticket, even for half a day while waiting for a review, carries the same problems as a
three-year release cycle, albeit on a different scale. The problem isn't negligible just because
things were worse in the past. We came this far because we know that early feedback is less costly
than delayed feedback. The same is true when a change is deployed one day later than optimal. The
entire [developmemt feedback loop](http://www.extremeprogramming.org/introduction.html) is about
gaining feedback as early as possible: from linting your code and writing tests to pairing with
colleagues, deploying to production, and actually seeing customers use your change. Observe and
adapt. This isn't just about a customer complaining about a bug (which they often don't), but also
about gaining feedback that your change, fully integrated, has not introduced unintended behavior.

When this feedback is delayed, the "observe and adapt" cycle is postponed to a phase where the
change is less present in your mental context. You might run into the same category of problems as
the infamous "big bang" releases, especially if your team resolves a congested board the next day.
The problem is even bigger with an anti-pattern like late-integrating branches, because all changes
are integrated as late as possible, not as soon as possible.

![Sketch of the agile concept 'Observe and Adapt': 'Observe': a system of gears under a magnifying glass, 'Adapt': Drawing a new Gear](/src/lib/assets/images/posts/2025-07-26-check-engine-work-progress-limit-matters/f0f32f9f-13f8-4538-9f50-ffaac3d72d66.png)

## Advocating for a Hard Work In Progress Limit

> Work In Progress (WIP) limits are fundamental constraints that cap the maximum number of tasks
> actively being worked on at any given time in software development processes. These limits serve
> as critical tools for optimizing team productivity, improving software quality, and ensuring
> sustainable workflow management in agile environments.
>
> ~ Perplexity

What is the solution™ to the problem of parallelized work? A Work In Progress (WIP) limit is not a
silver bullet or even a solution in itself. **It's an indicator that the process has a defect.** The
line is congested, the pipe is clogged, your engine has a problem, and the check engine light is
blinking. A WIP limit is a simple but effective metric that is easy to maintain and understand. Like
other metrics, it doesn't solve problems; it makes them transparent. A hard WIP limit is an
artificial barrier on an otherwise unlimited resource (unless you are working with a physical
board).

The WIP limit for your ongoing work is the check engine light for your process. It doesn't point to
a specific problem—it's not an error code—it just indicates that something should be discussed and
improved. Because it is so often ignored or not even considered, I see a WIP limit as more important
than the unmotivated Retrospective rituals I have often attended.

[DORA](https://dora.dev/capabilities/wip-limits/) suggests keeping the WIP limit as small as
possible—to a degree you actually have to work to achieve. It then automatically ceases to be just
the next dogmatic ritual. It won't work as the next metric you have to game, like story points for
sprint velocity. If you don't treat WIP as a dogmatic rule but understand the motivation behind it,
you will start asking the correct and important questions. You will be forced to challenge the
common "this is how we work."

- Do you really need a decoupled code review process?
- Why don't we deploy on Fridays? Are we collecting tickets for Monday?
- Why do we spend so much time in planning when a ticket still gets stuck waiting for feedback from
  domain experts? Can we integrate them better into our process?
- Should we deploy behind feature flags?
- Are our increments too big?
- Are we embracing active knowledge sharing, or are we misaligning our skills by decoupling our
  work?
- Do we have a bottleneck in the team because only one person can solve a problem or review a
  change?
- Where can I help to finish something?

## The Rules Aren't The Rules. They Are Questions in Disguise.

Despite all the recent fuss about agile and the decline of Scrum, a fundamental understanding of its
principles and rituals is that they are meant to start discussions. Much of the Scrum framework is
just a vehicle for focused conversation. The WIP limit does its part. Instead of keep pushing down
the line, solve the congested conveyor belt.

For this, you need interaction within the team and probably with those outside of it. This brings
actual value to your daily routine: instead of reporting progress, you start discussing how to solve
actual problems. Starting the next ticket while your previous one waits is just avoiding an
important chance to challenge your team's productiveness. Conflict aversion doesn't resolve the
underlying reasons for problems. And unsolved problems tend to grow in importance, so it's better to
tackle them early than during an incident. If you feel comfortable deploying on Fridays because you
are in a position to deploy anytime, then pushing out an emergency fix to solve a Friday incident
becomes routine.

Because of Goodhart's law, a metric shouldn't be a goal. The WIP limit is hard to game, which makes
it a valuable metric. A WIP limit becomes very annoying if it's considered merely dogmatic. The more
exceptions to the rule you allow, the less valuable the metric becomes, because you are just
avoiding the discovery of the underlying problem. You can't keep ringing an alarm without devaluing
its purpose. So, it's better to consider the WIP limit a hard limit the team is not allowed to raise
or cross. Only by feeling the pain of a scarce resource do you learn to use it efficiently. Treat a
hit limit as a blocker, so you actively coordinate and work on resolving the impediment.

## References

- [Little's Law: Improving Lead Time by Reducing WIP](https://productdeveloper.net/little-law/)
- [Being Less Busy and Working together is SO HARD](https://cutlefish.substack.com/p/tbm-4052-why-limiting-wip-starting?s=r)
