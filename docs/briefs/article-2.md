# Article 2 Brief: Building Better Web Interfaces with Modern Web Guidance

## Series

**Building the Modern Web with AI** — A practical series with Modern Web Guidance.

## Reader outcome

Learn a repeatable workflow: define expected behavior, consult relevant guidance, implement a focused change, and verify it in the browser. Understand how to evaluate the agent's decisions and recognize what still requires human review.

## Starting point

Continue from article one's preserved guided implementation. Summarize observed strengths, unresolved issues, and untested behavior, linking to its exact tag. If a requirement is already satisfied, verify and explain it. Do not introduce defects or unnecessary changes to manufacture a story.

## Scope

Keep the profile summary and editing dialog, theme and notification preferences, local persistence, and vanilla HTML/CSS/JavaScript. Choose changes after evaluating article one.

### Pass 1: Make interactions dependable

Review opening, initial focus, keyboard navigation, validation, saving, canceling, dismissal, and focus restoration. Verify feedback with assistive technologies.

Evidence: interaction walkthrough, relevant code changes, recorded keyboard and screen-reader observations.

Teaching point: component behavior includes everything before, during, and after the main action.

### Pass 2: Make the interface adapt

Review narrow and wide layouts, larger text, long content, and light and dark themes. Investigate relevant layout and styling guidance. Preserve the visual direction and judge proposals against this interface's needs.

Evidence: matching screenshots at documented viewport sizes, contrast checks, and examples with long content or increased zoom.

Teaching point: visual quality includes resilience to different content, preferences, and viewing conditions.

### Pass 3: Refine motion and feedback

Evaluate whether restrained transitions explain dialog and theme changes. Respect reduced motion. Verify save feedback and storage-failure behavior; polish must not hide errors or imply that unsaved changes were persisted.

Evidence: recordings where useful, reduced-motion checks, and a reproducible storage-failure scenario.

Teaching point: polish should make state and interaction clearer.

## Working method

For each pass: describe the observed issue, define expected behavior and checks, consult relevant Modern Web Guidance, review the approach against constraints, apply a focused change, test and inspect the diff, and record failures and human corrections.

Keep article one's compatibility target. Record skill and agent configuration, browser versions, prompts, and consulted guides. Distinguish automated observations, manual checks, and visual judgment.

Use the [dialog iteration prompt](../experiment/prompts/refine-dialog.md) as an example. Adapt subsequent requests to observed findings rather than asking to improve everything at once.

## Article structure

1. Where we left the demo: a recap supported by article-one findings.
2. What better means here: concrete acceptance criteria.
3. Three passes: problem, guidance, change, verification.
4. Where human judgment mattered: accepted, revised, or rejected suggestions and reasons.
5. Finished demo: checklist evidence, limitations, and repository links.

Keep code excerpts focused on decisions. Full implementations and detailed logs belong in the repository.

## Definition of done

- Editing, saving, cancellation, and persistence work.
- Keyboard, focus, validation, and feedback have been checked.
- Manual screen-reader checks are documented.
- Layout and themes are checked at narrow widths, with zoom and long content.
- Motion respects reduced-motion preferences.
- Compatibility assumptions and actual test coverage are explicit.
- Claimed improvements have evidence; outstanding issues remain documented.

These checks are not a comprehensive accessibility certification. Do not mark unperformed manual checks as passed.

## Deliverables and guardrails

Preserve the starting tag, focused commits, final tag, prompts, guide references, screenshots, useful recordings, completed checklist with conditions, and updated README.

Show changes that teach a lesson. If a pass needs no changes, explain successful verification briefly. New APIs, fewer lines, and attractive screenshots are not automatically better. Keep conclusions specific to the demo and distinguish the contributions of the skill, agent, tools, and human review.
