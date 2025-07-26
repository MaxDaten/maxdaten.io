---
title: 'Why a Work In Progress Limit '
slug: ''
coverImage: ''
excerpt: ''
date: 2025-07-26T01:52:21.109Z
updated: null
hidden: true
tags: []
keywords: []
---

In recent years I was working in some projects where keeping developers busy was one of the prime
rules. Understandable, developers are expensive. Keeping them busy is one way of getting most value
out of the developer, right? This is not only often the management view, often the developer
themself are also very eager keep them self busy. For an external freelancer in a project being busy
is billable, it is actually not paying the bills to spin the chair while waiting for a review. As a
developer it's quite easy to keep yourself busy and to indicate it to the others including the
management level. You are here for work, so you will pulling a new ticket and do your daily
reporting in the stand up that you are progressing while your other ticket is waiting for a review
or some other kind of feedback. But is that really productive? Being busy is not inherently
productive and can also be the oppsite of productive by indicating more harm than value.

## Keep Pushing Down the Line

A common pattern I observed is decoupling the onging work of developers. The result is often
optimizing amount of tickets in progress, but not by decreasing the amount instead increasing it.
It's not a willingly attempt, but mostly by getting a sloppy habit gain the upper hand.

> DE: Das Gegenteil von gut ist gut gemeint
>
> EN: The Opposite of good are good intentions
>
> _– German proverb_

In an attempt to be productive and valuable, developers are doing harm to the project by keep
pushing down the line. Your implemenation is done but requiring approval? Why not keep busy in the
meantime by start with the next work package? It has to be done nevertheless! What would be the
alternative, spinning in the chair? Is there any problem in interleaving work for maximizing
throughput?

There are a lot of problems with this approach of unwillingly increasing the amount of work in
progress. Most of them are common sense for a long time, but to underline my conclusion, lets
examine some of them:

## Decoupling Work

To be fair, there are project where decoupling work is the only way, for example in a multi-timezone
or in a decentrialized open source project. But often enough developers are working more
traditionally together in a project for a company. Sure fully remote teams are more common now, but
it's also easier to collaborate with live interactions these days. In short: often there is no
reason not to have direct and ongoing interactions between developers and also business people.

> 4. Business people and developers must work together daily throughout the project.
>
> _– Agile Manifesto_

From the developer perspective, there shouldn't be a personal ticket. Nothing a developer is
starting exclusivly. It's actually harmful and unproductive to have five developers working on five
different tickets simultaniouly, because it hinders direct interactions between developers and
raising the communication overhead by the factor of the tickets. In this scenario, when developer
needs help to solve his ticket, there has to be effort to contact and onboard atleast another
developer. This involves context switching, introduces delay and brings often suboptimal support.
Sometimes you have to call in a third developer and so on.

