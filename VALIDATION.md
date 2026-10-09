# Validation

- 510 unique question IDs and prompts: the original 310 Core review items plus exactly 200 Exam-style items; five distinct choices per question.
- All questions include a B13 course PDF printed-page citation and an external anatomy reference.
- Each new item includes separate question-book and answer-book PDF page references for format evidence.
- Six regions, six focuses (including Innervation and Integration in Exam-style), three learning priorities, and six exam formats checked.
- All 200 new items received author review and an independent review for factual accuracy and a single defensible answer. All 28 numbered-statement answer subsets were checked. One overbroad tendon-injury claim was narrowed from loss to weakness of extension. Group-function revisions were reviewed separately, including the superficial-ulnar supply of palmaris brevis.
- Browser checks: category selection, 20-question session scoring, locked answers, ten-question missed-answer review, all 180 category/region/focus/priority combinations, citation dialog, and category-specific focus reset.
- Desktop and 390-pixel mobile layouts inspected; no horizontal overflow or JavaScript page errors.
- The 12 distinct external URLs used by the new category were checked for public availability. A repeatedly timing-out UW Health link was replaced with a public Lippincott anatomy chapter, with its supporting page verified. Previously, a university-login-only core reference was replaced with a public University of Washington reference.
- Native WebMCP validation was unavailable in the test browser. Optional tools are feature-detected and do not affect normal quiz use.

The original question data file remains unchanged. The private source books, extracted text, and intermediate audit files are excluded from the public repository.

## Release verification

The publishing workflow repeats syntax and question-schema checks before deploying the static site. After deployment, verify category counts, answer feedback, citations, and the new data file at the public URL. If a broken category, scoring error, or missing source data reaches production, revert the release commit and redeploy the previous version; no database migration is involved.
