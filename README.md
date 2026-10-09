# Muscle Match · B13

510 English five-choice questions: 310 Core review questions and 200 original Exam-style questions. Filter each category by region, learning priority, or focus. Sessions contain up to 20 questions, with immediate feedback and a retry of missed questions.

Core review covers muscle identification, function, origin, and insertion. Exam-style adds integrated comparisons, statement combinations, exceptions, linked facts, and short functional scenarios. Function includes the main roles of muscle groups and limb compartments; the Innervation focus targets muscle motor supply. The supplied historical papers guide the format; their questions are not reproduced or translated. See [Question design](docs/QUESTION_DESIGN.md) for the observed patterns and source evidence.

## References

Every question cites printed pages from one of the provided course documents and at least one relevant public anatomy reference.

- **B13大體解剖學vol.5.pdf** — printed page + 5 = PDF page.
- **B13大體解剖學vol.6.pdf** — printed page + 4 = PDF page.
- [UAMS anatomy muscle tables](https://medicine.uams.edu/neuroscience/education/medical-school-courses/human-structure-module/anatomy-tables/muscle-tables/), with topic-specific links on individual questions.
- Additional question-specific references from Elsevier Complete Anatomy and university anatomy teaching resources at Washington, Washington State, and Texas Tech.
- Exam-style items additionally use UTHealth Neuroscience Online and relevant Wolters Kluwer / Lippincott anatomy chapters where needed.

Each Exam-style item separately cites PDF pages from **B13大體解剖學期中Lecture題目 (1).pdf** and **B13大體解剖學期中Lecture詳解.pdf** for its question format. These style references do not determine its answer key.

Course PDF scans are not included in this public repository. Source discrepancies are identified in question feedback and linked to the correcting reference. Essential / Important / Standard are study priorities, not predictions of exam content.

## Local use

Serve `dist` with any static web server. No installation, build step, account, analytics, or backend is required. Core data is in `dist/questions.js`; Exam-style data is in `dist/exam-questions.js`. Correct answers are stored as indices into the authored choices; the interface shuffles both questions and choices.

Run `node scripts/check.mjs` to check question counts, choices, references, and metadata. GitHub Actions validates and publishes `dist` to GitHub Pages when `main` changes.

Updates publish at the same URL without unpublishing the site. Edit the relevant data file, keep existing question IDs stable, validate, and push the changes. The existing site remains available while the new version deploys.
