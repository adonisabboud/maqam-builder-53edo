# Arabic Maqām Builder (53-EDO)

An interactive web-based instrument for exploring Arabic maqāmāt using a 53-tone equal temperament (Turkish comma system).

This project focuses on **accurate microtonal tuning**, **clear maqām structure**, and **playable interaction**, allowing musicians, researchers, and developers to hear and experiment with Arabic melodic systems directly in the browser.

## Demo
🎧 Live demo: https://adonisabboud.github.io/maqam-builder-53edo/


> ⚠️ **Keyboard input notice**  
> Keyboard playing requires the system keyboard layout to be set to **English (Latin)**.  
> Non-Latin layouts (e.g. Arabic or Hebrew) will prevent key detection in the browser.


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

🎹 How to Use the Keyboard to play music.

This "Arabic Piano" is designed to be playable immediately, even for users without a technical background.

1️⃣ Enable Audio

Click “Audio Enabled” at the top of the page.
Browsers require a user gesture before audio can start.

2️⃣ Choose a Maqām

Use the Maqām selector to choose a maqām (e.g. Rāst, Bayātī, Sīkāh, Ḥijāz, Ṣabā).
Each maqām is built from authentic jins structures and microtonal intervals.

You can also select the upper jins to explore maqām modulation.

3️⃣ Choose a Tonic (Transposition)

Use the Tonic selector to transpose the entire instrument.
This applies a global shift in 53-EDO commas and does not distort interval relationships.

Changing the tonic automatically stops any currently held notes to avoid pitch jumps.

4️⃣ Select Sound Type

You can choose how the instrument sounds:

Pure sine — clean, analytical tone (good for studying intonation)

Sine + harmonics — richer, more instrument-like tone (closer to real strings)

This affects all notes and drones in real time.

5️⃣ Play Notes

You can play notes in two ways:

🖱️ On-screen buttons

Click any note button to hear it.
Microtonal notes (half-flats) are clearly labeled.

⌨️ Computer keyboard (English layout required)

The keyboard is mapped like a piano:

Middle register: A S D F G H J K

Lower register: Z X C V B N M

Upper register: Q W E R T Y U

Tip: When playing a scale, start from A (middle register tonic) and move right.

⚠️ Important: The keyboard must be set to English.
Non-Latin layouts will not trigger key events correctly.

6️⃣ Playing Modes

Pluck (short): notes decay naturally after being triggered

Hold: notes sustain while the key/button is held

Latch: clicking a note toggles it on/off (useful for drones or chords)

7️⃣ Drones

You can enable:

Tonic drone

Upper jins base drone

Drones are especially useful for:

Hearing beating

Comparing Rāst vs Bayātī vs Sīkāh half-flats

Studying maqām color and stability

Adjust drone volume independently from the main output.

8️⃣ Stopping All Sound

Press Space or click “Stop All” to immediately silence all notes and drones.

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
```
## Project Scope
This project focuses on accurate representation of Arabic maqām theory, clear and expressive user interaction, and perceptually meaningful microtonal playback. It is designed as an exploratory instrument rather than a fixed composition tool.

🎼 Music Theory & Tuning (For Music Theory lovers )
53-EDO Turkish Comma System

This project models Arabic maqāmāt using 53-tone equal temperament (53-EDO), also known as the Turkish comma system.
The octave is divided into 53 equal logarithmic steps, providing sufficient resolution to represent classical Arabic and Ottoman microtonal intervals.

Key properties:

1 octave = 53 commas

1 comma = 2^(1/53) frequency ratio

Whole tone ≈ 9 commas

Diatonic semitone (E–F, B–C) ≈ 4 commas

Half-flat notes (♭½) are modeled as midpoints between scale degrees (½-comma precision)

## 🎻 Fingerboard Geometry, Midpoints & Microtonal Intonation

### 1. Pitch on a String (Physical Law)

For a stretched string at fixed tension and mass density, frequency is inversely proportional to vibrating length (Mersenne’s laws):
f ∝ 1 / L

Where:
- **f** = frequency  
- **L** = vibrating string length  

This implies:
- halving the string length doubles the frequency  
- the relationship is **inverse**, not linear  

---

### 2. What “Halfway on the Fingerboard” Actually Means

When a player stops a string between two notes (e.g. **D** and **F**), the *physical midpoint* refers to an average in **string length**, not frequency.

If the string lengths corresponding to D and F are `L_D` and `L_F`, then the midpoint position is:
L_mid = (L_D + L_F) / 2

This midpoint exists in **length space**, not pitch space.

---

### 3. Converting Midpoint Length to Frequency

Because frequency is inversely proportional to length:
f_mid ∝ 1 / L_mid
= 2 / (L_D + L_F)
Substituting `L ∝ 1 / f`:

This is exactly the **harmonic mean** of the two frequencies.

---

## 🎼 Application to Arabic Maqām Intonation

### Reference System

- Tuning grid: **53-EDO Turkish comma system**
- One comma ratio:

2^(1/53)

- Reference pitch:

A4 = 440 Hz

- Derived:

C4 = 260.7716 Hz

---

### Rāst Half-Flat (Fingerboard Midpoint)

Let:
- `D4 = 293.3449 Hz`
- `F4 = 347.7091 Hz`

The Rāst half-flat (**E♭½ Rāst**) is defined as the **fingerboard midpoint** between D and F:

E♭½_Rāst = 2 / (1/D4 + 1/F4)
= 318.2218 Hz

### Bayātī and Sīkāh as Deviations from Rāst

Bayātī and Sīkāh do **not** redefine the midpoint — they **deviate from it**.

A half Turkish comma corresponds to a multiplicative factor:

k = 2^(0.5 / 53) ≈ 1.00656055
#### Bayātī (Lowered Midpoint)

E♭½_Bayātī = E♭½_Rāst / k
= 316.1477 Hz


This models the darker, more grounded Bayātī color.

---

#### Sīkāh (Raised Midpoint)

E♭½_Sīkāh = E♭½_Rāst × k
= 320.3095 Hz



This produces the bright, tense leading quality characteristic of Sīkāh.

---

### Summary Table

| Context | Definition | Frequency (Hz) |
|-------|------------|----------------|
| Rāst | fingerboard midpoint (harmonic mean) | 318.2218 |
| Bayātī | Rāst − ½ comma | 316.1477 |
| Sīkāh | Rāst + ½ comma | 320.3095 |


👤 Author
Adonis Abboud
Music theory • Audio engineering • Microtonal systems
---

