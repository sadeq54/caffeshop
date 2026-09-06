# Qahwa BLK — Prompts (Google Flow / AI Studio)

Videos → Google Flow (Veo) · Stills → AI Studio image model or GPT
Save every result into `blk-site/incoming/` with the exact file name shown.
Every prompt has an `UPLOAD:` line — attach that file before pasting the
prompt, or nothing if it says nothing.

**The look, in every prompt (copy it, never improvise):** natural daylight,
warm neutral grade, blacks stay black, shallow depth of field, plain kraft
or white paper cup with a SMALL BLACK SQUARE OUTLINE on it, no readable text
anywhere. Flow cannot spell قهوة or BLK — the square stands in for the boxed
logo, and the real mark is overlaid in post if a shot needs it.

**Reference images to upload** (their real photos, already in the repo):
`public/menu-blk/Spanish_Latte.webp` (the cup), `public/places/storefront.webp`
(the black-cube branch), `public/places/beirut.webp` (the kiosk).

The site now runs ONE film (the 10-second opening, played once with the
page held still) and no other video. Everything else is stills.

| Order | File | Assets |
|---|---|---|
| 1 | `01-films.md` | i1 + i2 → the opening film |
| 2 | `02-stills.md` | m1 story backdrop, p1–p3 place plates |
| 3 | `03-og.md` | og card |

Minimum to rebuild the opening: i1 + i2.

## Stitch + encode (after the clips land)

Opening = i1 → i2, one 0.4s crossfade at 7.6s, cut to 10.4s total:

```
ffmpeg -i i1.mp4 -i i2.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.4:offset=7.6[v]" -map "[v]" -t 10.4 -an -c:v libx264 -crf 22 -g 48 -pix_fmt yuv420p -movflags +faststart public/intro.mp4
ffmpeg -i public/intro.mp4 -vf scale=1024:576 -an -c:v libx264 -crf 25 -g 48 -pix_fmt yuv420p -movflags +faststart public/intro-m.mp4
ffmpeg -i public/intro.mp4 -frames:v 1 -q:v 2 public/poster.jpg
ffmpeg -sseof -0.1 -i public/intro.mp4 -frames:v 1 -q:v 2 public/intro-end.jpg
```

The poster must be the EXACT first frame and `intro-end.jpg` the exact last
frame: the page holds on the last frame after the film ends, and reduced-motion
visitors see it instead of the film.
