# The Video Prompt Grimoire

Ready-to-paste prompts for **Google Flow (Veo)** to generate cinematic clips
for Code of Meridaeia. The game is already wired for the intro video:
drop your generated clip at **`assets/video/intro.mp4`** and it automatically
replaces the still image behind the "Destiny, awaits." narration — no code
changes needed. (No file = graceful fallback to the current intro.)

---

## The House Style Block

Paste this at the START of every prompt so all clips share one visual world:

> Dark fantasy world rendered as a lovingly remastered 16-bit RPG: painterly
> pixel-art textures, chunky silhouettes, dramatic rim lighting. Palette of
> deep indigo night (#0a0a0f), arcane violet glow (#6366f1), and burning
> ember orange (#ff6b3d). Floating embers and dust motes in the air, subtle
> CRT scanline shimmer. Tone: solemn, mythic, slightly playful. No text, no
> UI, no watermarks.

**Flow workflow tips:**
- **Image-to-video beats text-to-video for consistency.** Generate a still
  first (Gemini/Imagen, or screenshot the actual game portrait), then feed it
  to Flow as the first frame. Your existing hero portraits in `assets/heroes/`
  are perfect seed frames.
- Ask for **"seamless loop"** on idles; keep clips ~8s.
- One camera instruction per clip ("slow dolly-in", "orbit left") — Veo
  follows a single clear camera better than three.
- Generate 16:9 for the intro; 1:1 crops work best for in-battle loops.
- Keep character descriptions IDENTICAL between that character's clips.

---

## ⭐ THE INTRO CINEMATIC (assets/video/intro.mp4)

The Fallout-4 opener. Aim for 8s (or stitch 2–3 clips in Flow's scenebuilder).
The game loops it muted behind the letterboxed narration, so it needs no
dialogue and must read at low brightness.

> [House Style Block] Slow cinematic dolly-in across a vast ruined fantasy
> wasteland at dusk: shattered stone towers shaped like circuit heat-sinks,
> rivers of faintly glowing corrupted green code-runes flowing through
> cracked earth like lava. In the far distance, a colossal black fortress
> crowned with violet lightning. Wind drags ember storms across the frame.
> As the camera pushes forward, five tiny torchlit figures crest a ridge in
> silhouette, cloaks snapping in the wind, facing the fortress. Final second:
> violet lightning strike silhouettes the fortress. Somber, epic, slow.
> Seamless loop preferred. No text.

**Alt take (throne cold-open):**
> [House Style Block] Interior of a corrupted throne room. A sorceress with
> flowing violet-black robes sits motionless on a throne of fused server
> monoliths, green code-runes crawling up her arms like chains. A single
> tear of golden light rolls down her cheek and falls in slow motion; when
> it strikes the obsidian floor it blooms into glowing cracks of gold. Slow
> push-in on her face, eyes closed. Melancholy, mythic. No text.

---

## Hero Fight Scenes (Zelda/Pokemon-diorama style)

For these, add this **diorama modifier** after the House Style Block:

> Presented as a charming 3D-sprite battle diorama, like a modern HD-2D
> remake (Octopath Traveler / Link's Awakening remake): tilt-shift depth of
> field, miniature battlefield stage floating in darkness, characters as
> chibi-proportioned 3D sprites with crisp pixel shading.

### Grom the Uncompiled — Barbarian (Java)
> …A hulking green-skinned orc barbarian in rune-carved dark iron armor with
> glowing teal cable-tubes, wielding a massive ember-cracked greataxe. He
> roars, leaps, and cleaves through a swarm of small goblin creatures made
> of broken red error-symbols; each hit bursts into pixel shards and gold
> coins. Snowy mountain diorama. Camera: locked side view, slight shake on
> impact. 8 seconds.

### Malloc the Void-Walker — Dark Wizard (C++)
> …A gaunt dark wizard in tattered violet robes, face hidden, twin streams
> of luminous green code-glyphs orbiting his hands. He raises both arms and
> tears open a black void-portal; spectral pointers (glowing arrows) fly out
> and pierce three shadow-wraiths, which dissolve into static. Ruined arcane
> library diorama. Camera: slow orbit left. 8 seconds.

### Ser Handshake — Knight Paladin (Networking)
> …A radiant knight in silver-white plate armor carrying a tower shield
> embossed with "three interlocking rings", twin swords of blue light. He
> plants the shield against a crashing wave of red static arrows, the shield
> pulses three expanding rings of light, then he counter-charges. Gothic
> gateway bridge diorama. Camera: low heroic angle, dolly-in. 8 seconds.

### Artemis the Stream-Caller — Knight Archer (Data Engineering)
> …An agile huntress in sleek midnight-blue leather with a glowing bow of
> flowing liquid light. She back-flips off a rock, draws once, and the arrow
> splits mid-air into a pipeline of twelve light-arrows that curve like a
> stream and strike a corrupted slime-titan rising from a black lake.
> Moonlit poisoned-lake diorama. Camera: slow-motion on the arrow split,
> then snap to real time. 8 seconds.

### Vulkun of Ring Zero — Dragonoid Mercenary (Kernel)
> …A dragon-headed mercenary with obsidian scales veined in magma, heavy
> gauntlets sparking with raw electricity. He slams both fists into the
> ground; concentric rings of molten circuitry race outward, erupting
> beneath armored stone golems and launching them skyward. Volcanic forge
> diorama. Camera: top-down strike then crash-zoom to his grin. 8 seconds.

### Marakathalessa — Boss Entrance
> …The battlefield dims. A sorceress descends from above in slow motion,
> violet-black robes billowing like ink in water, crown of shattered code
> fragments orbiting her head, green rune-chains trailing from her wrists
> into the dark. She lands soundlessly; the ground blooms with creeping
> corruption. Her eyes open: one burning violet, one soft gold (the part of
> her that remembers). Camera: high to low crane following her descent.
> 8 seconds. Ominous but tragic, not evil.

### Bonus — Monster idle loops (battle backgrounds)
> …A small goblin creature stitched together from broken red syntax symbols
> bounces impatiently, snickering, juggling a stolen semicolon. Seamless
> idle loop, locked camera, 1:1 crop-safe framing. 5 seconds.

> …A wolf of translucent static and null-white mist paces in a tight circle,
> flickering partially out of existence mid-step. Seamless idle loop, locked
> camera. 5 seconds.

---

## Using the clips in-game (current wiring)

| Clip | File | Where it plays | Status |
|---|---|---|---|
| Intro cinematic | `assets/video/intro.mp4` | Behind the "Destiny, awaits." narration | ✅ Live — auto-detected |
| Grom fight | `assets/video/hero-grom.mp4` | Hero Wheel detail panel (on focus) | ✅ Live |
| Handshake fight | `assets/video/hero-handshake.mp4` | Hero Wheel detail panel (on focus) | ✅ Live |
| Artemis fight | `assets/video/hero-artemis.mp4` | Hero Wheel detail panel (on focus) | ✅ Live |
| Vulkun fight | `assets/video/hero-vulkun.mp4` | Hero Wheel detail panel (on focus) | ✅ Live |
| Malloc fight | _(not generated yet)_ | Hero Wheel — falls back to portrait | ⬜ Needs a clip |
| Boss entrance | `assets/video/boss-marakathalessa.mp4` | Full-screen cinematic before the boss fight; also her medallion | ✅ Live |
| Monster idles | `assets/video/monster-goblin.mp4`, `monster-wolf.mp4` | Battle-arena ambience behind the orbs | ⬜ Future (perf-gated, desktop only) |

**Wiring notes:**
- Hero fight clips load **lazily** — only the focused hero's clip downloads, and
  only after the wheel settles ~350ms, so spinning fast never triggers a load.
  A framed portrait shows first; the clip cross-fades in once ready. Reduced-motion
  and Save-Data users only ever see the poster.
- The boss entrance **skips instantly** under reduced-motion or if the clip can't
  decode, so it never traps the player.
- **Malloc (C++) has no clip yet** — his medallion shows the static portrait.
  Generate one with the Malloc prompt above, drop it at `assets/video/hero-malloc.mp4`,
  and add `video: 'assets/video/hero-malloc.mp4'` to his entry in `getWheelEntries()`.
- Say the word and I'll wire the **monster idle loops** behind the battle orbs
  (goblin for Java error-swarms, wolf for null-wraiths), desktop-only for perf.

**Performance notes (the "speed processing damage" hehe):** keep intro.mp4
under ~8MB (1080p, H.264, high CRF ~28, no audio track needed — the game
plays it muted while the Wasteland Radio carries sound). The video only
loads its metadata until the intro is actually shown, and reduced-motion
players never load it at all.
