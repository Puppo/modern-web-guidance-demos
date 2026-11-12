# Article 1 Brief: Does Your AI Coding Agent Know the Modern Web?

## Purpose

Build a small user preferences interface to explore how Modern Web Guidance influences an AI coding agent's implementation choices. This is a documented case study, not a benchmark. Improvements are questions to investigate, not assumed outcomes.

## Reader outcome

Understand what the skill contributes through an observable comparison, then learn how to inspect the resulting behavior rather than judging screenshots alone.

## Demo

- Profile summary with a fictional display name and bio.
- Edit-profile dialog with required display name and optional bio.
- System, light, and dark theme preferences.
- Two independent notification preferences.
- Save action with visible, accessible feedback.
- Local persistence for saved preferences.

Use vanilla HTML, CSS, and JavaScript. No backend, authentication, UI libraries, external fonts, or build step. Use a compact settings layout, neutral colors, one accent color, readable typography, and clear control states.

## Browser support

Target Baseline Widely available at the time of the experiment and record the date. Newer features may enhance the experience, but essential functionality must remain usable without them. Record browser versions actually tested; the target is not evidence of testing.

## Experiment

Generate two implementations from the same empty starter in independent sessions: A without Modern Web Guidance available, B with it enabled. Keep the model, reasoning settings, agent version, tools, starter files, and task prompt identical. Check global instructions and automatically loaded skills for contamination.

Keep briefs, evaluation notes, this conversation, and the competing implementation outside each agent's context. Preserve the initial outputs before manual fixes or follow-up requests. Record all subsequent iterations separately.

Record date, model and agent settings, skill version, relevant instructions and tools, exact prompts, observable guide consultation, original generated code, and execution problems. Unknown details remain explicitly unknown.

## Narrative

1. Open with a component that appears to work and the behavior worth checking.
2. Explain the skill and how it enters the agent's workflow.
3. Introduce the shared task and controlled conditions.
4. Compare actual output and behavior, including similarities and failures.
5. Explain limitations and identify the starting point for article two.

Use the [shared prompt](../experiment/prompts/generate.md) verbatim and the [common evaluation checklist](../experiment/templates/evaluation.md). Do not deliberately weaken the baseline prompt.

## Deliverables

- Exact starting revision and preserved initial outputs for both runs.
- Prompts, configuration, observations, and completed evaluations.
- Screenshots captured under matching conditions.
- Focused code excerpts explaining observed differences.
- Repository instructions and article links when published.

Only publish measured results and checks actually performed. Keep unresolved issues visible. A single pair of runs does not establish general superiority or causality.
