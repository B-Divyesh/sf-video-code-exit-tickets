# Run Before Next visual thesis

## Direction

**Luminous glass data landscape.** A lesson becomes a dark field of runnable ideas. Checkpoints sit on it like translucent instruments, while one electric-lime execution path shows the next concrete action. The visual system is technical without borrowing an IDE theme: broad horizon lines, crisp status rails, and frosted mineral surfaces make progress feel physical and falsifiable.

This is a deliberately dark, single-mode product. The deep background reduces glare beside video, while the bright execution color makes the required action obvious. Depth survives without transparency: every glass panel also has a solid fallback, border, and shadow.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Night | `--ink-950` | `#07110f` | page background |
| Basin | `--ink-900` | `#0c1b18` | raised field |
| Glass | `--glass` | `#122923` | solid panel fallback |
| Glass line | `--line` | `#36564c` | boundaries and inputs |
| Main text | `--paper` | `#f2f7ed` | headings and body |
| Muted text | `--mist` | `#adc3b9` | secondary copy, 7:1 on Night |
| Run signal | `--lime` | `#c9ff63` | primary action and active path |
| Signal ink | `--lime-ink` | `#112000` | text on lime |
| Data blue | `--cyan` | `#73e6ff` | code/output accents |
| Pass | `--success` | `#73e6aa` | verified state |
| Warning | `--warning` | `#ffd36c` | pending/offline state |
| Error | `--danger` | `#ff9188` | failed run and manifest errors |

Contrast targets are at least 4.5:1 for text and 3:1 for controls. Color is always paired with an icon, word, or shape.

## Type

- Display: `Arial Narrow`, `Aptos Narrow`, and system sans fallbacks. Condensed, firm headings resemble a run log without imitating terminal type.
- Body and controls: `Inter`-style system sans (`ui-sans-serif`, `system-ui`). No font files are loaded, which keeps the extension quick and private.
- Code and numbers: `ui-monospace`, `SFMono-Regular`, `Consolas`. Tabular figures keep timestamps steady.
- Scale: 14, 16, 18, 24, 40, and clamp(48, 8vw, 92) pixels. Body copy is at least 16 pixels.

## Spacing and shape

- Eight-pixel rhythm: 4, 8, 16, 24, 32, 48, 64, 96.
- Text measure: 64 characters. App controls use a tighter 52-character measure.
- Glass panels use clipped upper-right corners and a 20px lower-left radius. The cut corner resembles a passed test ticket.
- Primary controls are pill-like run keys with a square leading status light. Minimum target: 44×44px.
- Landing sections alternate between open space and a full-width instrument rail, not interchangeable feature cards.

## Interaction grammar

- The current checkpoint is the brightest layer. Past checkpoints flatten into the landscape; future ones remain outlined.
- Running code sends one light sweep from editor to output. A passing output collapses into a stamped ticket and releases the video.
- Errors remain beside the code with the next action in one sentence.
- Keyboard order follows the task: code editor, Run check, Reset code, then lesson controls. `Ctrl/⌘ + Enter` runs the check.
- Phone layouts stack video, ticket, and editor. Secondary explanation disappears before controls shrink.

## Motion policy

One signature motion: a 420ms execution pulse travels across the checkpoint rail once after a run. UI transitions last 160–240ms and use only opacity and transform. Nothing loops. Under `prefers-reduced-motion: reduce`, travel is removed and states change instantly with a short opacity crossfade.

## Asset plan and prompt sheet

The original hero illustration shows a code checkpoint as a glass instrument suspended above a dark terrain of lesson timestamps. It supports the product story; it never substitutes for readable UI. The same crop forms the Open Graph image.

- Use case: `stylized-concept`
- Asset type: landing hero and social preview source
- Subject: one floating translucent checkpoint instrument connected to three low luminous timestamp beacons, with a small code window and a single green run path
- World: midnight mineral data landscape, shallow terraces, quiet horizon, no people
- Materials: smoky glass, etched dark metal, faint volumetric haze, precise luminous filaments
- Light: restrained cyan rim light and electric-lime execution light, deep black-green shadows
- Lens/composition: wide editorial landscape, instrument on the right, calm negative space on the left, slight isometric angle
- Palette words: carbon green, mineral teal, paper white, signal lime, cold cyan
- Negative list: no text, no letters, no logos, no brands, no watermarks, no generic gradient blob, no purple, no robots, no people, no fake browser chrome

Prompt used:

> Use case: stylized-concept. Asset type: wide landing-page hero. A midnight mineral data landscape made of shallow dark terraces. On the right, one floating translucent smoky-glass checkpoint instrument holds a tiny abstract code grid. Three low timestamp beacons connect across the terrain through one precise electric-lime run path. Restrained cyan rim light, etched dark metal, faint volumetric haze, deep black-green shadows, calm negative space on the left, slight isometric editorial composition. Premium product illustration, crisp geometry, plausible glass, no text, no letters, no logos, no brands, no watermark, no generic gradient blob, no purple, no robots, no people, no browser chrome.

## Provenance

The hero artwork is generated specifically for this product with the Param Factory image deployment (`factory-image`) on 2026-08-28. It is original project artwork under the repository MIT license. Source PNG and prompt sidecar live in `assets/src/`; optimized WebP derivatives ship in the site. Hand-authored SVG marks and icons use simple product-specific geometry and contain no third-party assets.

## Polish round 1 extension

The install guide, multi-checkpoint editor, and 404 keep the existing mineral-glass instrument language. They use the same cut corner, etched line, lime action signal, cyan focus ring, and eight-pixel rhythm. Mobile drops the hero artwork so the compatibility rule and sample action stay visible before the first scroll. No new visual asset was introduced; the 50-second black video is a generated test fixture and never appears in the product interface.
