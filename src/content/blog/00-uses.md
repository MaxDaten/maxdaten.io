---
title: 'My 2025 Developer Tech Stack: Tools for DevOps & Productivity'
slug: 00-uses
coverImage: src/lib/assets/images/posts/00-uses/cover.png
excerpt:
    Explore the complete 2025 tech stack I use for DevOps consulting and software development. A
    deep dive into my favorite tools, from Nix and Kubernetes to Zed and SvelteKit.
date: 2025-07-01T05:00:00.000Z
hidden: false
authorId: jloos
tags:
    - development
    - devops
    - productivity
    - tools
keywords:
    - Cloud Platforms
    - developer tech stack
    - Development Environment
    - Development Tools
    - devenv
    - DevOps
    - DevOps toolkit
    - Docker
    - Google Cloud Platform
    - Infrastructure as Code
    - Kubernetes
    - NixOS
    - Productivity Setup
    - Programming Languages
    - Software Development
type: page
updated: 2025-07-18T01:11:18.668Z
---

In this post, I provide a comprehensive overview of the software development tools and technologies
that form my core DevOps toolkit. This is the tech stack for a software consultant that I rely on
daily, refined over years of building complex systems. You'll find everything from my development
environment and infrastructure choices to the hardware and productivity apps that keep me efficient.

## Core Software Development Environment

### Editor & Terminal

