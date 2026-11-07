# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Fans discover creators, follow their work, interact with accessible content, and manage their account and memberships.
- Creators need a mobile responsive workspace to manage their profile and content, alongside their own fan experience.
- The platform owner and authorized team need a separate workspace for oversight, moderation, transactions, subscriptions, analytics, auditing, and supported content and brand customization.

## Product Purpose

Privana is a Brazil-first, adult-capable creator subscription platform. Its goal is an intuitive fan experience, practical daily creator workflows, and accountable owner operations. The owner confirmed this premise on November 6, 2026.

## Positioning

The category is creator memberships, with OnlyFans, Fansly, and Fanvue as functional references. Privana must develop its own recognizable identity and language. A more specific differentiated positioning and substantiated marketing claims remain to be approved during M01.5.

## Operating Context

Brazil is the initial market, followed by wider South American and international expansion. Portuguese for Brazil and Brazilian currency conventions take priority. Creators must be able to manage existing daily workflows on a phone. Staff operations need clear permissions and readable operational information.

## Capabilities and Constraints

- Email and password are the current authentication method; transactional email uses the Resend SDK.
- The existing application includes discovery, creator profiles, a feed, saved content, memberships, messaging, notifications, settings, profile/post management in Studio, and an owner workspace with CMS.
- Existing integrations use Prisma Postgres, Upstash Redis and private object storage. The application must remain practical to deploy on Vercel.
- Payments remain simulated. Current browser checkout is a no-charge, no-entitlement demonstration; authoritative sandbox commerce is a later milestone. Polar is removed. Selecting and enabling a live provider is a separate future decision.
- Creator review, age assurance, financial state, media permissions, and staff authorization are distinct concepts. UI must accurately represent the current server state and must not imply capabilities or assurances that have not been implemented.
- M01.5 redesigns existing behavior before new feature work. Vault, scheduling, automation, advanced owner operations, real age-provider integration, and live billing remain separate roadmap work.
- Code stays modular by domain, with focused components and functions. Existing working data and business rules are retained.

## Brand Commitments

Privana is the current product name. The owner requested a royal purple identity, professional typography, a distinctive creator-platform experience, and a polished alternative to generic dashboard or Facebook-like styling. A logo, precise palette, typefaces, and final visual direction are not yet approved.

## Evidence on Hand

- Repository source and the existing rendered application establish the implemented baseline.
- Seeded demo creators and accounts support testing; they are not evidence of real customers, revenue, verification, or testimonials.
- Linear owns the delivery backlog. M01 is complete; M01.5 is the redesign milestone being refined.
- The owner has not supplied validated conversion uplift, customer counts, original photography rights, or approved commercial claims. Future designs must not fabricate them.

## Product Principles

1. Prioritize useful creator workflows and a coherent fan experience over decorative complexity.
2. Make the current access, publication, financial, and moderation states understandable and truthful.
3. Protect private content and preserve server authority while giving clear feedback for user actions.
4. Support owner and team customization through the controls the platform actually provides.
5. Treat mobile usability, accessibility, Portuguese copy, and performance as product quality requirements.
