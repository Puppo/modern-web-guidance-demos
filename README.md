# Modern Web Guidance demos

Standalone HTML, CSS, and JavaScript examples by Luca Del Puppo.

## Code versions

| Branch | Contents |
| --- | --- |
| `main` | Repository navigation and technical documentation |
| `experiment/starter` | Shared minimal starter |
| `article-1/baseline` | Reserved for an independent run without the skill; no implementation yet |
| `article-1/guided` | Initial guided demo (application checkpoint `df397eb`) |
| `article-2/legacy` | Prepared modernization exercise: JavaScript textarea sizing and premature validation styling |
| `article-2/modernized` | Guide-driven CSS sizing and validation feedback, with 60 passing browser tests |
| `article-2/refined` | Historical preferences refinement with the multi-tab fix |

With Git, Node.js 26 or newer, and npm installed, check out a demo branch and run `npm ci` followed by `npm start`. No build step or browser runtime dependencies are required.

The guided branch is a development preview made in the planning session, not a controlled experiment result. No baseline comparison has been performed.

Article briefs and editorial material are maintained separately in the blog checkout. This repository contains demo code, usage instructions, and technical verification evidence.

## Latest verified demo

Start from `article-2/legacy` to reproduce the modernization scan, then compare it with `article-2/modernized`. The starting examples are deliberately constructed teaching fixtures. Both branches use a separate storage key from the first article.

The modernized branch includes the before/after scan output, guide decisions, screenshots, source hashes and browser results in `verification/modernization/`. The first article uses `article-1/guided`.
