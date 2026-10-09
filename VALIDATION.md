# Validation — Review expansion, 2026-10-10

## Question content

- 1,110 unique IDs and prompts: 310 muscular Core review, 200 muscular Exam-style, 300 skeletal, and 300 cardiovascular questions.
- The two existing muscular data files remain unchanged.
- Every new question has five distinct choices, a valid keyed answer, brief feedback, one-based lecture PDF pages, and at least one external anatomy reference.
- All seven newly supplied PDFs are represented. Source page bounds were checked against the actual documents, including diagram-heavy pages.
- Every new item received an author review and a second independent content review for anatomical accuracy, ambiguity, and distractor validity. Numbered combinations were evaluated statement by statement. Repeated targets and several questions too close to historical-book targets were replaced.
- Originality review used the supplied historical books and embedded lecture exam pages. Automated checking found no 12-word English prompt/option overlap with either historical book or the embedded CV exam slides. This is supporting evidence; it does not establish semantic originality by itself.
- Source discrepancies affecting an answer are disclosed in question feedback. Anatomical variants are qualified rather than treating every diagram as universal.
- Public reference URLs were checked for both availability and relevant content. Two retired e-library URLs that returned unrelated pages were removed. Inaccessible alternatives were replaced with public university or publisher sources.

## Application checks

- All 432 system/category/region/focus/priority combinations checked, including empty selections and overlapping muscular focus tags.
- Each system completed a 20-question session with ten deliberately incorrect responses, then a ten-question retry ending at 10/10. Correctness followed the shuffled answer text; all choices locked after submission.
- System switching resets relevant filters. Muscular Core/Exam-style selection remains available, with the Innervation/Integration filter reset preserved.
- Direct links to `#skeletal` and `#cardiovascular` select the correct bank on load.
- Lecture dialogs show the correct file and actual PDF pages, including multiple-document citations and existing muscular question-style references.
- Desktop and 390/320-pixel mobile layouts inspected. Statement combinations, emphasized negative stems, answer feedback, correction notices, and citation dialogs checked without horizontal overflow.
- The complete local browser run passed with no JavaScript errors or failed asset requests. An earlier preview server exhausted its small connection queue during repeated isolated browser contexts; repeating against a larger preview queue passed. No site-code workaround was needed for that local test-server issue.
- Native WebMCP was not available in the test browser. Optional tools remain feature-detected and do not affect ordinary quiz use.

## Publishing

GitHub Actions repeats syntax and bank-schema validation before publishing `dist`. Post-deployment verification checks the exact release files, all three bank counts, shuffled answer feedback, references, and main study flows at the public URL.

If a broken bank, scoring error, or missing reference data appears in production, revert the release commit and redeploy the prior static version. No database migration or unpublishing is required. Course PDF scans, extracted text, private audit files, and test screenshots are excluded from the public repository.
