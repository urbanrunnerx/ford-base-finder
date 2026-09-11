# Ford Base Finder

[**Open and install Ford Base Finder**](https://ford-base-finder-chris.urbanrunnerx.chatgpt.site)

A phone-friendly Ford basic-number reference. Search a part name, description, basic number, or full service part number.

## Install on Android

1. Open the app link above in Chrome.
2. Sign in with the account that owns the app if prompted.
3. Open Chrome's three-dot menu, choose **Install and create shortcut**, then **Install**.
4. Launch Ford Base Finder from your phone's app icon.

[Google's Android installation instructions](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=en)

## Included reference

- **1,675 distinct base numbers** in the current published snapshot.
- The original 692-base reference plus 983 additions from displayed Snap-on EPC observations.
- 1,432 EPC entries representing 1,246 distinct EPC base numbers.
- Catalog contexts include 2025 F-150, 2025 Super Duty, and an initial 1980 F-Series sample.
- Search synonyms and full part numbers, filter EPC entries, import a CSV reference, and copy basic numbers.

Coverage is incomplete. Basic numbers identify part families; confirm the exact service part and vehicle fitment in the EPC using the VIN. Read [COLLECTION_PROGRESS.md](COLLECTION_PROGRESS.md) for coverage limits and the required continuation order: finish the newer-truck work before expanding older vehicles.

## Run locally

This is a static JavaScript web app with no package installation or build step.

```sh
python -m http.server 8000 --directory dist
```

Open http://localhost:8000 in a browser. Serve the `dist` directory as the website root.

## Rebuild the EPC reference

```sh
python scripts/compile-epc-reference.py
```

Keep the observation files, catalog context, original reference, and collection log together. The script compiles the saved observations into `dist/epc-reference.json`.

## Updates

This repository contains the application source, reference data, and collection progress. The install link points to the existing privately hosted app. A GitHub push alone does not update that app; deploy the revised app to update the installed version. The application code and references can refresh from the hosted app when online.

No Snap-on passwords, browser cookies, or session tokens are included.