It's more effective to work together on one ticket, and studies are indicating, that pairing or
essemble programming leads to higher quality code
[1](https://ps.ipd.kit.edu/downloads/ka_2003_analyzing_cost_benefit_pair_programming.pdf),
[2](https://nrc-publications.canada.ca/eng/view/accepted/?id=fa72ee73-13b7-41db-9d23-9928b9618ff1).

> 6. The most efficient and effective method of conveying information to and within a development
>    team is face-to-face conversation
>
> _– Agile Manifesto_

If this is your normal modus operandi, you tend to have the ideal information flow withing your
team! Are you able to work efficient on multiple topics at the same time? Probably not, why should a
development team, if parallizing work is not advised and considered harmful. It also should be
common sense, that working together to find a excelent solution to a problem is better for the
health of a project than working in isolation. A team should share the same goals, same
understanding of problems and their solution, why they shouldn't find a solution in a shared effort,
too?

## Cost of Delay & Missing Early Feedback

> 1. Our highest priority is to satisfy the customer through early and continuous delivery of
>    valuable software.
>
> _– Agile Manifesto_

Being agile is all about getting feedback as early as possible and to act on it. This enables
continous value delivery, which is not only a selling point for the management and business people,
it's also
[raising the self-efficacy and well-being of the development team](https://dora.dev/capabilities/well-being/#burnout),
when they see and feel they can deliver value to the customer quickly with less friction.

> 3. Deliver working software frequently, from a couple of weeks to a couple of months, with a
>    preference to the shorter timescale.
>
> _– Agile Manifesto_

We came a long way where it's now more common to have daily releases than having releases every
three years. Probably not always perfectly implemented, but at least the common understanding is,
that shorter release circles are better than longer.

But abonding a ticket even for half a day, because some review is waiting, is bearing the same
problems of a three year release circle, albeit on a different scale. It's not negligable because
back in the days it has been far worse. We came this way because we know that early feeedback is
less costly than delayed feedback. Same is true when a change is deployed one day later than
optimal. Actually the whole
[developmemt feedback loop](http://www.extremeprogramming.org/introduction.html) is about gaining
feedback as early as possible: from linting your code, writing tests, pairing with colleges over
deploying to production to actually seeing customers using your change. Observe and adapt. Not only
because a customer is complaining about a bug (which they often don't even do), but also because you
are gaining feedback of your change fully integrated with the production system. Even this is
already valuable feedback, that your change does not introduced any unintended behaviour.

When this feedback is dalayed the observe and adapt is postponed to a phase where the change is less
present in your tiny context window. And you might run into the same category of problems of the
famous big bang releases, because your team resolved the congested board the next day. The problem
is even bigger with an PR/branching anti-pattern, because all changes will be integrated as late as
possible, not as soon as possible.

## Advocating for a Hard Work In Progress Limit

> Work In Progress (WIP) limits are fundamental constraints that cap the maximum number of tasks
> actively being worked on at any given time in software development processes. These limits serve
> as critical tools for optimizing team productivity, improving software quality, and ensuring
> sustainable workflow management in agile environments. ~~~ Perplexity

What is the solution™ to the stated problem of parallized work? Sorry, the Work In Progress (WIP)
is not the silver bullet and not even a solution. It's an indicator that the process has a defect.
The line is congested, the pipe is clogged, your engine has a problem and the check engine light is
blinking. The Work In Progress Limit is a very simple but effective metric, which is very easy to
maintain and very easy to understand. Like other metrics, they don't solve problems, they make
things transparent. A hard WIP Limit is an artificial barrier of a otherwise unlimited resource,
unless you are working with a physical board.

The work in progress limit of your ongoing work is the check engine light of your process. It's
pointing not to a specific problem, it's not an error code, it just indicates, something should be
discussed and improved. As as often it is completly ignored nor considered, I see a WIP limit as
more important than the unmotivated Retrospective rituals I often attended.

[DORA](https://dora.dev/capabilities/wip-limits/) is suggesting to keep the WIP Limit as small as
possible, to a degree you actually have to work for to achieve. Then it automatically cheases to be
just the next dogmatic ritual. It won't work as the next metric you have to game like story points
for the sprint velocity. And if you don't treat the WIP as a dogmatic rule but understand the
motivation behind it, you will start asking the correct and important questions. And you start to
challenge common "this is how we work", because you are forced to.

- Do you really need a decoupled code review process?
- Why don't we deploy on Fridays and collecting tickets for Monday?
- Why do we spend so much time in planning, when the ticket is still stuck, because we are waiting
  on feedback from domain experts? Can we integrate domain experts better into our process?
- Should we deploy behind feature flags?
- Are our incremets to big?
- Are we embracing active knowledge sharing or do we even align our skills by decoupling our work?
- Do we have a bottleneck in the team, because only one is able to solve a problem or review a
  change?
- Where can I help to finish something?

## The Rules Aren't The Rules. They Are Questions in Disguise.

Beside all the recent fuzz about agile and the decline of SCRUM, one fundamental understanding of
all the principles and rituals is actually to start discussions. A lot in the SCRUM framework is
just the vehicle for focused discussion. The WIP Limit is doing it's part. Instead of keep pushing
down the line, solve the cogested convey belt.

For this you need interaction within the team and probably with the outside of the team. This brings
actual value in your daily: instead of reporting progress you start the discussion about solving
actual problems. Starting with just the next ticket while your previous ticket is waiting down the
line is just avoiding an important chance to challenge your team productiveness. Being averse of
conflicts is not resolving the underlaying reason of problems. And unsolved problems tend to rise
and gain importance, so better to tackle them early than later during an incident. If you feeling
comfortable in deploying fridays because you are in the position to deploy anytime, then pushing out
an emergency fix to solve a Friday incident is routine.

Because of Goodhart's law, a metric shouldn't be a goal. The WIP Limit is hardly gameable, which
makes it a valuable metric. A WIP Limit tends to get very annoying if just considered dogmatic. The
more exceptions of the rule are allowed the less valuable the metric becomes, because you just
avoiding finding of the underlaying problem. You can't ring an alarm without devaluing the purpose
of the alarm. So better consider the WIP Limit as a hard limit the team is not allowed to rise or to
cross. Only by feeling the pain of a scarce resources you learn to use the resource efficient. Treat
a hit limit as a blocker, so you activly coordinate and working on resolving the impediment.

## References

- [Little's Law: Improving Lead Time by Reducing WIP](https://productdeveloper.net/little-law/)
- [Being Less Busy and Working together is SO HARD](https://cutlefish.substack.com/p/tbm-4052-why-limiting-wip-starting?s=r)
