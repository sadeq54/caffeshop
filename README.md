# BLK — scroll-film landing page

One-page site for BLK coffee roasters (Amman). React + Vite port of the
original `../index.html` prototype, with the procedural canvas replaced by
real footage scrubbed by scroll (papertiger.com-style).

## Run

```bash
npm install
npm run dev      # http://localhost:5199
npm run build    # production build in dist/
```

## Type

Self-hosted through `@fontsource-variable` (no CDN, no `<link>`):

- **Bodoni Moda Variable** for display, loaded from its `opsz` (optical size)
  files so hairlines sharpen as the type scales up instead of thinning out.
  Emphasis inside a headline is the *italic of this same face* — never a second
  family dropped into the line.
- **Geist Variable** for body, UI, eyebrows and the menu.

## Menu (`MenuGrid.jsx`)

15 items in 3 groups, shown as photography. `public/menu/*.webp` are Pexels
photos cropped to 1100x825 and put through one identical grade
(`eq=contrast=1.06:saturation=0.84:brightness=-0.02`) so they read as one set
rather than 15 borrowed pictures. Whole folder is ~550KB.

Layout is a 12-column grid where each group runs its own rhythm, so no two
groups scan the same way:

| group | pattern |
|---|---|
| Espresso | wide(7) · mid(5) · sm(4) · sm(4) · sm(4) |
| Filter & Cold | mid(5) · wide(7) · sm · sm · sm |
| Beans | sm · sm · sm · wide(7) · mid(5) |

Animation, per card and staggered by index (`--i`):

1. the frame wipes up from its own baseline (`clip-path: inset(0 0 100% 0)`),
2. the image settles out of a 1.12 zoom underneath the wipe,
3. name, price and note rise in 240ms behind the image.

On hover the grid dims to 38% and the hovered card stays lit, so one dish holds
the page; its frame picks up a gold hairline and the price shifts. Hover
effects are behind `@media (hover:hover)` so touch never sticks in a dimmed
state. Reduced motion shows everything with no wipe, zoom or rise.

Grid columns are `repeat(12, minmax(0,1fr))` — plain `1fr` refuses to shrink
below an item's min-content and pushes the grid past the wrap.

## Caption anchors

Captions are no longer all parked at middle-left. `useScrollFilm` only writes an
`--enter` offset; CSS owns the transform, so each beat can be framed
differently: `.caption--upright` (upper right, right-aligned, quote rule flips
sides), `.caption--floor` (anchored to the bottom of the frame),
`.caption--center` (title card), `.caption--right` (right column, copy still
left-read). No two consecutive beats share an anchor. Below 860px every variant
collapses to one bottom-left anchor — a phone frame is too narrow to compose.

## Page shape

Three scroll-scrubbed film stages, each pinned for its own scroll budget
(viewport-heights):

| stage | height | pin | iris | scrub | hold |
|---|---|---|---|---|---|
| hero (`film.mp4`) | 620vh | 100 | - | 420 | 100 |
| bridge (`bridge-film.mp4`) | 500vh | 100 | 100 | 200 | 100 |
| menu (`menu-film.mp4`) | 560vh | 100 | 100 | 360 | - |

## The aperture transition

Each stage after the first is pulled up `margin-top: -200vh` so its **iris
phase overlaps the previous stage's hold phase**. During that overlap both
stickies are pinned: the outgoing film holds its last frame while the incoming
one opens through it in a growing circle, like a camera shutter.

- Only `.film-wrap` (the media layer) is clipped, via
  `clip-path: circle(var(--iris) at 50% 50%)`. `clip-path: circle()` is
  compositor-driven, so heavy filters are kept off this layer (captions blur,
  media never does). The clip is dropped entirely (`.is-open`) once fully open.
- `--iris` is set in **pixels** by the rAF loop, not `%`, because CSS resolves
  `circle(%)` against `sqrt(w²+h²)/sqrt(2)`; the unclipped `.iris-ring` rim
  light reads the same variable and so sits exactly on the cut.
- The incoming film also eases from `scale(1.14)` to `1` as the aperture opens.
- Captions are gated behind the aperture (they only fade in over the last 15%
  of the travel), and each stage's last caption is authored to be fully out by
  film-end, so text never collides across the handoff.
- `prefers-reduced-motion`: no iris and no zoom — the incoming stage
  crossfades on scroll position instead.

