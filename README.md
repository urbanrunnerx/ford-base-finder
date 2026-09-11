# Ford Base Finder

[**Open and install Ford Base Finder**](https://urbanrunnerx.github.io/ford-base-finder/install.html)

A phone-friendly Ford basic-number reference. Search a part name, description, basic number, or full service part number.

## Install on Android

1. Open the app link above in Chrome.
2. Wait for the page to prepare the included reference for offline use.
3. Tap **Install on my phone**. If your browser cannot show the prompt, the page provides the installation steps.
4. Launch Ford Base Finder from your phone's app icon.

[Google's Android installation instructions](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=en)

## Enable GitHub Pages once

The install link above becomes available after GitHub Pages is enabled. The complete static app is already prepared in `docs/`.

1. Open [repository Settings → Pages](https://github.com/urbanrunnerx/ford-base-finder/settings/pages).
2. Select **Deploy from a branch**.
3. Choose **main** and **/docs**, then **Save**.
4. Wait for the Pages deployment to finish.

GitHub Pages publishes the app for visitors without a ChatGPT login. For a private repository, GitHub Pages requires a supported paid GitHub plan. GitHub Free supports Pages from public repositories. Repository visibility remains unchanged by this update. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

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

Edit the app in `dist/`. Run `python scripts/build-pages.py`, then commit both the source and generated `docs/` files. Once Pages is enabled for `main` and `/docs`, pushes to that publishing source update the GitHub-hosted app.

The app uses relative paths and a service worker scoped to its own GitHub Pages folder. It can be installed alongside WallStory without replacing its app icon or deleting its offline cache.

Moving from the earlier app address does not transfer browser imports. Export imported records from **Coverage & tools** in the earlier app, then import that CSV in the GitHub-hosted app. Built-in reference entries are included automatically.

No Snap-on passwords, browser cookies, or session tokens are included.
