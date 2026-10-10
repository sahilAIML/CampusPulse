const fs = require('fs');
const path = require('path');

// Generate 40 seconds of 120 BPM upbeat electronic music
// Sample rate: 44100 Hz, 16-bit stereo PCM WAV
const sampleRate = 44100;
const durationSeconds = 40;
const totalSamples = sampleRate * durationSeconds;
const bpm = 120;
const beatsPerSecond = bpm / 60; // 2 beats per second
const samplesPerBeat = sampleRate / beatsPerSecond; // 22050 samples per beat

// Chord progression: Am (A-C-E), F (F-A-C), C (C-E-G), G (G-B-D)
const chords = [
  [220.0, 261.63, 329.63], // Am (A3, C4, E4)
  [174.61, 220.0, 261.63], // F (F3, A3, C4)
  [261.63, 329.63, 392.0], // C (C4, E4, G4)
  [196.0, 246.94, 293.66], // G (G3, B3, D4)
];

const bassNotes = [110.0, 87.31, 130.81, 98.0]; // A2, F2, C3, G2

const leftChannel = new Float32Array(totalSamples);
const rightChannel = new Float32Array(totalSamples);

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const beat = t * beatsPerSecond;
  const beatFraction = beat % 1;
  const barIndex = Math.floor(beat / 4);
  const chord = chords[barIndex % chords.length];
  const bass = bassNotes[barIndex % chords.length];
  const beatInBar = Math.floor(beat % 4);

  // 1. Kick on beats 0, 1, 2, 3 (four-on-the-floor upbeat drive)
  let kick = 0;
  const kickTime = beatFraction / beatsPerSecond; // time since last beat
  if (kickTime < 0.25) {
    const kickFreq = 140 * Math.exp(-kickTime * 25) + 45;
    const kickEnv = Math.exp(-kickTime * 14);
    kick = Math.sin(2 * Math.PI * kickFreq * kickTime) * kickEnv * 0.7;
  }

  // 2. Snare / Clap on beats 1 and 3 (upbeat pop)
  let snare = 0;
  if (beatInBar === 1 || beatInBar === 3) {
    if (kickTime < 0.2) {
      const noise = (Math.random() * 2 - 1) * Math.exp(-kickTime * 22);
      const tone = Math.sin(2 * Math.PI * 180 * kickTime) * Math.exp(-kickTime * 18);
      snare = (noise * 0.7 + tone * 0.3) * 0.55;
    }
  }

  // 3. Hi-hat on off-beats (8th notes: 0.5, 1.5, 2.5, 3.5)
  let hihat = 0;
  const eighthFraction = (beat * 2) % 1;
  const eighthTime = eighthFraction / (beatsPerSecond * 2);
  const isOffbeat = Math.floor(beat * 2) % 2 === 1;
  if (isOffbeat && eighthTime < 0.08) {
    hihat = (Math.random() * 2 - 1) * Math.exp(-eighthTime * 45) * 0.25;
  }

  // 4. Bassline: 16th note rhythm with filter sweep
  const sixteenthFraction = (beat * 4) % 1;
  const sixteenthTime = sixteenthFraction / (beatsPerSecond * 4);
  const bassEnv = Math.exp(-sixteenthTime * 8);
  const bassTone = (Math.sin(2 * Math.PI * bass * t) + 0.3 * Math.sin(2 * Math.PI * bass * 2 * t)) * bassEnv * 0.35;

  // 5. Lo-fi Chords: soft warm electric piano / synthesizer pads
  let chordTone = 0;
  for (let c = 0; c < chord.length; c++) {
    const f0 = chord[c];
    // Gentle detune and warm harmonics
    chordTone += (
      Math.sin(2 * Math.PI * f0 * t) * 0.6 +
      Math.sin(2 * Math.PI * (f0 * 1.002) * t) * 0.3 +
      Math.sin(2 * Math.PI * f0 * 2 * t) * 0.1
    );
  }
  const chordEnv = 0.5 + 0.5 * Math.sin(2 * Math.PI * (beat / 4)); // gentle pulsation
  const pads = (chordTone / chord.length) * 0.22 * chordEnv;

  // 6. Arpeggio / Melodic Chime
  const arpIndex = Math.floor(beat * 2) % chord.length;
  const arpF = chord[arpIndex] * 2;
  const arpTime = eighthTime;
  const arp = Math.sin(2 * Math.PI * arpF * t) * Math.exp(-arpTime * 12) * 0.15;

  // Master Envelope (fade in 0.5s, fade out 1.5s at end)
  let masterEnv = 1;
  if (t < 0.5) masterEnv = t / 0.5;
  if (t > durationSeconds - 1.5) masterEnv = (durationSeconds - t) / 1.5;

  // Stereo mix
  const mixLeft = (kick + snare + hihat * 0.8 + bassTone + pads * 0.9 + arp * 0.7) * masterEnv;
  const mixRight = (kick + snare + hihat * 1.2 + bassTone + pads * 1.1 + arp * 1.2) * masterEnv;

  leftChannel[i] = Math.max(-1, Math.min(1, mixLeft * 0.85));
  rightChannel[i] = Math.max(-1, Math.min(1, mixRight * 0.85));
}

// Write standard 16-bit stereo WAV file
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = totalSamples * blockAlign;
const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);

// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // BitsPerSample

// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  const sL = Math.floor(leftChannel[i] * 32767);
  const sR = Math.floor(rightChannel[i] * 32767);
  buffer.writeInt16LE(sL, offset);
  buffer.writeInt16LE(sR, offset + 2);
  offset += 4;
}

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const wavPath = path.join(assetsDir, 'audio.wav');
const mp3Path = path.join(assetsDir, 'audio.mp3'); // can also be loaded directly by browser/Remotion

fs.writeFileSync(wavPath, buffer);
// Copy to audio.mp3 so both extensions work interchangeably
fs.writeFileSync(mp3Path, buffer);

console.log('Successfully generated 40s 120 BPM upbeat electronic audio at:', wavPath);
