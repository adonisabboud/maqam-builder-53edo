# Arabic Maqām Builder (53-EDO)

An interactive web-based instrument for exploring Arabic maqāmāt using a 53-tone equal temperament (Turkish comma system).

This project focuses on **accurate microtonal tuning**, **clear maqām structure**, and **playable interaction**, allowing musicians, researchers, and developers to hear and experiment with Arabic melodic systems directly in the browser.

## Demo
🎧 Live demo: https://adonisabboud.github.io/maqam-builder-53edo/


## 🙏 Acknowledgements

The tuning logic and conceptual approach to 53-EDO comma usage in this project are derived from the teachings of **Mr. Anwar Hariri**, particularly his educational material on Arabic maqām intonation theory shared on YouTube - http://www.youtube.com/@anwarhariri.

This project is an independent technical implementation inspired by those teachings, created with great respect and gratitude for his efforts in preserving and explaining traditional Arabic music theory.

---

## 🎵 Motivation

Western 12-TET tuning cannot accurately represent many Arabic maqām intervals, especially:
- half-flats (e.g. E♭½ in Rāst, Bayātī, Sīkāh)
- neutral seconds
- subtle intonational differences between ajnās

This project implements a **53-EDO Turkish comma model**, which provides sufficient resolution to model traditional Arabic intonation while remaining computationally simple and browser-friendly.

---

## 🧠 Musical Model

- **Tuning system**: 53-tone equal temperament (53-EDO)
- **Reference pitch**: C4 = 260.77 Hz
- **Comma logic**:
  - Whole tone = 9 commas
  - Diatonic semitone (E–F, B–C) = 4 commas
  - Flats / sharps = ±4 commas
  - Rāst half-flats are fingerboard midpoints (½-comma resolution)

### Ajnās
Each jins is defined in **comma-space** as relative offsets from a base note:
- Rāst
- Bayātī
- Sīkāh
- Ḥijāz
- Kurd
- Nahāwand
- ʿAjam
- Ṣabā (special-cased full scale)

### Maqām Construction
A maqām is constructed from:
- a **lower jins**
- an **upper jins**
- a defined **upper base note**
- optional alternative upper ajnās

The full scale is derived dynamically from these components.

---

## 🎛 Features

- Interactive note grid (scale, lower jins, upper jins)
- Global transposition in 53-EDO comma space
- Keyboard input (three octaves)
- Pluck and hold performance modes
- Latch mode for sustained tones
- Tonic and upper-base drones
- Microtone visualization (half-flats highlighted)
- Dark / light theme with system preference detection
- Fully client-side (no backend)

---

## 🔊 Audio Engine

- Built using the **Web Audio API**
- Supports:
  - pure sine tone
  - sine + harmonic partials
- Envelope-shaped pluck synthesis
- Continuous oscillators for held notes and drones
- Frequency computation happens **after** all comma-space logic

---

## 🧩 Architecture Overview

index.html → UI structure
styles.css → Theme + layout
app.js → Tuning logic, maqām engine, audio engine, interaction


Key design principle:
> All musical logic operates in **comma-space**.  
> Frequencies are calculated **only at playback time**.

---

## 🛠 Technologies Used

- Vanilla JavaScript (ES6)
- Web Audio API
- HTML5 / CSS3
- No external frameworks or libraries

---

## 🚀 Running Locally

Simply open `index.html` in a modern browser  
(or use a local server for best audio behavior):

```bash
python -m http.server
Then navigate to http://localhost:8000.

📌 Status
This is an active exploratory project focused on:

musical correctness

clarity of interaction

expressive microtonal playback

Future directions may include:

alternate tuning systems

MIDI / MPE input

notation export

additional maqām families

👤 Author
Adonis Abboud
Music theory • Audio engineering • Microtonal systems
---

