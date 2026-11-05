# Theme assets

Active themes: `shinchan`, `spiderman`, `kick-buttowski`, `dragon-ball`, `harry-potter`, `mario`.

`data/theme-media.ts` contains the local asset paths and source page provenance. `data/rogue.ts` connects those assets to the dice faces, characters, colours, and layout.

Each theme directory contains:
- `wallpaper.webp` (or `bg.svg` for Mario): Local theme background/wallpaper.
- `character.png` (or `character-single.png` for Shinchan): Local transparent character cutout.
- `hook.mp3`: Local theme audio cue played when the theme is selected.

All assets are self-contained locally in `public/themes/` and work completely offline. Audio cues play once with a closing fade (12 seconds by default, 14 for Harry Potter) and can be replayed or muted.
