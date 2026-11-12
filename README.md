# Building the Modern Web with AI

*A practical series with Modern Web Guidance*, by Luca Del Puppo.

Companion repository for a two-part blog series. All editorial material and demo content are in English.

## Status

Experiment preparation is complete. **No generation runs or browser evaluations have been performed yet.** The article branches initially contain the same empty starter, not finished demos. Article links and publication tags will be added when available.

## Repository map

| Reference | Purpose | Status |
| --- | --- | --- |
| `main` | Briefs, prompts, protocol, evidence, and navigation | Preparation |
| `experiment/starter` | Shared minimal starting point | Ready |
| `article-1/baseline` | First output without Modern Web Guidance | Awaiting isolated run |
| `article-1/guided` | First output with Modern Web Guidance | Awaiting isolated run |
| `article-2/refined` | Verified evolution of guided output | Created after article-one evaluation |

The initial-output commits will receive immutable publication tags before any refinements. Branches provide convenient checkout targets; articles will link to exact tags.

## Read first

- [Article one brief](docs/briefs/article-1.md)
- [Article two brief](docs/briefs/article-2.md)
- [Experiment protocol](docs/experiment/protocol.md)
- [Shared generation prompt](docs/experiment/prompts/generate.md)
- [Run record template](docs/experiment/templates/run.md)
- [Evaluation checklist](docs/experiment/templates/evaluation.md)
- [Preparation record](docs/experiment/environment/preparation.json)

## Working with the demos

Check out the relevant article branch in a separate clone. Once its demo exists, follow that branch's README. The expected runtime is static HTML, CSS, and JavaScript served locally, with no build step.

Do not use this editorial checkout as the agent's generation workspace: it includes the comparison plan and evaluation material.

## Evidence policy

Preserve initial generated outputs, exact prompts, agent configuration, consulted guidance, follow-up requests, screenshots, and verification notes. Mark unavailable information as unknown and unperformed checks as not tested. Raw transcripts remain local until reviewed for secrets and personal data; published copies must identify redactions.

This is an illustrative case study, not a benchmark or an accessibility certification.
