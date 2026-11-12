# Experiment protocol

## Status and isolation gate

Preparation only. No comparison results exist yet.

The planning session has already read Modern Web Guidance and both article briefs. It must not act as the baseline generator. A new session in another folder alone does not prove isolation: global skill discovery and inherited instructions may still apply.

Before generation, verify that the selected agent runner supports separate instruction and skill environments. Do not disable or delete the user's global skill installation. Use dedicated per-run environments and verify their effective skill inventories. If this cannot be established, record the limitation and do not describe the baseline as skill-free.

## Starting files

`experiment/starter`, `article-1/baseline`, and `article-1/guided` initially point at the same commit, containing only a neutral README and .gitignore. The starter has independent history so the editorial documents are not in its ancestry.

Use separate clones with only the intended branch and a single-branch, depth-one history. Work outside the ChatGPT project directory so its parent AGENTS.md does not become an accidental experiment instruction. Both workspaces need equivalent non-skill instructions. The agent must not read the editorial clone, other run, or planning conversation.

Isolation here is an experimental control, not a security boundary; log unexpected access or instruction inheritance.

## Procedure

1. Record the exact starter commit and SHA-256 of the shared generation prompt.
2. Choose and record the same model, reasoning settings, agent version, tools, permissions, network access, and execution limits for both runs. Do not infer this chat's model from product names.
3. Confirm baseline skill absence and guided skill availability through the runner's effective inventory. Capture relevant configuration without credentials.
4. Provide the shared prompt verbatim in two fresh sessions. No comparison framing or evaluation notes in either session.
5. Save complete local transcripts, tool outputs, final responses, and generated files. For the guided run, retain actual guide IDs, retrieval output when permitted, and version information. Distinguish installed skill revision from fetched CLI/content revisions.
6. Commit each initial output before any corrective prompt or manual edit. Record commit IDs on main. Add publication tags only after the corresponding outputs exist.
7. Evaluate with the same checklist, browsers, viewport sizes, and input scenarios. Keep evaluations outside generation contexts until the first outputs are frozen.
8. Record every later request and change separately. Start article-2/refined from the frozen guided output.
9. Publish reviewed evidence on main. Keep private transcripts in ignored private-evidence/ until checked for credentials and personal data; identify all redactions.

## Evaluation conditions

Use the same browser versions and device/viewport conditions for both implementations. At minimum document a narrow and wide viewport, keyboard flows, 200% zoom, long text, light/dark/system themes, reduced motion, reload, and storage failure. Record how storage failure was simulated. Screen-reader checks require an actual assistive-technology session and version record.

Use Pass, Partial, Fail, or Not tested. Automated checks do not replace manual keyboard and screen-reader checks. Avoid an aggregate score that conceals important failures.

## Interpretation

A single pair of runs is illustrative. Stochastic variation, unknown provider settings, or differing tool access limit attribution. Report those limits and successful baseline behavior. Never invent findings, intentionally degrade one version, or treat planning-session knowledge as an independent generation.