- **[Zed](https://zed.dev/)** - Code editor for its speed, ai assistance and collaborative features
- **[JetBrains IDEs](https://www.jetbrains.com/)** - IntelliJ IDEA, WebStorm, and other
  language-specific IDEs for complex projects
- **[Ghostty](https://mitchellh.com/ghostty)** - Fast, feature-rich terminal emulator
- **[Fish](https://fishshell.com/)** - Smart and user-friendly command line shell with excellent
  autocompletion

### Project Environment Management

- **[Nix](https://nixos.org/)** - Reproducible package management and system configuration
- **[devenv](https://devenv.sh/)** - Developer environments with Nix for per-project reproducible
  setups, topic for an upcomming post about how I setup project workspaces with devenv
- **[direnv](https://direnv.net/)** - Automatically loads and unloads environment variables based on
  directory

### Languages & Runtimes

- **[Haskell](https://www.haskell.org/)** - Primary functional programming language, especially for
  complex business logic
- **[Kotlin](https://kotlinlang.org/)** - Modern JVM language for Android development and backend
  services, strong eDSL capabilities, providing quiz-buzz backend
- **[Svelte & SvelteKit](https://svelte.dev)** - Fueling this blog and quiz-buzz web frontend
- **[TypeScript](https://www.typescriptlang.org/)** - For full-stack web development and tooling
- **[Python](https://www.python.org/)** - Automation, data processing, and rapid prototyping
- **[Scala](https://www.scala-lang.org/)** - Functional programming on the JVM for data processing
  and distributed systems
- **[Java](https://www.oracle.com/java/)** - Enterprise applications and Spring-based microservices

## My Go-To Infrastructure & DevOps Toolkit

![A cinematic, birdeye view of a developer in a dark, cluttered apartment reminiscent of The Matrix. The room is filled with multiple CRT monitors, wires, and old computer parts. One monitor displays the green Matrix code. The lighting is dim, primarily from the screens, with harsh shadows and a violet neon glow from a window. The style is gritty, late-90s cyberpunk with a rough, Animatrix sketch-like quality, conveying a sense of unease and digital confinement.](/src/lib/assets/images/posts/00-uses/67c3e2f3-8732-44e4-a8b5-b876b6c3c59.png)

### Cloud Platforms

- **[Google Cloud Platform](https://cloud.google.com/)** - Primary cloud provider for most client
  projects
- **[Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine)** - Managed
  Kubernetes for container orchestration
- **[Google Cloud Storage](https://cloud.google.com/storage)** - Object storage and backup solutions

### Infrastructure as Code

- **[NixOS](https://nixos.org/)** - Declarative system configuration and reproducible deployments
- **[Terraform](https://www.terraform.io/)** - Multi-cloud infrastructure provisioning
- **[Helm](https://helm.sh/)** - Kubernetes package management
- **[Kustomize](https://kustomize.io/)** - Kubernetes configuration management

### CI/CD & Automation

- **[GitHub Actions](https://github.com/features/actions)** - Primary CI/CD platform
- **[Flux CD](https://fluxcd.io/)** - GitOps toolkit for Kubernetes deployments and continuous
  delivery

### Monitoring & Observability

- **[Prometheus](https://prometheus.io/)** - Metrics collection and alerting, Google Cloud Managed
  Service for Prometheus for my own cluster
- **[Grafana](https://grafana.com/)** - Visualization and dashboards
- **[OpenTracing](https://opentracing.io/)** - Vendor-neutral distributed tracing standard and
  instrumentation

## Security & Secrets Management

- **[SOPS](https://github.com/mozilla/sops)** - Secrets encryption with KMS integration
- **[cert-manager](https://cert-manager.io/)** - Automated TLS certificate management

## Development Tools

### Version Control & Collaboration

- **[Git](https://git-scm.com/)** - Preferable with trunk-based development supported by a strong CI
- **[GitHub](https://github.com/)** - Primary code hosting and collaboration platform
- **[Conventional Commits](https://www.conventionalcommits.org/)** - Standardized commit message
  format

### Local Development

- **[Docker](https://www.docker.com/)** - Containerization for development and testing
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container application orchestration
- **[Telepresence](https://www.telepresence.io/)** - Local development against remote Kubernetes
  clusters

### API Development & Testing

- **[Postman](https://www.postman.com/)** - API development and testing
- **[curl](https://curl.se/)** - Command-line HTTP client
- **[HTTPie](https://httpie.io/)** - User-friendly HTTP client
- **[OpenAPI](https://www.openapis.org/)** - API specification and documentation

## My Hardware Setup for Development and Local AI

### Computing

- **MacBook Pro 16" (Apple M4 Max, 128 GB)** - Primary development machine
- **2 External 4K Monitor** - Extended workspace for productivity
- **GeForce RTX 5090, Ryzen 7 9800X3D, 64GB RAM** - Dual Boot Machine for local AI Development

### Accessories

- **AirPods Pro Gen 2** - Focus during deep work sessions and online calls

## Productivity Setup & Communication

### Organization

- **[Notion](https://www.notion.so/)** - Collecting project ideas, organizing my reading list
- **[Calendly](https://calendly.com/)** - Client consultation meeting scheduling
- **[SideNotes](https://www.apptorium.com/sidenotes)** - Quick note-taking and task management in
  the sidebar
- **[Raycast](https://www.raycast.com)** - Quick querying local ollama models, looking up nix
  packages, hyperkey shortcuts for quick launching tools, etc.

### Communication

- **[Slack](https://slack.com/)** - Team communication and client coordination
- **[Zoom](https://zoom.us/)** - Video conferencing for client meetings
- **[Discord](https://discord.com/)** - Private and professional communication, channel management
  and engagement

## Learning & Resources

### Documentation & Reference

- **[Kubernetes Documentation](https://kubernetes.io/docs/)** - Official K8s reference
- **[Google Cloud Documentation](https://cloud.google.com/docs)** - GCP service references
- **[NixOS Manual](https://nixos.org/manual/nixos/stable/)** - System configuration guidance
- **[Noogle](https://noogle.dev)** - Finding functions and implementations in nix

### Continuous Learning

- **[Hacker News](https://news.ycombinator.com/)** - Tech industry news and discussions
- **[Reddit r/devops](https://reddit.com/r/devops)** - Community insights and best practices
- **[CNCF Landscape](https://landscape.cncf.io/)** - Cloud-native technology ecosystem overview

---

This entire developer tech stack is constantly evolving, but it currently provides the power and
flexibility needed to tackle modern software and infrastructure challenges. I hope this look into my
DevOps toolkit gives you some new ideas for your own workflow.
