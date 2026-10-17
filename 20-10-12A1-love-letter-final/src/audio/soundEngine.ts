/**
 * Romantic Audio Engine with Web Audio API procedural synthesis,
 * real-time frequency analysis for beat-reactive visual effects,
 * and support for custom user audio files.
 */

export interface AudioMetrics {
  energy: number;
  bass: number;
  mid: number;
  treble: number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;

  // Synthesis state
  private isSynthesizing = false;
  private synthTimer: number | null = null;
  private synthStep = 0;

  // Custom audio state
  private customBufferSource: AudioBufferSourceNode | null = null;
  private customAudioBuffer: AudioBuffer | null = null;
  private customAudioFileName: string | null = null;
  private isUsingCustomAudio = false;

  // Playback state
  public isPlaying = false;
  public volume = 0.7;
  public isMuted = false;
  public trackTitle = 'Bản Tình Ca Thanh Xuân 12A1 (Piano & Music Box)';

  // Listeners for UI state updates
  private stateListeners: Set<() => void> = new Set();

  public subscribe(listener: () => void) {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private notify() {
    this.stateListeners.forEach((fn) => fn());
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.85;

      const bufferLength = this.analyser.frequencyBinCount;
      this.freqData = new Uint8Array(bufferLength);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  public async startAudio() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isUsingCustomAudio && this.customAudioBuffer) {
      this.playCustomBuffer();
    } else {
      this.startSynthesizer();
    }

    this.isPlaying = true;
    this.notify();
  }

  public pauseAudio() {
    if (!this.ctx) return;

    if (this.isUsingCustomAudio && this.customBufferSource) {
      try {
        this.customBufferSource.stop();
      } catch {
        // already stopped
      }
      this.customBufferSource = null;
    }

    if (this.synthTimer) {
      window.clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    this.isSynthesizing = false;
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.startAudio();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  /**
   * Load custom MP3/WAV/Audio file locally from browser
   */
  public async loadCustomAudioFile(file: File): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      this.pauseAudio();
      this.customAudioBuffer = decodedBuffer;
      this.customAudioFileName = file.name.replace(/\.[^/.]+$/, '');
      this.trackTitle = this.customAudioFileName;
      this.isUsingCustomAudio = true;

      await this.startAudio();
      this.notify();
      return true;
    } catch (err) {
      console.error('Failed to decode user audio file:', err);
      return false;
    }
  }

  public resetToDefaultMusic() {
    this.pauseAudio();
    this.isUsingCustomAudio = false;
    this.trackTitle = 'Bản Tình Ca Thanh Xuân 12A1 (Piano & Music Box)';
    this.startAudio();
    this.notify();
  }

  private playCustomBuffer() {
    if (!this.ctx || !this.masterGain || !this.customAudioBuffer) return;

    if (this.customBufferSource) {
      try {
        this.customBufferSource.stop();
      } catch {
        // ignore
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = this.customAudioBuffer;
    source.loop = true;
    source.connect(this.masterGain);
    source.start(0);
    this.customBufferSource = source;
  }

  /**
   * Procedural romantic piano & music box synthesis in D Major
   * Chords: D - F#m - G - A (I - iii - IV - V romantic progression)
   */
  private startSynthesizer() {
    if (this.isSynthesizing || !this.ctx || !this.masterGain) return;
    this.isSynthesizing = true;

    // Progression notes (Hz)
    // D Maj: D3, A3, D4, F#4
    // F# min: F#2, C#3, F#3, A3, C#4
    // G Maj: G2, D3, G3, B3, D4
    // A Maj: A2, E3, A3, C#4, E4
    const chords = [
      { bass: 146.83, notes: [293.66, 369.99, 440.0, 587.33, 739.99] }, // D
      { bass: 92.5, notes: [277.18, 369.99, 440.0, 554.37, 739.99] },  // F#m
      { bass: 98.0, notes: [293.66, 392.0, 493.88, 587.33, 783.99] },   // G
      { bass: 110.0, notes: [329.63, 440.0, 554.37, 659.25, 880.0] },   // A
    ];

    const stepDuration = 550; // ms per arpeggio note

    this.synthTimer = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isUsingCustomAudio) return;

      const chordIndex = Math.floor(this.synthStep / 8) % chords.length;
      const noteIndex = this.synthStep % 8;
      const currentChord = chords[chordIndex];

      // Play bass note on step 0 and step 4
      if (noteIndex === 0) {
        this.triggerTone(currentChord.bass, 2.2, 'triangle', 0.28, 600);
      }

      // Arpeggio pattern
      const arpeggioMap = [0, 1, 2, 3, 2, 1, 3, 4];
      const targetFreqIndex = arpeggioMap[noteIndex] % currentChord.notes.length;
      const freq = currentChord.notes[targetFreqIndex];

      // Trigger bell/music box chime with warm piano body
      this.triggerTone(freq, 1.4, 'sine', 0.2, 1800);
      if (noteIndex % 2 === 0) {
        // High sparkling chime
        this.triggerTone(freq * 2, 0.8, 'triangle', 0.08, 3200);
      }

      this.synthStep++;
    }, stepDuration);
  }

  private triggerTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    peakGain: number,
    filterFreq: number
  ) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Warm low-pass filtering
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    // ADSR Envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  /**
   * Sound effect for flower burst
   */
  public playBurstSound() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Sparkling harp sweep
    const sweep = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    sweep.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.04);

      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.65);
    });
  }

  /**
   * Sound effect for opening the envelope letter
   */
  public playEnvelopeSound() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Gentle chord swell
    const notes = [329.63, 392.0, 493.88, 659.25];
    notes.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 1.9);
    });
  }

  /**
   * Extracts real-time energy & frequency bands for Three.js animations
   */
  public getAudioMetrics(): AudioMetrics {
    if (!this.analyser || !this.freqData || !this.isPlaying) {
      return { energy: 0.1, bass: 0.1, mid: 0.1, treble: 0.1 };
    }

    this.analyser.getByteFrequencyData(this.freqData);
    const count = this.freqData.length;

    let bassSum = 0;
    const bassCount = Math.floor(count * 0.2);
    for (let i = 0; i < bassCount; i++) {
      bassSum += this.freqData[i];
    }

    let midSum = 0;
    const midCount = Math.floor(count * 0.5);
    for (let i = bassCount; i < midCount; i++) {
      midSum += this.freqData[i];
    }

    let trebleSum = 0;
    for (let i = midCount; i < count; i++) {
      trebleSum += this.freqData[i];
    }

    const bass = bassSum / (bassCount * 255);
    const mid = midSum / ((midCount - bassCount) * 255);
    const treble = trebleSum / ((count - midCount) * 255);
    const energy = bass * 0.5 + mid * 0.35 + treble * 0.15;

    return { energy, bass, mid, treble };
  }
}

export const soundEngine = new SoundEngine();
