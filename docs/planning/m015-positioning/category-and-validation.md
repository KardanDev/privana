# KAR-139 — Category evidence and UX validation

**Checked November 7, 2026.** Public primary help pages only. These observations inform a proposed brief; they are not interviews, authenticated competitor journeys, a feature-parity audit or evidence that Privana already matches them.

## Category patterns

| Primary source / access date | Observed pattern | Privana decision / limit |
| --- | --- | --- |
| [Fansly: following versus subscribing](https://help.fansly.com/en/articles/12313819-difference-between-following-and-subscribing), accessed 2026-11-07 | Separates following from paid membership and explains that membership renews unless renewal is disabled | Keep follow, interest and recorded membership as separate concepts. Privana has no active billing/renewal flow; do not borrow that commercial promise. |
| [Fanvue: editing a creator profile](https://help.fanvue.com/en/articles/7860494-creators-how-to-edit-your-profile), accessed 2026-11-07 | Identifies display name/handle/profile media as editable profile fields and explicitly describes profile imagery as public | Explain visibility at input. Privana account name and creator display name have different uses; uploading a public avatar is not uploading protected post media. |
| [Fanvue: subscriptions](https://help.fanvue.com/en/articles/7860795-how-do-fanvue-subscriptions-work), accessed 2026-11-07 | Explains recurring access, separate PPV purchases and what changes when a membership ends | Prefer explicit scope and consequence near a decision. Privana's future PPV, renewal and expiry rules remain its own roadmap contracts; do not copy Fanvue's rules. |
| [OnlyFans about page](https://onlyfans.com/about), attempted 2026-11-07 | The browsing tool could not open the page; no usable primary-page content was obtained | Retain OnlyFans as the owner's functional reference. Make no new OnlyFans feature, interface, pricing or operating-policy assertion from this attempt. Use accessible primary sources above for this comparison. |

Do not copy competitor language, trademarks, screenshots, visual assets, payment terms or verification claims. No claim is made that these familiar patterns are unique to Privana. The Brazil-first combination of local language, practical phone tasks and clear state boundaries is a direction to test.

## Success questions and proposed measures

Use the committed KAR-137 samples and current routes as the baseline. Measure the same tasks against later KAR-144 prototypes before changing production screens. Record first action, completion, wrong turns, explanation in the participant's own words and assistance needed. Preserve failed attempts and participant disagreement rather than reporting only successful clips.

The following are hypotheses, with proposed pilot thresholds for owner review. No new participants were recruited, task timings measured, experiment run or conversion uplift established in KAR-139. A small moderated sample supports finding problems, not population-level conversion claims.

| Hypothesis / rationale | Repeatable task and baseline fixture | Proposed pilot measure / implementation owner |
| --- | --- | --- |
| Distinct fan/creator entry reduces ambiguity about account purpose; task-first language | Anonymous, 390px and desktop: “Find a creator to follow, then show where you would apply to publish.” Baseline `/explore`, creator profile and Studio entry | In a five-person exploratory round, at least four find both paths without assistance. Record wrong first clicks and whether anyone expects a second account. KAR-143–144, then KAR-151. |
| A concrete visibility statement reduces incorrect privacy assumptions | Fan: explain who can see the registration/account name, email and creator profile fields before saving | Every pilot participant distinguishes public/participant-visible name from login email; any belief that a legal name must be public is a revision trigger. KAR-140, KAR-152, KAR-159, KAR-161. |
| Explicit interest/demo labels prevent false entitlement and payment expectations | Seeded fan: register interest, inspect the test card/Pix path and explain the outcome without sending real money | Every participant identifies zero charge and zero new access; record any expectation of an automatic launch email. No revenue/completion funnel is inferred. KAR-140, KAR-156, KAR-160. |
| Status and action language help a creator complete the next task on a phone | Pending creator: identify the publication restriction; active creator: locate public profile editing, draft save and publication. Use separate safe test work in the later story | At least four of five exploratory creator participants locate the intended next action unassisted; all distinguish platform approval from identity/age assurance. Record task time as a baseline, not a promised speed gain. KAR-144, KAR-161–163. |
| Precise verbs prevent operational mistakes | Restricted CMS editor: explain save versus publish versus restore. Permitted owner: explain local access revocation versus refund | Every operator in the pilot describes the correct consequence before confirming. Do not publish/revoke merely to gather baseline evidence. KAR-144, KAR-165–168. |

The owner chooses participants and capacity; five is a proposed exploratory round size, not a scheduled commitment or statistical-power calculation. Cross-check critical comprehension qualitatively even if a threshold is met. Native-device, keyboard, screen-reader and actual responsive implementation checks belong to the later screen/acceptance stories; screenshots alone do not satisfy them.

## Review and adoption

KAR-139's review asks the owner to select or revise the [brief](brief.md) and [vocabulary](language.md). KAR-140 can draft the dependent copy proposal from this explicit working direction, but it cannot silently convert it into an approved public promise. Land KAR-139 before adopting its wording downstream. Record unresolved policy/support inputs there rather than inventing them.

KAR-128 completes only after both child deliverables and their owner review are accepted. Starting the next group requires the owner's explicit instruction. No CSS, UI text, schema, CMS record, provider configuration or user data changes in this story.
