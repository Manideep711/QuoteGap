# QuoteGap demo — target 4 minutes 20 seconds

Use the sample kitchen project. Before recording, close unrelated browser tabs and notifications. Keep the entire recording under five minutes. No video has been recorded by adding this script.

## 0:00–0:30 — problem and buyer

“QuoteGap is for interior-design studios comparing modular-kitchen contractor quotations. Looking only at the total can hide missing installation, changed material specifications, or different quantities. We help the buyer see those differences before approving work.”

Show the project overview and the three quoted subtotals. Explain that the lowest listed subtotal is not an equivalent-scope price or a purchasing recommendation.

## 0:30–1:10 — upload real spreadsheet files

Click New comparison. Use public/examples/approved-scope.xlsx and public/examples/vendor-1.csv, vendor-2.xlsx and vendor-3.csv. Give the project a name, then create the comparison.

“We support an approved scope and up to three value-only CSV or XLSX quotations. This demonstration uses illustrative data.”

## 1:10–2:00 — evidence and findings

Open Oak & Grain's Base cabinets cell. Show required 18mm BWP plywood versus quoted 16mm commercial plywood and the source-row references. Close the drawer. Show excluded handles and installation, then Form & Finish's wall-cabinet quantity difference.

“These are specific review findings linked to original values. The application does not infer why a vendor changed a specification, and the designer makes the final decision.”

## 2:00–2:35 — human review and export

Open Review matches. Explain unique item codes auto-match and description suggestions require confirmation. Unmap a line briefly to demonstrate missing work and extra-row disclosure, then restore the mapping. Export CSV and show the downloaded rows or open print/save as PDF.

“The report retains original row references, exclusions and notes. Export includes the complete comparison, even if the visible table is filtered.”

## 2:35–3:10 — Render implementation

If Render is deployed and verified: show the actual dashboard root run and parallel compare-vendor child runs, then return to the app's Render indicator.

If it is not deployed: show server/tasks.ts and render.yaml and say: “The Render SDK integration is implemented, with one independent vendor task per quotation and a root aggregation task. Our current preview runs in the browser; we have not yet verified a live Render execution.” Do not present code as proof of deployment.

## 3:10–3:40 — revenue hypothesis

“We plan to test ₹999 per project, then a possible ₹2,999 monthly studio plan for five projects. The buyer is an interior studio's owner or procurement lead. No paid users or customer validation are claimed yet. During the traction week, we will seek redacted historical projects, assisted trials, and a paid live-project comparison.”

## 3:40–4:20 — limitations and close

“This release supports structured spreadsheets, plus text-based PDFs with mandatory extraction review; scans are not supported. Matching and material interpretation need human review. We do not normalize taxes, bundled work or different units. Browser projects clear on refresh, and the app does not automatically recommend a vendor.”

“QuoteGap: find what's missing before you approve a contractor's quote.”

After uploading, verify the video duration and viewer permissions. Paste the actual video URL into the build-submission form. The project screenshot and GitHub repository are separate supporting artifacts, not a replacement for the video.
