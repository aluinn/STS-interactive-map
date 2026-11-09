# Data sources

What the app shows, and where each part comes from.

## Curated content (General Notes)

The entries, relationships, debates and guided paths are **written by the author** from
secondary and primary literature and are stored in `src/data/`. Each entry lists its
`sources` (typed `primary` or `secondary`), or carries `contentStatus: 'sourceNeeded'`
where a source has not been verified yet. A test (`src/tests/data.test.ts`) enforces
that rule. The editorial policy is in [`CONTENT_GUIDE.md`](../CONTENT_GUIDE.md); the
shape of the data is in [`DATA_MODEL.md`](../DATA_MODEL.md).

Current size (counted from the built `dataBundle`, 2026-11-09): 226 entries,
164 relationships, 20 debates, 29 guided paths, 7 knowledge routes.

This is an interpretive, educational dataset. It is not neutral or exhaustive, and the
in-app About page says so.

## Geography

| Layer | Source | Notes |
| --- | --- | --- |
| Coastlines (`land-110m`) and country shapes (`countries-110m`, `countries-50m`) | [`world-atlas`](https://github.com/topojson/world-atlas) npm package, derived from [Natural Earth](https://www.naturalearthdata.com/) | Natural Earth is public domain. Borders are **modern** and drawn for orientation only; the app states this on the map. |
| Globe imagery | NASA Earth Observatory: *Blue Marble: Land Surface, Shallow Water, and Shaded Topography* and the *Earth at Night* city-lights composite (2012) | Resized for web delivery (`public/earth/`). Used with acknowledgement under NASA's media usage guidelines; this does not imply NASA endorsement. |
| Subsea-cable corridors on the globe | Hand-drawn in `src/data/infrastructure.ts` | **Schematic great-circle links**, not the surveyed paths of any cable. For real routes consult a current cable map such as TeleGeography's. |

Place coordinates on entries are the author's choice of a representative location; an
entry may have several places, or none (`transregional`).

## Your Notes

Nothing is fetched. Text comes from files the user drops in, and the place and topic
dictionaries used to interpret it live in the source (`src/features/notes/analysis/`:
`gazetteer.ts`, `lexicon.ts`). See [`MY_NOTES.md`](MY_NOTES.md).

## Fonts

*Cormorant Garamond* and *EB Garamond* are loaded from Google Fonts in `index.html`.
This is the only third-party request the app makes (see the roadmap item to self-host).
