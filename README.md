# Muscle Match · B13

310 English five-choice questions on muscle identification, function, origin, and insertion. Filter by region, learning priority, or question type. Sessions contain up to 20 questions, with immediate feedback and a retry of missed questions.

## References

Every question cites printed pages from one of the provided course documents and at least one relevant public anatomy reference.

- **B13大體解剖學vol.5.pdf** — printed page + 5 = PDF page.
- **B13大體解剖學vol.6.pdf** — printed page + 4 = PDF page.
- [UAMS anatomy muscle tables](https://medicine.uams.edu/neuroscience/education/medical-school-courses/human-structure-module/anatomy-tables/muscle-tables/), with topic-specific links on individual questions.
- Additional question-specific references from Elsevier Complete Anatomy and university anatomy teaching resources at Washington, Washington State, and Texas Tech.

Course PDF scans are not included in this public repository. Source discrepancies are identified in question feedback and linked to the correcting reference. Essential / Important / Standard are study priorities, not predictions of exam content.

## Local use

Serve `dist` with any static web server. No installation, build step, account, analytics, or backend is required. Question data is in `dist/questions.js`. Correct answers are stored as indices into the authored choices; the interface shuffles both questions and choices.

Run `node scripts/check.mjs` to check question counts, choices, references, and metadata. GitHub Actions validates and publishes `dist` to GitHub Pages when `main` changes.