The scrub window (`scrubStart` / `scrubEnd` in `useScrollFilm`) carves the film
out of the stage's range and remaps caption windows, so caption `data-in` /
`data-out` stay authored in plain 0..1 film time regardless of the iris/hold
padding around them.

## How the film stage works

- `.stage` is 520vh tall; inside it a sticky 100vh viewport holds the video.
- A rAF loop maps scroll progress (0..1) onto `video.currentTime` with lerp
  inertia (factor 0.11), so scrolling scrubs the footage like film.
- The video is fetched as a Blob (always seekable, real download % for the
  preloader). Seeks are coalesced: never issued while the decoder is still
  `seeking`.
- Captions fade through fixed progress windows (`data-in` / `data-out` on each
  `.caption`), same values as the prototype.
- `public/poster.jpg` (exact first frame) covers the video until the first
  seek paints — no blank flash, and it doubles as the reduced-motion fallback.
- Phones (coarse pointer or ≤860px) get `film-m.mp4` (tighter GOP = cheaper
  seeks) and a muted play→pause primer on first touch for iOS.

## Video pipeline

Both films are stitched from free Pexels 4K clips (Pexels license, no
attribution required). Per clip: trim 5.4s, 1920x1080 / 24fps / light grade,
then 0.4s crossfades (`xfade` offsets 5.0 / 10.0 / 15.0) → 20.42s master →
GOP-8 desktop + GOP-4 720p mobile encodes (ffmpeg binary bundled in python's
`imageio_ffmpeg`):

```bash
# per clip
ffmpeg -ss <off> -t 5.4 -i clip.mp4 -an -vf "fps=24,scale=1920:1080:flags=lanczos,eq=contrast=1.03:saturation=0.95,format=yuv420p" -c:v libx264 -preset fast -crf 16 nN.mp4
# stitch
ffmpeg -i n1.mp4 -i n2.mp4 -i n3.mp4 -i n4.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.4:offset=5.0[a];[a][2]xfade=transition=fade:duration=0.4:offset=10.0[b];[b][3]xfade=transition=fade:duration=0.4:offset=15.0[v]" -map "[v]" -c:v libx264 -preset fast -crf 16 master.mp4
# desktop / mobile finals
ffmpeg -i master.mp4 -an -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart public/<name>.mp4
ffmpeg -i master.mp4 -an -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart public/<name>-m.mp4
```

**Hero** (`film.mp4`): espresso pour into black cup 6769788 (ss 4) → beans in
roaster drum 7174275 (ss 2) → hand picking cherries on the farm 36271578
(ss 3) → dual portafilters pulling shots 35769656 (ss 12). The four beats sit
under the four captions (hero / promise / origin / craft).

The menu used to be a third film; it is photography now (see below), so
`menu-film.mp4` was removed. It is recoverable from git history if needed.

**Bridge** (`bridge-film.mp4`): the original PixVerse AI café reel, 10s. Its
watermark is wiped at source and it is upscaled 2x before encoding:

```bash
ffmpeg -i PixVerse_*.mp4 -vf "delogo=x=758:y=20:w=256:h=42" frames/f_%04d.png
realesrgan-ncnn-vulkan -i frames -o up -n realesr-animevideov3 -s 2 -f png
ffmpeg -framerate 24 -i up/f_%04d.png -vf "scale=1920:1080:flags=lanczos,eq=contrast=1.03:saturation=0.95" \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 \
  -movflags +faststart public/bridge-film.mp4
```

Poster = first frame of each final. If you ever swap in footage with a corner
watermark again: wipe it at source (`delogo=x=..:y=..:w=..:h=..` before
scaling) — the `.scrim` top-right vignette in `styles.css` covers residue.

To swap footage: replace the two files (+ `poster.jpg` = first frame) and the
caption timing still works — the engine reads duration at runtime.

## Menu film

`public/menu-film.mp4` (20.4s, 1920x1080) is stitched from four free Pexels
clips (espresso drip 7019759, double pour 35756026, V60 37396049, falling
beans 32896425 — Pexels license, no attribution required): each normalized to
5.4s / 1080p / 24fps, joined with 0.4s crossfades (`xfade` offsets 5.0 / 10.0
/ 15.0), then encoded with the same GOP-8 desktop / GOP-4 720p mobile recipe.
`MenuFilm.jsx` scrubs it lazily (download starts as the stage approaches) and
the three menu groups fade in over their clips.
