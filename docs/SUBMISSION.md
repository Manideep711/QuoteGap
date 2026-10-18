# EYFI Hackathon — build submission

Copy the relevant sections into the RevHack project and build-submission forms. Submission instructions supplied by the organiser distinguish the build submission (October 18, 2026, 10 PM; confirm the portal's displayed timezone) from a separate traction submission after the following week. This file does not submit the project or claim that any portal action has happened.

## Project name

QuoteGap

## Tagline

Find what's missing before you approve a contractor's quote.

## Elevator pitch

The cheapest contractor quotation may exclude installation, change material specifications, or quote different quantities. QuoteGap compares vendor spreadsheets against an approved scope, highlights differences with source-row evidence, and lets interior designers review matches before exporting a comparison report.

## Target users

Owners, procurement leads and project managers at Indian interior-design studios comparing modular-kitchen contractor quotations. The first release is designed for teams already using spreadsheets to manage their bill of quantities and vendor quotes.

## Suggested tags

SaaS, Web, Productivity, ConstructionTech, Procurement

Use the nearest tags available in the portal. Avoid claiming AI/ML: the current release uses deterministic matching and comparison rules, not an inference model.

## Technology stack

React, JavaScript, TypeScript, Vite, Node.js, Express, Render Workflows TypeScript SDK, ExcelJS, Papa Parse, Lucide, HTML and CSS.

## AI tools used — disclosure

OpenAI Codex assisted with product planning, implementation, documentation and testing. The application itself does not call a generative AI API or require a paid AI service.

## Project description

QuoteGap helps interior-design studios understand what each contractor quotation actually includes before approving a purchase. Users upload an approved scope spreadsheet and up to three CSV/XLSX quotations. The application matches shared item codes, suggests description-based matches for human review, and highlights missing or excluded items, description/specification differences, quantity/unit mismatches, and missing rates.

Every finding points to its original spreadsheet row. Users can correct item mappings, inspect original values and notes, filter findings, save/reopen reviewed projects as JSON files, and export the full comparison as CSV or print/save it as a PDF report. An illustrative modular-kitchen project is included so the workflow can be demonstrated immediately.

The current private preview processes files in the browser. A separate Node.js API and genuine Render Workflows integration are included in the repository: a project task fans out independent vendor-comparison tasks, then aggregates their results. Live Render execution requires deployment and account configuration and has not yet been verified. The UI only labels a comparison as Render processing after a successful real workflow result.

## Source repository

https://github.com/Manideep711/QuoteGap

## Live URL — check access before entering

Current private preview: https://quotegap-studio.veerasimha69.chatgpt.site

This is owner-private. Do not assume judges can access it. Before using a URL in the submission, deploy the app with suitable judge access and test it in a signed-out browser. The repository includes Render deployment instructions and render.yaml.

## Analytics integrated?

No. No analytics provider, sign-up flow, or visitor tracking is integrated in this release. Do not enter invented visitor, sign-up, active-user or revenue numbers.

## Demo video URL

Not recorded/uploaded yet. Record the flow using docs/DEMO_SCRIPT.md, keep the video under five minutes, and paste a working YouTube, Loom or supported Drive link. Verify viewer permissions before submitting.

## Monetization and sustainability plan

We plan to test a paid pilot at ₹999 per project, initially including assisted review of a supported modular-kitchen quotation set. A possible studio plan is ₹2,999/month for up to five projects. These prices are hypotheses; no customer payment or willingness-to-pay validation is claimed.

The value proposition is a clearer purchasing comparison and less manual checking before approving contractor work. The initial acquisition channel would be direct introductions to interior-design studio owners and procurement leads. Once repeat use is demonstrated, partnerships with project consultants could bring multiple studio customers.

The core release uses open-source libraries and deterministic processing, with no paid AI inference costs. Render task retries, input limits, and a protected pilot API bound processing exposure. We would measure compute cost, review time, conversion to a second paid project, and support effort before increasing volume or promising margins.

## Current limitations and failure cases

1. Supported inputs are value-only CSV/XLSX files with documented columns. PDFs, scans, handwriting, formula cells, nested headers and multi-sheet extraction are unsupported.
2. Item matching can be wrong. Shared codes are assumed to identify corresponding work; description suggestions need confirmation. The application does not establish material equivalence.
3. Units, bundled work, taxes, discounts, delivery charges and negotiated exceptions are not normalized automatically. Quoted subtotals can cover different work and are not a vendor recommendation or savings estimate.
4. Missing prices remain unknown. Blank inclusion defaults to included; users must read notes and record explicit exclusions as Included=No.
5. Active browser projects exist in tab memory and are cleared by refresh unless the user downloads a project file and reopens it. There are no accounts, persistent project history, payment collection, or multi-tenant production controls.
6. Live Render Workflows execution is not yet configured or verified. The current owner-private preview needs suitable external access before judge review.

## Traction plan for the following week

No outreach has been performed so far. Planned activities:

- Contact 20 relevant interior-design studios with a short demonstration and a request for a redacted historical kitchen BOQ/quotation set.
- Run assisted trials with three studios and compare findings with their manual review.
- Ask trial users to process their next live project at ₹999; record actual objections and outcomes.
- Track completed real comparisons, mapping corrections, reviewed findings, report exports, time spent reviewing and repeat-project requests.
- Seek one paid pilot and a second-project request; these are targets, not existing results.

## Custom traction metrics

- Studios that completed a real quotation comparison.
- Real projects with at least one uploaded vendor quote.
- Suggested mappings corrected by reviewers.
- Findings users confirmed as relevant.
- Reports exported for actual purchasing discussions.
- Paid pilot projects and repeat paid projects.

Keep synthetic sample use separate from real customer activity. Analytics must be implemented before reporting measured unique visitors or active users; do not infer these from GitHub visits.

## Validation completed

Seventeen automated tests cover parsing, source rows, matching, exclusions, missing rates, invalid inputs and formula rejection. Browser checks covered mixed CSV/XLSX uploads, search, source evidence, manual remapping and an actual downloaded CSV. Local API health, successful comparisons and invalid-input responses were checked. The production frontend build passed. These checks do not establish live Render execution, customer demand, or production readiness.

## Attachments

- docs/images/quotegap-preview.png — sample-project screenshot.
- public/examples/ — illustrative approved scope and vendor quotations, in CSV and XLSX.
- docs/DEMO_SCRIPT.md — recording guide.

## Remaining before submitting

- Arrange a live URL judges can access.
- Deploy and verify Render Workflows if presenting live sponsor integration.
- Record/upload a demo video under five minutes and check its permissions.
- Review copied form fields against what is actually implemented; submit the build form through the portal.

The later traction submission should use actual measured results and learnings from the week, including zero revenue if appropriate.
