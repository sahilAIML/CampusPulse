# 🎬 CampusPulse — 40-Second "Brag Reel" Video (Remotion)

Programmatic, fully editable, 30fps **40-second video reel** built in **Remotion (React)** for **CampusPulse** ([https://campuspulse.bytexl.live/](https://campuspulse.bytexl.live/)), featuring a tactile **Claymorphism** design system, 120 BPM synchronized cuts, clay laptop & phone device mockups with 1.1x slow zooms on click targets, and burned-in high-contrast captions.

Includes both **1920x1080 (16:9 Landscape)** and **1080x1920 (9:16 Vertical / Reels / Shorts)** cuts.

---

## 🎨 Brand & Design Aesthetic Rules

- **Design Philosophy**: Tactile **Claymorphism** — convex surfaces, dual soft ambient shadows, inset highlights, rounded `32px` cards.
- **Palette**:
  - Base Clay: `#EEF1F6`
  - Coral (Accent Primary): `#FF7A59`
  - Teal (Accent Secondary): `#2EC4B6`
  - Sun (Accent Tertiary): `#FFC857`
  - Slate / Navy (High-Contrast Text): `#1E293B` & `#0F172A`
- **Typography**: `Outfit 800` (Headings) & `Nunito 700` (Body text).
- **Anti-AI Rule**: Strictly **no** purple gradients, **no** glass blur (`backdrop-filter`), **no** emojis, **no** stock footage, and **no** lorem ipsum. All data references the verified CampusPulse 120-student cohort telemetry.

---

## ⚡ Quick Start & NPM Scripts

Run all commands from the project root:

```bash
# 1. Preview and interact with the video in Remotion Studio (with live scrub & scene inspector)
npm run preview
# or: npm run video:preview

# 2. Render 1920x1080 16:9 Master MP4 (H.264, 40 seconds @ 30 FPS)
npm run render
# or: npm run video:render

# 3. Render 1080x1920 9:16 Vertical Cut (Optimized for Reels, Shorts, and TikTok)
npm run render:vertical
# or: npm run video:render-vertical
```

Outputs are automatically saved into the `/out/` directory:
- `out/campuspulse-16x9.mp4` (Horizontal master)
- `out/campuspulse-9x16.mp4` (Vertical mobile master)

---

## 📋 Screen Recording Checklist

All recordings and assets are located inside `public/assets/`. You can overwrite or replace these files with your live recordings:

| File Name | Scene & Feature | Target Resolution | Recommended Duration | What to Record on `campuspulse.bytexl.live` |
| :--- | :--- | :--- | :--- | :--- |
| `public/assets/intro.mp4` | 0–4s Intro AI Clip | `1920x1080` (16:9) | 4–6 seconds | Cinematic 3D/AI campus hero animation or opening title shot. |
| `public/assets/landing.mp4` | Landing Page & Telemetry | `1920x1080` (16:9) | 5–8 seconds | Public landing page showing hero video background, count-up chips, and interactive puzzle. |
| `public/assets/faculty.mp4` | 9–16s Faculty Portal | `1920x1080` (16:9) | 8–10 seconds | `/faculty` portal: Click **Section A**, highlight **Needs Attention** table row for `Sai Kumar (241FA18067)`. |
| `public/assets/student.mp4` | 16–22s Explainable Drawer | `1920x1080` (16:9) | 8–10 seconds | Student drawer opening: Reveal 0–100 score gauge, 7 success indicators radar, and **Why This Score?** waterfall. |
| `public/assets/admin.mp4` | 27–33s Placement Explorer | `1920x1080` (16:9) | 7–10 seconds | `/placements` page: Hovering 8-year trend bars (Amazon 44 LPA, Blinkit 28.5 LPA), or admin roll search. |
| `public/assets/mobile.mp4` | 33–37s Mobile Mockup | `1080x1920` or `1080x2400` (9:16) | 5–7 seconds | Chrome DevTools device mode (iPhone 14 Pro / Pixel 7): Student space with ML placement risk slider and coding stats. |
| `public/assets/outro.mp4` | 37–40s Outro AI Clip | `1920x1080` (16:9) | 4–6 seconds | AI concluding animation or sleek closing visual. |
| `public/assets/audio.mp3` | Soundtrack | Stereo MP3 / WAV | 40.0s (120 BPM) | Upbeat lo-fi/electronic beat (automatically pre-synthesized and bundled in `public/assets/audio.wav`). |

### 🎥 Recording Settings Best Practices:

1. **Resolution & Scaling**:
   - Set browser display zoom to `100%`.
   - Record desktop screens at `1920x1080` (or `2560x1440` downscaled).
   - Record mobile screens using Chrome DevTools (Device Toolbar: iPhone 14 Pro, DPR 3, or `1080x1920`).
2. **Cursor Highlighting**:
   - Enable a soft 28–32px circular cursor halo in your recorder (e.g., Screen Studio, OBS Cursor Highlight, or Cap).
   - Remotion's clay laptop and phone frames also overlay automated synchronized **tactile click ripples** precisely at the focal coordinates.
3. **Clean Window**:
   - Hide browser bookmarks bar and tabs (press `F11` for clean full-screen recording).
   - Ensure demo mode is set (`DATA_MODE=mock` or live Supabase) so data loads instantly without spinning loaders.

---

## 🎛️ Centralized Configuration (`remotion/config.ts`)

Every title, caption, metric, duration, color, author credit, and click-target coordinate is editable from **a single file**: `remotion/config.ts`.

### Key Config Sections:
- **`meta`**: Edit product name, creator name (`Sahil`), tagline, challenge name, and live URL.
- **`colors`**: Modify clay base, coral, teal, sun, navy, and clay shadow depths.
- **`scenes`**:
  - `scene1_intro`: Kinetic titles and badge tags.
  - `scene2_stats`: Values (`120+`, `7`, `0–100`), labels, and spring bounce delays.
  - `scene3_faculty`: Headline, subtext, chips, and normalized click coordinates `{ x: 0.65, y: 0.44, zoom: 1.12 }`.
  - `scene4_drawer`: Explainable score callouts and zoom coordinates.
  - `scene5_segments`: Prescriptive intervention roadmaps and action labels.
  - `scene6_trends`: Placement trend metrics and recruiter highlights.
  - `scene7_mobile`: Phone mockup features and safe margins.
  - `scene8_outro`: Final brag card and challenge tags.

---

## 📐 Project Structure

```
d:/AntiGravity/ByteXL/
├── remotion/
│   ├── config.ts                    # Central config (text, colors, timings, assets)
│   ├── Root.tsx                     # Composition declarations (16:9, 9:16, scene cuts)
│   ├── index.ts                     # Remotion registerRoot entry point
│   ├── styles.css                   # Claymorphism tokens & Google fonts
│   ├── components/
│   │   ├── ClayCard.tsx             # 32px rounded dual-shadow clay surface
│   │   ├── ClayBadge.tsx            # Tactile pill tags & category chips
│   │   ├── LaptopFrame.tsx          # Clay laptop mockup with 1.1x zoom
│   │   ├── PhoneFrame.tsx           # Clay phone mockup with dynamic island
│   │   ├── AssetVideo.tsx           # Video player with graceful synthetic fallback
│   │   ├── ScreenSimulators.tsx     # High-fidelity vector/CSS screen simulations
│   │   ├── ClickTargetHighlight.tsx # Pulsing tactile click ripples
│   │   ├── KineticText.tsx          # Staggered spring text reveals
│   │   ├── StatCounter.tsx          # Spring-bounce number counters
│   │   ├── CaptionsBar.tsx          # Burned-in high-contrast captions
│   │   ├── AudioTrack.tsx           # 120 BPM synchronized audio engine
│   │   └── FontLoader.tsx           # Outfit 800 & Nunito 700 font loader
│   ├── scenes/
│   │   ├── Scene1Intro.tsx          # 0–4s: Kinetic title + intro clip
│   │   ├── Scene2StatCounters.tsx   # 4–9s: Big stat counters pop in
│   │   ├── Scene3Faculty.tsx        # 9–16s: Faculty portal & at-risk alerts
│   │   ├── Scene4Drawer.tsx         # 16–22s: Explainable SSS drawer waterfall
│   │   ├── Scene5Segments.tsx       # 22–27s: High-ROI prescriptive roadmaps
│   │   ├── Scene6Trends.tsx         # 27–33s: 8-year placement analytics
│   │   ├── Scene7Mobile.tsx         # 33–37s: Responsive phone mockup
│   │   └── Scene8Outro.tsx          # 37–40s: Outro clip & finale brag card
│   └── compositions/
│       ├── CampusPulseLandscape.tsx # 1920x1080 16:9 full cut
│       └── CampusPulseVertical.tsx  # 1080x1920 9:16 vertical cut
├── public/assets/                   # Videos, audio, and media assets
├── scripts/
│   ├── generate-beat.js             # Synthesizes 40s 120 BPM electronic track
│   └── prepare-asset-placeholders.js# Sets up video assets
└── remotion.config.ts               # CLI rendering configuration
```
