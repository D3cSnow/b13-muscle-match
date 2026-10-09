# Review · B13

1,110 English five-choice anatomy questions. Choose Muscular, Skeletal, or Cardiovascular, then filter by region, study priority, or focus. Sessions contain up to 20 questions, with brief answer feedback and a retry of missed questions.

| System | Questions | Coverage |
| --- | ---: | --- |
| Muscular | 510 | 310 Core review + 200 original Exam-style questions; names, function, origin/insertion, group roles, and motor supply |
| Skeletal | 300 | B13 volumes 1–4; landmarks, articulations, movement, attachments, relationships, and applied anatomy |
| Cardiovascular | 300 | CV lectures I–III; heart/pericardium, blood flow, arterial supply, venous drainage, and vessel relationships |

The historical question books guide the question structure; their questions are not reproduced or translated. See [Muscular question design](docs/QUESTION_DESIGN.md) and [Skeletal and cardiovascular coverage](docs/LECTURE_BANKS.md).

## References

Every question includes a course PDF citation and at least one relevant external anatomy reference. The new banks cite actual PDF page numbers. The original muscular banks retain their printed-page references; the reference dialog also gives the corresponding PDF page.

| Course document | PDF pages | Printed-page conversion |
| --- | ---: | --- |
| B13大體解剖學vol.1 (1).pdf | 102 | Printed + 6 |
| B13大體解剖學vol.2.pdf | 59 | Printed + 4 |
| B13大體解剖學vol.3.pdf | 38 | Printed + 4 |
| B13大體解剖學vol.4.pdf | 62 | Printed + 6 |
| B13大體解剖學vol.5.pdf | 81 | Printed + 5 |
| B13大體解剖學vol.6.pdf | 77 | Printed + 4 |
| CV (I) 2026.pdf | 37 | PDF/slide page |
| CV (II)2026 (1).pdf | 29 | PDF/slide page |
| CV (III)2026 (1).pdf | 79 | PDF/slide page |

External references include OpenStax Anatomy and Physiology and university anatomy resources, with topic-specific links on each item. Source disagreements that affect an answer are disclosed in the feedback. Essential / Important / Standard are study priorities, not predictions of exam content.

The original muscular Exam-style items also cite the question-book and answer-book pages for format evidence. Those style citations do not determine the answer keys. Course scans, historical questions, extracted text, and private audit files are not distributed with this site.

## Local use and updates

Serve `dist` with any static web server. No installation, build step, account, analytics, or backend is required. Question data lives in:

- `dist/questions.js` — muscular Core review.
- `dist/exam-questions.js` — muscular Exam-style.
- `dist/skeletal-questions.js` — skeletal lectures.
- `dist/cardiovascular-questions.js` — cardiovascular lectures.
- `dist/review-config.js` — system filters and source-document metadata.

Correct answers are indices into the authored choices; the interface shuffles both questions and choices. Keep existing IDs stable when correcting items, and bump the asset version in `dist/index.html` when publishing changes. New lecture items use `sources: [{document, pages}]` with one-based PDF pages and `externalSources: [{label, url}]`.

Run `node scripts/check.mjs` to check counts, choices, metadata, source page ranges, and reference presence. This validates structure; factual accuracy and a single defensible answer require content review. GitHub Actions validates and publishes `dist` to GitHub Pages when `main` changes.

Updates publish at the same URL without unpublishing. The previous version stays available during deployment. Direct links `#skeletal` and `#cardiovascular` open those sections. The public URL remains [d3csnow.github.io/b13-muscle-match](https://d3csnow.github.io/b13-muscle-match/) so existing shared links keep working.
