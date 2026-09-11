# Ford Base Finder collection progress

Updated 2026-09-10. The target remains the broadest available Ford base-number reference across years and models. No year cutoff was requested.

## Current snapshot

- 1,675 distinct base numbers: the original 692 plus 983 additions from displayed EPC observations.
- 1,432 EPC reference entries, representing 1,246 distinct EPC bases. Different catalog meanings remain separate entries.
- Catalog contexts: 2025 F150 2021- (FD), 2025 F250-600 Super Duty (FH), and an initial 1980 F-Series F150 fuel/ignition sample.
- Every EPC catalog remains partially covered. Selecting a 2025 catalog does not establish 2025 vehicle fitment: the catalog also exposes older dated applications. Preserve the exact location dates and require VIN confirmation for service parts.

## Required continuation order

1. Continue the newer truck catalogs first. The user specifically said not to skip remaining work after their question about older years.
2. Refine remaining capped F-150 body, seat, cover, bracket, panel, axle and differential searches; check the remaining catalog sections directly. Broad 300-row results are incomplete. Smaller follow-up searches do not establish that all parent results have been captured.
3. Complete broader Super Duty mechanical/body coverage after the diesel fuel, electronics and emissions pass. No whole newer-truck catalog has been marked complete.
4. Then expand historical truck years, passenger cars, SUVs and distinct powertrains. Preserve the existing 1980 sample and finish its remaining systems at that stage.

## Collection method and limitations

The observation JSON files contain displayed description, Base Number and location cells. Newer collection handles blank continuation cells by carrying the preceding displayed base/description forward. Deduplication preserves distinct catalog/family meanings and stores all observed locations and notes. The app count is a union of base strings, not a count of locations, trim variants or service numbers.

The continuation search log records observed row counts and capped searches. Earlier observation files predate that log. A single-result search can navigate directly to an illustration table instead of producing the search grid; verify the full service-number base before recording a Call/Base value there. Do not assume an illustration callout always equals the service-number base.

Only normal authenticated UI reading was used. No bulk catalog feed or export has been configured. No passwords or session tokens are included in project files. Leave the user's signed-in EPC browser session open; secure browser authentication is required if it expires.

Rebuild the included reference with `python scripts/compile-epc-reference.py`. The standalone static app loads `dist/reference.txt` and `dist/epc-reference.json`. Keep the original reference, source context, leading zeros and unresolved coverage limits intact.
