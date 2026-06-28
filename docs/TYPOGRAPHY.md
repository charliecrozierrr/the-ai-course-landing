# The AI Course — Type System

One scale, used everywhere. All sizes are CSS variables in `the-ai-course.css` `:root`,
so changing a category in one place updates the whole page.

## Fonts
| Token | Font | Where |
|---|---|---|
| display / headings | **PP Neue Bit** (fallback Space Mono) | all H1/H2/H3 |
| body | **Inter** (`--font-body`) | all paragraphs, lists, descriptions |
| mono / labels | **Space Mono** (`--font-mono`) | inline labels, captions, nav, CTA sublines |
| pixel kicker | **Silkscreen** | section kickers `[ … ]`, flags, tags |

## Colours
| Token | Hex | Use |
|---|---|---|
| `--color-text` | `#121212` | primary text on light |
| `--color-text-secondary` | `#7E7E7E` | subtext / captions on light |
| `--color-text-muted` | `#AAAAAA` | least-important text on light |
| `--color-accent` | `#173EF5` | kickers, links, numbers, the one accent |
| on-dark primary | `#FFFFFF` | text on the dark/blue bands |
| on-dark body | `rgba(255,255,255,0.85)` | body on dark |
| on-dark accent | `#9b9bff` | kickers/labels on dark |

## Size scale (the categories)
| # | Category | Variable | Size (desktop → mobile) | Font | Default colour |
|---|---|---|---|---|---|
| 1 | **Display / H1** | `--fs-display` | clamp 2.2 → 3.5rem | PP Neue Bit | white (hero) |
| 2 | **Heading / H2** | `--fs-h2` | clamp 1.75 → 2.5rem | PP Neue Bit | `#121212` / white on dark |
| 3 | **Sub-heading / H3** | `--fs-h3` | 1.3rem | PP Neue Bit | `#121212` / white on dark |
| 4 | **Subtext / lead** | `--fs-lead` | 1.125rem | Inter | `#7E7E7E` |
| 5 | **Body / sub-subtext** | `--fs-body` | 1rem | Inter | `#121212` / 0.85 white on dark |
| 6 | **Caption / small** | `--fs-small` | 0.85rem | Inter | `#7E7E7E` / `#AAAAAA` |
| 7 | **Inline label** | `--fs-label` | 0.72rem | Space Mono | `#9b9bff` / muted |
| 8 | **Kicker / tag** | `--fs-kicker` | 11px (kicker), 9–10px (micro-tags) | Silkscreen | `#173EF5` / `#9b9bff` |

**Feature numbers** (price `$1,497`, countdown, the `6 / 90 / 2` stats) sit outside the text
scale on purpose — they're display figures in PP Neue Bit at 2.4–3.4rem, coloured with the accent.

## Notes
- Mobile keeps a few deliberately-tighter sizes where a row has to fit (the 4 chips, the 3 stats,
  the gear labels). Those are the only intentional exceptions to the scale.
