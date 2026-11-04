# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (marketing site for a native macOS app)

## Stack

Static HTML/CSS (user's choice). One folder per page (`/1/` … `/10/`), shared `assets/motif.css` and `assets/motif.js`. No build step.

## Users

Video editors, assistant editors and shooters who sit on folders of footage and need to find "the slow push-in" or "the handheld pan left" without scrubbing every clip. They work in Premiere, Resolve or Final Cut on Apple Silicon Macs.

## Product Purpose

Motif is a native Mac app that catalogs a folder of footage and tags every clip with a description and its camera movement: a sentence, deterministic chips (`pan right · slow`, `push-in`, `handheld`) and a numeric motion trajectory per segment. Success: an editor finds the shot by what's in it and by how the camera moves, then drags it straight onto their timeline.

## Positioning

Camera motion is measured on-device with geometry (optical flow, a motion solver, monocular depth for parallax), not guessed by a vision-language model. One cheap Gemini call per clip writes the prose description. Search can be by words, by movement chips, or by a camera move you keyframe in 3D (Design a Shot).

## Operating Context

- Projects are `.motif` packages holding catalog, posters, hover filmstrips and 360p proxies, so they stay browsable with the drive unplugged. Footage is only ever read.
- Hover to play, click for the inspector, space to play/pause, drag a segment to loop, drag thumbnails into an NLE (the original file travels, like a Finder drag).
- Everyone brings their own Gemini key (Settings, ⌘,). "On-Device Only" per project means nothing is uploaded.

## Capabilities and Constraints

- Requires macOS 26 on Apple Silicon.
- Distributed as `Motif-0.1.0.dmg` (~5.5 MB), ad-hoc signed: first launch needs System Settings → Privacy & Security → Open Anyway. No auto-update.
- Seven motion channels: pan, tilt, roll, zoom, truck, pedestal, dolly. Stability classes: locked-off, stabilised, handheld. Compound chips: arc, dolly zoom, crane.
- A file drag carries whole clips; matched in/out ranges don't travel (would need FCPXML).

## Brand Commitments

- Name: Motif. Tagline in app: "Every clip described, every camera move measured."
- App UI: light, quiet, dense, after Linear. Near-white surfaces, hairline borders, one indigo accent (#5E6AD2), colour reserved for meaning (one hue per motion channel).
- App icon: three stacked rounded-rectangle frames in amber on a near-black tile.

## Evidence on Hand

- Synthetic ground truth (README): 26 / 29 clips pass, direction 29 / 29 correct, median rate error 2.6% on pan / tilt / roll / zoom (M5 Pro, release build). The three failures (dolly_zoom, pushin_subject, truck_neg) are documented.
- 29 SceneKit test renders with known camera paths (`Eval/synth`), used on the site as the only footage. They are synthetic and labelled as such.
- Semantic description search: 11 of 12 test queries put the right clip first (12-description test set).
- No customers, testimonials, pricing or press exist. Do not invent them.

## Product Principles

1. Measure, don't guess. Show the numbers.
2. Footage is never modified and originals never leave the Mac.
3. Honest about limits: name the failures alongside the passes.
4. The editor's workflow ends in their NLE, not in Motif.
