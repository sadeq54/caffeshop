# 02 — Stills (AI Studio image model or GPT)

Keep the look line identical to the film so every still reads as a frame
from the same world. Every one of these replaces a real photo that is
already in place, so nothing is blocked on them — they are upgrades.

## How to make the model HOLD the logo

Text-to-image invents letters; image-to-image copies them. So:

1. **Always attach TWO images**: the scene reference AND the clean logo
   file itself — `public/brand/qahwa-blk-black.webp` (use the white one
   on dark surfaces). The logo file is the thing that keeps the glyphs
   honest; a photo that merely contains the logo is not enough.
2. Every prompt names the logo attachment and says **"apply it exactly
   as it is, like a printed sticker — do not redraw, redesign, translate
   or reinterpret it."** Models respect "apply/composite" far better
   than "draw."
3. **Keep the mark flat to the camera and reasonably large.** Wrapped
   around a cup at a steep angle or tiny in the frame, the glyphs go to
   mush. Signs hold better than cups; one large mark beats three small
   ones — so each prompt puts the mark on ONE hero surface and keeps the
   rest of the scene clean.
4. After generating, **zoom into the mark**: if قهوة is warped, misjoined
   or invented, regenerate once; still wrong → swap that sentence for
   "a small blank black square outline, no readable text" and overlay
   the real file in post. Never ship almost-Arabic to this client.

## m1-story.png → the story backdrop (`public/places/storefront-wide.webp`)

UPLOAD: `public/places/storefront.webp` (their real black-cube branch)
AND `public/brand/qahwa-blk-white.webp` (the exact logo)

```
Photograph, wide 16:9, 1920x1080. The first attached image is the real
coffee kiosk to recreate: a compact matte-black cube with a glass
front. The second attached image is the brand's exact logo. Recreate
the kiosk on an Amman street at golden hour and apply the attached
logo exactly as it is onto the kiosk's sign panel, facing the camera
straight on, large and sharp, like a printed sign — do not redraw,
redesign, translate or reinterpret the logo; copy its glyphs and
proportions precisely. Warm light spills from inside onto pale
limestone paving, a few young people hold plain kraft paper cups, long
shadows, the city's hills soft in the background. Natural daylight,
warm neutral grade, blacks stay black, shallow depth of field,
documentary framing with the kiosk on the LEFT half and open air on
the right. No other text anywhere in the image, no watermark.
```

→ save as `m1-story.png`, convert: `ffmpeg -i m1-story.png -vf "scale=1600:-1,eq=contrast=1.06:saturation=0.84:brightness=-0.02" public/places/storefront-wide.webp`

## p1-branch.png → `public/places/storefront.webp` (portrait plate)

UPLOAD: `public/places/storefront.webp` AND `public/brand/qahwa-blk-white.webp`

```
Photograph, portrait 4:5, 1200x1500. The first attached image is the
real coffee kiosk to recreate: a matte-black cube with a glass front,
straight on, mid-morning. The second attached image is the brand's
exact logo: apply it exactly as it is onto the kiosk's sign panel,
flat to the camera, large and sharp, like a printed sign — do not
redraw, redesign, translate or reinterpret it. One barista in a black
t-shirt visible inside through the glass, a customer in the doorway
holding a plain kraft cup. Natural daylight, warm neutral grade,
blacks stay black, shallow depth of field. No other text anywhere in
the image, no watermark.
```

→ save as `p1-branch.png`, convert: `ffmpeg -i p1-branch.png -vf "scale=900:-1,eq=contrast=1.06:saturation=0.84:brightness=-0.02" public/places/storefront.webp`

## p2-campus.png → `public/places/beirut.webp` (landscape plate)

UPLOAD: `public/places/beirut.webp` (their real campus kiosk)
AND `public/brand/qahwa-blk-black.webp` (the exact logo)

```
Photograph, landscape 4:3, 1600x1200. The first attached image is the
real campus coffee kiosk to recreate. The second attached image is the
brand's exact logo: apply it exactly as it is onto the kiosk's white
counter fascia, facing the camera, large and sharp, like a printed
sign — do not redraw, redesign, translate or reinterpret it. A short
relaxed queue of students with backpacks holding plain kraft cups and
clear iced-coffee cups, old stone university buildings and trees
behind, warm afternoon light. Natural grade, shallow depth of field,
documentary feel. No other text anywhere in the image, no watermark.
```

→ save as `p2-campus.png`, convert: `ffmpeg -i p2-campus.png -vf "scale=1000:-1,eq=contrast=1.06:saturation=0.84:brightness=-0.02" public/places/beirut.webp`

## p3-drive.png → spare plate (`public/places/billboard.webp`)

UPLOAD: `public/menu-blk/Spanish_Latte.webp` (their real printed cup)
AND `public/brand/qahwa-blk-white.webp` (the exact logo)

```
Photograph, landscape 4:3, 1600x1200. Dusk at a drive-thru coffee
window: a barista in black leans out handing a kraft paper cup to a
hand from a car window. The first attached image shows the brand's
real cup — match its material and print placement. The second attached
image is the brand's exact logo: apply it exactly as it is onto the
small lit sign panel above the window, flat to the camera, large and
sharp — do not redraw, redesign, translate or reinterpret it; the cup
itself shows only a small dark print, not close enough to read. Warm
light spills from the hatch, blue evening sky, Amman street softly
blurred behind. Warm neutral grade, blacks stay black, shallow depth
of field. No other text anywhere in the image, no watermark.
```

→ save as `p3-drive.png`, convert with the same command → `public/places/billboard.webp`

## Poster frames

No prompt: `poster.jpg` and `intro-end.jpg` are cut from the finished
opening film (see README).
