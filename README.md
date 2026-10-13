# Sapio Restaurant

Website concept for Sapio Restaurant, Piazza Antonino Gandolfo, 11, Catania.

Static site: plain HTML, CSS and JavaScript, no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 4173
```

## Edit it

| What | Where |
|---|---|
| Dishes, descriptions, prices | `menu-data.js` |
| Texts (Italian and English) | `data-it` / `data-en` attributes in `index.html` |
| Colours and typography | variables at the top of `styles.css` |
| Opening hours for the "open now" badge | `site-data.js` |
| Background slideshow photos | `.bg__slide` entries in `index.html`, files in `assets/img/` |
| Hero film | save a clip in `assets/video/` and set `HERO_VIDEO` at the top of `menu-data.js` |
| Phone layout | the `Phones and small tablets` block at the end of `styles.css` |

## Before going live

- Add the prices of the tasting menus and of the à la carte options: the restaurant's public menu (December 2025 PDF) and its TheFork page list the courses without prices.
- The menus change with the season; this is the December 2025 menu from the restaurant's own site.
- All photos come from the restaurant's own website (sapiorestaurant.it). Use them only with the restaurant's agreement.
- Confirm opening hours. The restaurant's booking page says dinner Tuesday to Sunday 19:30–23:30 and lunch Wednesday to Sunday 12:30–14:00; its contact page says lunch by reservation only; Google lists lunch on Sunday only.
- The two quotes credited “Recensione ospite” are guest reviews published on the restaurant's own site without a named platform.
- The restaurant takes bookings online on its own site; here every booking button calls 095 097 5016. Link the booking system if the owner prefers.
- Videos: the hero film is the restaurant's own YouTube video; the other three in the video section are by Sicily Wine & Dine, QbItaly and Cronache di Gusto, embedded from YouTube. Swap them for the restaurant's own films if it has more.
- The press strip shows headlines listed on the restaurant's own press page. Confirm the selection.
- The awards and timeline (star in 2018 at 25, new premises in 2023, Passion Dessert award in the 2026 guide) come from the restaurant's own site and its press page. Confirm the wording.
- The site is hidden from search engines and carries a footer line saying it is a design proposal. To launch it, set "indexable": true and "conceptNote": false in site.json and rebuild.
