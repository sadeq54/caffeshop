# 02 — Stills (AI Studio image model or GPT)

Keep the look line identical to the film so every still reads as a frame
from the same world. Every one of these replaces a real photo that is
already in place, so nothing is blocked on them — they are upgrades.

## m1-story.png → the story backdrop (`public/places/storefront-wide.webp`)

UPLOAD: `public/places/storefront.webp` (their real black-cube branch — match
its architecture, do not invent a different building)

```
Photograph, wide 16:9, 1920x1080. A compact matte-black cube coffee kiosk
with a glass front on an Amman street at golden hour, warm light spilling
from inside onto pale limestone paving, a few young people with paper
cups outside, long shadows, the city's hills soft in the background.
Natural daylight, warm neutral grade, blacks stay black, shallow depth of
field, documentary framing with the kiosk on the LEFT half and open air
on the right. No readable text anywhere, no logos, no watermark.
```

→ save as `m1-story.png`, convert: `ffmpeg -i m1-story.png -vf "scale=1600:-1,eq=contrast=1.06:saturation=0.84:brightness=-0.02" public/places/storefront-wide.webp`

## p1-branch.png → `public/places/storefront.webp` (portrait plate)

UPLOAD: `public/places/storefront.webp`

```
Photograph, portrait 4:5, 1200x1500. The same matte-black cube coffee
kiosk, glass front, straight on, mid-morning, one barista in a black
t-shirt visible inside through the glass, a customer in the doorway with
a paper cup. Natural daylight, warm neutral grade, blacks stay black,
shallow depth of field. No readable text anywhere, no logos, no watermark.
```

→ save as `p1-branch.png`, convert: `ffmpeg -i p1-branch.png -vf "scale=900:-1,eq=contrast=1.06:saturation=0.84:brightness=-0.02" public/places/storefront.webp`

## p2-campus.png → `public/places/beirut.webp` (landscape plate)

UPLOAD: `public/places/beirut.webp` (their real campus kiosk)

```
Photograph, landscape 4:3, 1600x1200. A small white-and-black coffee
kiosk on a university campus, a short relaxed queue of students with
backpacks and paper cups, old stone buildings and trees behind, warm
afternoon light. Natural grade, shallow depth of field, documentary feel.
No readable text anywhere, no logos, no watermark.
```

→ save as `p2-campus.png`, convert: `ffmpeg -i p2-campus.png -vf "scale=1000:-1,eq=contrast=1.06:saturation=0.84:brightness=-0.02" public/places/beirut.webp`

## p3-drive.png → spare plate (`public/places/billboard.webp`)

UPLOAD: nothing

```
Photograph, landscape 4:3, 1600x1200. Dusk at a drive-thru coffee window:
a barista in black leans out handing a paper cup with a small black
square outline to a hand from a car window, warm light spilling from the
hatch, blue evening sky, Amman street softly blurred behind. Warm neutral
grade, blacks stay black, shallow depth of field. No readable text
anywhere, no logos, no watermark.
```

→ save as `p3-drive.png`, convert with the same command → `public/places/billboard.webp`

## Poster frames

No prompt: `poster.jpg` and `intro-end.jpg` are cut from the finished
opening film (see README).
