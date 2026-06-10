import React, { useState, useEffect } from "react";
import {
  Bot, HelpCircle, Sparkles, AlertCircle, Trophy,
  Heart, Flame, Leaf, RotateCcw, CheckCircle, XCircle, Info, Compass, Box,
  Film, Grid, Scissors, Battery, ArrowRight, Play, Archive, Plus,
  Shield, Check, Star, RefreshCw, Zap, Trash, MapPin
} from "lucide-react";
import { formulaStock, recycledItemsRepo, achievementsList, spatialMissionsPreset } from "./dataPreset";
import { StudentState, RecycledItem, SpatialMission, PhysicsQuestion } from "./types";
import MOChatbot from "./components/M_O_Chatbot";

// Audio effects synthesizer using Browser Web Audio API (Safe, zero latency, no static loaders)
const playSound = (type: "success" | "error" | "unlock" | "click" | "propulsion" | "ship_up" | "ship_down") => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "success") {
      // Harmonic chime
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.25);
      });
    } else if (type === "unlock") {
      // Beautiful space arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + index * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + index * 0.05 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.05);
        osc.stop(ctx.currentTime + index * 0.05 + 0.45);
      });
    } else if (type === "error") {
      // Dynamic flat double beep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(180, ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);
    } else if (type === "propulsion") {
      // CO2 white noise or jet swoosh sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === "ship_up") {
      // Ascending spaceship booster engine sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.9);
      
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    } else if (type === "ship_down") {
      // Descending mechanical stall sound list drift
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 1.1);
      
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.1);
    }
  } catch (error) {
    // Suppress Web Audio autoplay policy restrictions
  }
};

// Immersive procedural space ambient chimes/drone synthesizer
class SpaceAmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private intervalId: any = null;
  public isPlaying: boolean = false;

  constructor() {}

  start() {
    if (this.isPlaying) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 3.0); // Very soft, peaceful and subtle master level
      this.masterGain.connect(this.ctx.destination);

      // Low pass drone filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(110, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Bass hum (A1 note) - soft warm drone padding
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = "sawtooth";
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);
      const gainDrone1 = this.ctx.createGain();
      gainDrone1.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.droneOsc1.connect(gainDrone1);
      gainDrone1.connect(this.filter);

      // Soft triangle fifth (E2 note)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = "triangle";
      this.droneOsc2.frequency.setValueAtTime(82.4, this.ctx.currentTime);
      const gainDrone2 = this.ctx.createGain();
      gainDrone2.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.droneOsc2.connect(gainDrone2);
      gainDrone2.connect(this.filter);

      // LFO sweep filter
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = "sine";
      this.lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(40, this.ctx.currentTime);
      
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.lfo.start();

      // Pentatonic warm chimes array
      const scale = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      
      const playCelestialNote = () => {
        if (!this.ctx || !this.masterGain || this.ctx.state === "suspended") return;
        const noteFreq = scale[Math.floor(Math.random() * scale.length)];
        
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);
        
        chimeGain.gain.setValueAtTime(0, this.ctx.currentTime);
        chimeGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 1.2); // Soft, non-intrusive starry twinkling sound
        chimeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 5.5);
        
        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.masterGain);
        
        chimeOsc.start();
        chimeOsc.stop(this.ctx.currentTime + 5.6);
      };

      this.intervalId = setInterval(() => {
        if (Math.random() < 0.4) {
          playCelestialNote();
        }
      }, 4500);

      // Bypass browser autoplay blocker via first interaction dynamic resume
      const resumeAudioOnGesture = () => {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().then(() => {
            console.log("SpaceAmbientSynthesizer: AudioContext resumed successfully on interaction.");
          });
        }
        window.removeEventListener("click", resumeAudioOnGesture);
        window.removeEventListener("keydown", resumeAudioOnGesture);
      };
      window.addEventListener("click", resumeAudioOnGesture);
      window.addEventListener("keydown", resumeAudioOnGesture);

      this.isPlaying = true;
    } catch (e) {
      console.warn("Chime synth fail:", e);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      }
      
      const tempId = this.intervalId;
      const tempCtx = this.ctx;
      const d1 = this.droneOsc1;
      const d2 = this.droneOsc2;
      const lf = this.lfo;
      
      setTimeout(() => {
        if (d1) { try { d1.stop(); d1.disconnect(); } catch (e) {} }
        if (d2) { try { d2.stop(); d2.disconnect(); } catch (e) {} }
        if (lf) { try { lf.stop(); lf.disconnect(); } catch (e) {} }
        if (tempId) { clearInterval(tempId); }
        if (tempCtx) { try { tempCtx.close(); } catch (e) {} }
      }, 1300);

      this.isPlaying = false;
    } catch (e) {
      this.isPlaying = false;
    }
  }
}

// Immersive space background stars simulator
const SpaceStarsBackground = React.memo(() => {
  const starsArray = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 90; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 1.8 + 0.8;
      const speed = Math.floor(Math.random() * 3); // 0 = fast, 1 = mid, 2 = slow
      const opacity = Math.random() * 0.7 + 0.3;
      arr.push({ top, left, size, speed, opacity });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {starsArray.map((star, idx) => {
        let twinkleClass = "star-twinkle-mid";
        if (star.speed === 0) twinkleClass = "star-twinkle-fast";
        if (star.speed === 2) twinkleClass = "star-twinkle-slow";
        return (
          <div
            key={idx}
            className={`space-star ${twinkleClass}`}
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        );
      })}
    </div>
  );
});
SpaceStarsBackground.displayName = "SpaceStarsBackground";

// Floating WALL-E and EVE space-dance animation actors
const BackgroundWallEAndEve = React.memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. WALL-E Drifter (holding fire extinguisher with smoke bursts) */}
      <div className="absolute walle-drifter left-0 top-0 w-32 h-32 flex items-center justify-center animate-pulse duration-[3s]">
        <div className="relative flex flex-col items-center">
          {/* Expressive Binocular Eyes */}
          <div className="flex gap-1 mb-[-2px] z-10">
            {/* Left Eye */}
            <div className="w-6 h-5 bg-stone-400 border border-stone-600 rounded-lg flex items-center justify-center transform -rotate-12 overflow-hidden shadow-md">
              <div className="w-3.5 h-3.5 bg-stone-900 rounded-full flex items-center justify-center relative walle-eye-blink">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            {/* Right Eye */}
            <div className="w-6 h-5 bg-stone-400 border border-stone-600 rounded-lg flex items-center justify-center transform rotate-12 overflow-hidden shadow-md">
              <div className="w-3.5 h-3.5 bg-stone-900 rounded-full flex items-center justify-center relative walle-eye-blink">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
          </div>
          
          {/* Neck Segment */}
          <div className="w-2.5 h-2 bg-stone-500 rounded border border-stone-600 z-5"></div>
          
          {/* Body Box */}
          <div className="w-14 h-12 bg-amber-500 border-2 border-amber-700 rounded-lg flex flex-col justify-between p-1 shadow-lg relative overflow-hidden">
            {/* Solar Panel Charging indicator bar */}
            <div className="w-full h-1.5 bg-stone-950 rounded-sm flex items-center gap-0.5 px-0.5">
              <div className="w-1.5 h-0.5 bg-emerald-500 animate-pulse"></div>
              <div className="w-1.5 h-0.5 bg-emerald-500"></div>
              <div className="w-1.5 h-0.5 bg-stone-700"></div>
            </div>
            {/* WALL-E letters tag */}
            <div className="text-[7.5px] font-mono font-black text-stone-800 tracking-wider bg-amber-400/95 rounded px-0.5 py-0.2 select-none leading-none scale-90 text-center">
              WALL·E
            </div>
            {/* Shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Crawler Treads */}
          <div className="flex justify-between w-16 px-0.5 mt-[-2.5px] z-10">
            {/* Left Tread */}
            <div className="w-3.5 h-5 bg-stone-700 border border-stone-950 rounded-md transform rotate-6 shadow-sm"></div>
            {/* Right Tread */}
            <div className="w-3.5 h-5 bg-stone-700 border border-stone-950 rounded-md transform -rotate-6 shadow-sm"></div>
          </div>

          {/* RED FIRE EXTINGUISHER */}
          <div className="absolute -left-3 top-7 flex flex-col items-center">
            {/* Cylindrical Extinguisher */}
            <div className="w-3.5 h-8 bg-red-600 border border-red-800 rounded-b-md rounded-t-sm shadow-md relative flex flex-col items-center">
              {/* Silver nozzle top handler */}
              <div className="absolute -top-2 w-2 h-2 bg-stone-300 border border-stone-500 rounded-t-full"></div>
              {/* Small CO2 Label decall */}
              <div className="w-full h-1.5 bg-white/90 mt-1.5 text-[4.5px] font-mono text-slate-800 font-extrabold flex items-center justify-center leading-none">
                CO2
              </div>
            </div>
            {/* White dynamic smoke bursts spraying backward */}
            <div className="absolute -left-6 top-0">
              <div className="co2-spray-puff w-4 h-4 bg-white/35 rounded-full absolute"></div>
              <div className="co2-spray-puff w-3 h-3 bg-white/25 rounded-full absolute" style={{ animationDelay: "0.3s" }}></div>
              <div className="co2-spray-puff w-5 h-5 bg-white/15 rounded-full absolute" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EVE Drifter (Graceful white floating capsule robot) */}
      <div className="absolute eve-drifter left-0 top-0 w-32 h-32 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Floating standalone arms */}
          <div className="absolute -left-3.5 top-6 w-2 h-7 bg-white border border-slate-100 rounded-full transform -rotate-12 shadow-sm animate-bounce"></div>
          <div className="absolute -right-3.5 top-6 w-2 h-7 bg-white border border-slate-100 rounded-full transform rotate-12 shadow-sm animate-bounce" style={{ animationDelay: "0.2s" }}></div>

          {/* Oval Egg-shaped Head */}
          <div className="w-11 h-8 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-lg z-10 overflow-hidden">
            {/* Glossy Black Visor */}
            <div className="w-9 h-6 bg-stone-950 rounded-xl p-0.5 flex items-center justify-around relative">
              {/* Cute glowing cyan LED eyes */}
              <div className="w-2.5 h-2 bg-sky-400 rounded-full eve-eye-glow"></div>
              <div className="w-2.5 h-2 bg-sky-400 rounded-full eve-eye-glow"></div>
            </div>
          </div>

          {/* Body segment connector */}
          <div className="w-2.5 h-1 bg-stone-200 mt-[-1px] z-5"></div>

          {/* Smooth lowered teardrop torso */}
          <div className="w-9 h-12 bg-white border border-slate-100 rounded-b-2xl rounded-t-lg shadow-lg z-1 flex items-center justify-center overflow-hidden">
            {/* Green plant logo badge */}
            <div className="w-2.5 h-2.5 border border-emerald-500 rounded-full bg-emerald-500/10 flex items-center justify-center relative scale-90">
              <div className="absolute w-1.5 h-0.5 bg-emerald-500 rounded-full -rotate-45 -top-0.5"></div>
              <div className="absolute w-1 h-1 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
BackgroundWallEAndEve.displayName = "BackgroundWallEAndEve";

export default function App() {
  // Current Student Session settings
  const [student, setStudent] = useState<StudentState>(() => {
    const saved = localStorage.getItem("fisica_verse_student");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.level) return parsed;
      } catch (e) { /* fallback */ }
    }
    return {
      xp: 0,
      level: 1,
      lives: 3,
      achievements: [],
      unlockedMissions: ["mis_reciclaje_tierra"],
      collectedItems: ["item_bota_planta", "item_extintor_propulsion"],
      scoreHistory: {},
    };
  });

  // Avatar and Identity Settings
  const [studentName, setStudentName] = useState(() => localStorage.getItem("fisica_verse_username") || "Santiago");
  const [studentAvatar, setStudentAvatar] = useState(() => localStorage.getItem("fisica_verse_avatar") || "wall-e");
  const [isNamingMode, setIsNamingMode] = useState(!localStorage.getItem("fisica_verse_username"));

  // Equipped recycled item as physical simulator Tool (Idea Salvaje 3)
  const [equippedItem, setEquippedItem] = useState<RecycledItem>(recycledItemsRepo[0]);

  // Toast System for accomplishments
  const [toast, setToast] = useState<{ message: string; sub: string; icon: string } | null>(null);

  // Nav Tabs
  const [currentTab, setCurrentTab] = useState<"misiones" | "banco" | "laboratorio" | "chat_mo" | "formulas">("misiones");

  // Mission state trackers
  const [activeMission, setActiveMission] = useState<SpatialMission | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedCurriculum, setCompletedCurriculum] = useState(false);

  // Local physics sandbox variables (Idea Salvaje 4 - Holodetector Simulator)
  const [sandboxHeight, setSandboxHeight] = useState<number>(12); // meters
  const [sandboxGravity, setSandboxGravity] = useState<number>(9.8); // m/s2 (Tierra, Axiom, Luna)
  const [sandboxGravityLabel, setSandboxGravityLabel] = useState<string>("Tierra (9.8 m/s²)");
  const [sandboxResultTriggered, setSandboxResultTriggered] = useState<boolean>(false);
  const [sandboxAnimationActive, setSandboxAnimationActive] = useState<boolean>(false);

  // Carreras Espaciales Interactive Simulation Variables (Idea Salvaje 1 - CO2 Propulsion)
  const [propulsionForce, setPropulsionForce] = useState<number>(100); // Newtons
  const [propulsionMass, setPropulsionMass] = useState<number>(equippedItem.mass + 60); // E.g., Wall-E is 60kg + item weight
  const [propulsionAcceleration, setPropulsionAcceleration] = useState<number>(0);
  const [simJetDistance, setSimJetDistance] = useState<number>(15); // visual progress % of Wall-E to EVE
  const [simWinState, setSimWinState] = useState<boolean>(false);
  const [thrustCount, setThrustCount] = useState<number>(0);

  // Vertical Space Flight landing progress track (Axiom ship returning to Earth 0-100)
  const [axiomShipProgress, setAxiomShipProgress] = useState<number>(30);

  // Explanatory onboarding popup trigger for missions landing mechanic
  const [showMissionsPopup, setShowMissionsPopup] = useState<boolean>(true);

  // Interactive celestial background music control
  const [ambientMusicOn, setAmbientMusicOn] = useState<boolean>(true);
  const synthRef = React.useRef<SpaceAmbientSynthesizer | null>(null);

  // Monitor or handle the space ambient music engine
  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new SpaceAmbientSynthesizer();
    }
    if (ambientMusicOn) {
      synthRef.current.start();
    } else {
      synthRef.current.stop();
    }
  }, [ambientMusicOn]);

  // Sync state with LocalStorage for flawless reload persistence
  useEffect(() => {
    localStorage.setItem("fisica_verse_student", JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem("fisica_verse_username", studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem("fisica_verse_avatar", studentAvatar);
  }, [studentAvatar]);

  // Monitor mass conversion when selected equipped item updates
  useEffect(() => {
    setPropulsionMass(Number((studentAvatar === "wall-e" ? 60 : studentAvatar === "eve" ? 40 : studentAvatar === "mo" ? 15 : 80) + equippedItem.mass).toFixed(1) as any);
  }, [equippedItem, studentAvatar]);

  // Display trigger for notifications
  const showToast = (message: string, sub: string, icon = "⭐") => {
    setToast({ message, sub, icon });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Helper inside the curriculum to reward XP
  const awardXp = (amount: number, reason: string) => {
    setStudent((prev) => {
      const newXp = prev.xp + amount;
      const targetXpForNextLevel = prev.level * 400;
      let nextLevel = prev.level;
      let leveledUp = false;

      if (newXp >= targetXpForNextLevel) {
        nextLevel = prev.level + 1;
        leveledUp = true;
      }

      // Check for unlock missions based on XP levels
      const updatedUnlockedMissions = [...prev.unlockedMissions];
      spatialMissionsPreset.forEach((mis) => {
        if (newXp >= mis.unlockedAtXp && !updatedUnlockedMissions.includes(mis.id)) {
          updatedUnlockedMissions.push(mis.id);
        }
      });

      if (leveledUp) {
        setTimeout(() => {
          playSound("unlock");
          showToast(`¡SUBISTE DE NIVEL! `, `Nivel ${nextLevel} alcanzado. ¡Fórmulas más potentes unlocked!`, "🚀");
        }, 1200);
      } else {
        showToast(`+${amount} XP`, reason, "✨");
      }

      return {
        ...prev,
        xp: newXp,
        level: nextLevel,
        unlockedMissions: updatedUnlockedMissions,
      };
    });
  };

  // Extra system to unlock achievements (Trophy Badge system)
  const unlockAchievement = (id: string) => {
    if (student.achievements.includes(id)) return;

    const ach = achievementsList.find((a) => a.id === id);
    if (!ach) return;

    playSound("unlock");
    setStudent((prev) => ({
      ...prev,
      achievements: [...prev.achievements, id],
    }));

    // Reward additional XP
    awardXp(ach.xpValue, `Logro: ${ach.title}`);
    showToast(`🏆 Logro Desbloqueado!`, `${ach.title} (+${ach.xpValue} XP)`, "🎖️");
  };

  // Regeneration of life
  const buyLifeWithXp = () => {
    playSound("click");
    if (student.xp >= 150) {
      setStudent((prev) => ({
        ...prev,
        lives: Math.min(3, prev.lives + 1),
        xp: prev.xp - 150,
      }));
      showToast("Vida adquirida", "Canjeaste 150 XP por una vida extra", "❤️");
    } else {
      showToast("Pocas reservas cinéticas", "Necesitas al menos 150 XP acumulados.", "⚠️");
    }
  };

  const giftLifeFromEve = () => {
    playSound("success");
    setStudent((prev) => ({
      ...prev,
      lives: 3
    }));
    showToast("EVE Activó Escudo", "Tus vidas se han regenerado al 100% de forma segura.", "⚡");
  };

  // Launch Spatial Mission Questionnaire
  const startMission = (mission: SpatialMission) => {
    playSound("click");
    setActiveMission(mission);
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setCompletedCurriculum(false);
    setAxiomShipProgress(30); // Starting point in space
  };

  // Analyze response with low-stress checkpoint features
  const handleAnswerSubmit = () => {
    if (selectedOption === null || !activeMission) return;

    const currentQuestion = activeMission.questions[activeQuestionIndex];
    const correctIdx = currentQuestion.correctAnswerIndex;
    const isCorrectChoice = selectedOption === correctIdx;

    setIsAnswered(true);
    setIsCorrect(isCorrectChoice);

    if (isCorrectChoice) {
      playSound("success");
      
      // Boost the spaceship return progress! Sound and altitude increase
      setAxiomShipProgress((prev) => {
        const step = Math.ceil(70 / activeMission.questions.length);
        return Math.min(100, prev + step);
      });
      setTimeout(() => {
        playSound("ship_up");
      }, 350);
      
      // Update score history
      setStudent((prev) => ({
        ...prev,
        scoreHistory: {
          ...prev.scoreHistory,
          [currentQuestion.id]: true,
        },
      }));

      // Award first mission achievement if applicable
      if (currentQuestion.id === "q_space_newton3") {
        unlockAchievement("ach_primera_mision");
      }
    } else {
      playSound("error");

      // Ship gets stuck or drifts down back in the cold space! Play sound and decrease progress
      setAxiomShipProgress((prev) => Math.max(0, prev - 15));
      setTimeout(() => {
        playSound("ship_down");
      }, 350);
      
      // Deduct extra life
      setStudent((prev) => {
        const nextLives = Math.max(0, prev.lives - 1);
        return {
          ...prev,
          lives: nextLives,
          scoreHistory: {
            ...prev.scoreHistory,
            [currentQuestion.id]: false,
          },
        };
      });

      showToast("¡Contaminante conceptual!", "-1 Vida Extra. Revisa la pista de M-O e intenta nuevamente.", "🩹");
    }
  };

  const handleNextQuestion = () => {
    if (!activeMission) return;

    // Check achievement if done without mistakes
    const wasPerfect = student.lives === 3;

    if (activeQuestionIndex + 1 < activeMission.questions.length) {
      setActiveQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Mission successfully completed!
      playSound("success");
      setCompletedCurriculum(true);
      awardXp(activeMission.xpReward, `Misión Completa: ${activeMission.title}`);

      // Achieve completions
      if (activeMission.id === "mis_reciclaje_tierra") {
        unlockAchievement("ach_maestro_reciclaje");
      } else if (activeMission.id === "mis_axiom_hangar") {
        unlockAchievement("ach_salvador_tierra");
      }

      if (wasPerfect) {
        unlockAchievement("ach_sin_errores");
      }
    }
  };

  // Idea Salvaje 1 - Simulated rocket action
  const firePropulsion = () => {
    playSound("propulsion");
    setThrustCount((prev) => prev + 1);

    // Dynamic equation computing: a = F / m
    const calculatedAcc = parseFloat((propulsionForce / propulsionMass).toFixed(2));
    setPropulsionAcceleration(calculatedAcc);

    // Increase simulation visual distance proportional to acceleration
    setSimJetDistance((prev) => {
      const nextDistance = prev + Math.min(25, calculatedAcc * 15);
      if (nextDistance >= 100) {
        setSimWinState(true);
        unlockAchievement("ach_primera_mision");
        // Reward student
        setTimeout(() => {
          awardXp(150, "Buscador Estelar: Lograste volar junto a EVE");
        }, 1000);
        return 100;
      }
      return parseFloat(nextDistance.toFixed(1));
    });
  };

  const resetPropulsionSim = () => {
    playSound("click");
    setSimJetDistance(15);
    setPropulsionAcceleration(0);
    setSimWinState(false);
    setThrustCount(0);
  };

  // Idea Salvaje 4 - Holodetector calculator trigger
  const triggerHolodetectorTest = () => {
    playSound("click");
    setSandboxAnimationActive(true);
    setSandboxResultTriggered(false);

    // Ep = m * g * h
    const currentMass = equippedItem.mass; 
    const calculatedEp = Number(currentMass * sandboxGravity * sandboxHeight);

    setTimeout(() => {
      setSandboxAnimationActive(false);
      setSandboxResultTriggered(true);
      
      if (calculatedEp >= 100) {
        playSound("success");
        awardXp(120, "Laboratorio del Axiom: ¡Detector Activado!");
        unlockAchievement("ach_salvador_tierra");
        showToast("¡Código Verde!", "La planta tiene suficiente energía potencial gravitatoria en el holodetector.", "🌿");
      } else {
        playSound("error");
        showToast("Energía baja", "Sube la altura, cambia la gravedad o equipa un objeto con mayor masa.", "📉");
      }
    }, 1800);
  };

  // Quick select default gravity levels
  const chooseGravityPreset = (gValue: number, label: string) => {
    playSound("click");
    setSandboxGravity(gValue);
    setSandboxGravityLabel(label);
    setSandboxResultTriggered(false);
  };

  return (
    <div id="fisica_verse_app" className="min-h-screen cosmic-nebula text-slate-100 font-sans antialiased text-base selection:bg-indigo-600 selection:text-white relative">
      {/* Immersive space nebulae layers */}
      <div className="absolute inset-0 pointer-events-none z-0 nebula-purple overflow-hidden"></div>
      <div className="absolute inset-0 pointer-events-none z-0 nebula-cyan overflow-hidden"></div>
      <div className="absolute inset-0 pointer-events-none z-0 nebula-pink overflow-hidden"></div>
      
      {/* Space stars cluster fields */}
      <SpaceStarsBackground />

      {/* Floating Wall-E & EVE space partners */}
      <BackgroundWallEAndEve />

      {/* Inner relative container to display content clearly above the anim actors */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Toast Notification HUD */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-indigo-500 rounded-2xl p-4 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-3 animate-bounce max-w-sm">
          <span className="text-3xl">{toast.icon}</span>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">{toast.message}</h4>
            <p className="text-xs text-sky-400 mt-0.5">{toast.sub}</p>
          </div>
        </div>
      )}

      {/* Profile Intro Naming Modal (Only if name is not set on start) */}
      {isNamingMode && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <span className="text-6xl">🤖</span>
            </div>
            <div className="text-center mt-4">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">¡Bienvenido a Física-Verse!</h2>
              <p className="text-xs text-slate-400 mt-2">
                Ingresa al Axiom y aprende las leyes del movimiento y la energía de forma interactiva con Wall-E y la IA del asistente M-O.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (studentName.trim()) { setIsNamingMode(false); playSound("success"); } }} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-mono text-indigo-400 uppercase tracking-wider block mb-1.5">Nombre del Cadete</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Escribe tu nombre de cadete..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  maxLength={18}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-indigo-400 uppercase tracking-wider block mb-2">Escoge tu Avatar Aliado</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => { setStudentAvatar("wall-e"); playSound("click"); }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${studentAvatar === "wall-e" ? "border-sky-500 bg-sky-950/20" : "border-slate-800 bg-slate-950"}`}
                  >
                    <span className="text-xl">🤖</span>
                    <span className="text-[10px] font-mono">WALL-E</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStudentAvatar("eve"); playSound("click"); }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${studentAvatar === "eve" ? "border-pink-500 bg-pink-950/20" : "border-slate-800 bg-slate-950"}`}
                  >
                    <span className="text-xl">⚪</span>
                    <span className="text-[10px] font-mono">EVE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStudentAvatar("mo"); playSound("click"); }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${studentAvatar === "mo" ? "border-emerald-500 bg-emerald-950/20" : "border-slate-800 bg-slate-950"}`}
                  >
                    <span className="text-xl">🧹</span>
                    <span className="text-[10px] font-mono">M-O</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStudentAvatar("capitan"); playSound("click"); }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${studentAvatar === "capitan" ? "border-amber-500 bg-amber-950/20" : "border-slate-800 bg-slate-950"}`}
                  >
                    <span className="text-xl">👨‍✈️</span>
                    <span className="text-[10px] font-mono">CAPITÁN</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>¡Iniciar Misión Espacial!</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Structural Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* Navigation / Header Brand */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900/60 border border-slate-800 rounded-3xl p-5 mb-8 gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-2xl shadow-lg border border-indigo-400">
              {studentAvatar === "wall-e" ? "🤖" : studentAvatar === "eve" ? "⚪" : studentAvatar === "mo" ? "🧹" : "👨‍✈️"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-950 border border-indigo-700 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-bold">DÉCIMO GRADO</span>
                <h1 className="text-2xl font-black bg-gradient-to-r from-slate-100 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Física-Verse</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Exploración Interactiva de Leyes de Movimiento & Energía con WALL-E</p>
            </div>
          </div>

          {/* Quick Access Profile Stats Dashboard Panel */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-950/50 p-2 rounded-2xl border border-slate-800 w-full md:w-auto">
            
            {/* XP Tracker */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 min-w-[130px]">
              <div className="w-6 h-6 rounded-full bg-indigo-950/50 border border-indigo-500 flex items-center justify-center">
                <Star size={12} className="text-indigo-400 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-mono leading-none">XP ACUMULADA</p>
                <p className="font-bold text-slate-100 text-sm">{student.xp} pts</p>
              </div>
            </div>

            {/* Level Tracker */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 min-w-[140px]">
              <div className="w-6 h-6 rounded-full bg-sky-950/50 border border-sky-400 flex items-center justify-center">
                <Trophy size={12} className="text-sky-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-mono leading-none flex justify-between">
                  <span>NIVEL {student.level}</span>
                  <span className="text-indigo-400">{student.xp % 400}/400</span>
                </p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-sky-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (student.xp % 400) / 4)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Heart Active Protections (Vidas Extras) */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 min-w-[150px]">
              <div className="flex gap-1">
                {[1, 2, 3].map((heart) => (
                  <Heart
                    key={heart}
                    size={16}
                    className={`transition-all duration-300 ${
                      heart <= student.lives 
                        ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" 
                        : "text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-mono leading-none">VIDAS EXTRAS</p>
                <p className="font-bold text-xs text-slate-200">{student.lives} / 3 protectoras</p>
              </div>
              {student.lives < 3 && (
                <button
                  onClick={buyLifeWithXp}
                  title="Recargar 1 Vida por 150 XP"
                  className="ml-1 bg-red-950/50 border border-red-800 hover:bg-red-900 text-red-300 p-1 rounded text-[10px] font-mono transition cursor-pointer"
                >
                  +1 ❤️
                </button>
              )}
            </div>

            {/* Change Profile Trigger */}
            <button
              onClick={() => { setIsNamingMode(true); playSound("click"); }}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-xl transition cursor-pointer"
              title="Cambiar cadete o avatar"
            >
              🧑‍🚀 {studentName}
            </button>

            {/* Ambient Music Toggler */}
            <button
              onClick={() => { setAmbientMusicOn((prev) => !prev); playSound("click"); }}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition cursor-pointer text-xs font-mono font-bold ${
                ambientMusicOn 
                  ? "bg-indigo-950/60 border-indigo-500 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
              title="Activar/Desactivar Música Espacial Continuamente"
            >
              <span className="text-sm shrink-0">{ambientMusicOn ? "🎵" : "🔇"}</span>
              <span className="truncate">Ambiental Astro {ambientMusicOn ? "ON" : "OFF"}</span>
              {ambientMusicOn && (
                <div className="flex gap-0.5 items-end h-3 w-3 overflow-hidden shrink-0 ml-0.5">
                  <span className="w-0.5 bg-indigo-400 rounded-full h-full animate-bounce"></span>
                  <span className="w-0.5 bg-indigo-400 rounded-full h-2/3 animate-bounce delay-75"></span>
                  <span className="w-0.5 bg-indigo-400 rounded-full h-1/2 animate-bounce delay-150"></span>
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Level Restoration Guard Banner if they are dead (Axiom Rescue checkpoint!) */}
        {student.lives <= 0 && (
          <div className="bg-gradient-to-r from-red-950/60 to-slate-900 border-2 border-red-600 rounded-3xl p-6 mb-8 shadow-2xl relative overflow-hidden animate-pulse">
            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10">
              <span className="text-9xl">🚨</span>
            </div>
            <h3 className="text-xl font-black text-red-400 flex items-center gap-2">
              <AlertCircle size={24} className="animate-spin" />
              ¡SISTEMA CRÍTICO BLOQUEADO POR CONTAMINANTES!
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              ¡Hola {studentName}! Has perdido todas tus vidas extras respondiendo preguntas con polvo conceptual. De acuerdo a la directiva de stress nulo, ¡el error es aprendizaje! No te desanimes. Puedes restaurar tus vidas de forma instantánea de las siguientes formas:
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={giftLifeFromEve}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-lg text-xs cursor-pointer flex items-center gap-2"
              >
                <Shield size={14} />
                <span>Pedir ayuda a EVE (Escudo Regenerativo Gratis)</span>
              </button>
              {student.xp >= 150 && (
                <button
                  onClick={buyLifeWithXp}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-lg text-xs cursor-pointer"
                >
                  Canjear 150 XP por 1 Vida ❤️
                </button>
              )}
              <button
                onClick={() => { setCurrentTab("chat_mo"); playSound("click"); }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl transition text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Bot size={14} />
                <span>Consultar el herbario o M-O en Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Selector Nav Menu */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto whitespace-nowrap p-0.5 gap-2 scrollbar-none shrink-0">
          <button
            onClick={() => { setCurrentTab("misiones"); setShowMissionsPopup(true); playSound("click"); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${currentTab === "misiones" ? "bg-slate-900 text-indigo-400 border-t-2 border-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"}`}
          >
            <MapPin size={16} />
            <span>1. Misiones: Práctica Segura</span>
          </button>
          
          <button
            onClick={() => { setCurrentTab("banco"); playSound("click"); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer relative ${currentTab === "banco" ? "bg-slate-900 text-indigo-400 border-t-2 border-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"}`}
          >
            <Archive size={16} />
            <span>2. Banco de Reciclaje</span>
            <span className="absolute top-1 right-2 bg-indigo-950 border border-indigo-500 text-indigo-400 text-[9px] px-1 py-0.1 rounded">Equipar</span>
          </button>

          <button
            onClick={() => { setCurrentTab("laboratorio"); playSound("click"); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${currentTab === "laboratorio" ? "bg-slate-900 text-indigo-400 border-t-2 border-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"}`}
          >
            <Flame size={16} />
            <span>3. Lab del Axiom (Sliders)</span>
          </button>

          <button
            onClick={() => { setCurrentTab("chat_mo"); playSound("click"); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${currentTab === "chat_mo" ? "bg-slate-900 text-indigo-400 border-t-2 border-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"}`}
          >
            <Bot size={16} />
            <span>4. IA Sidekick M-O</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </button>

          <button
            onClick={() => { setCurrentTab("formulas"); playSound("click"); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${currentTab === "formulas" ? "bg-slate-900 text-indigo-400 border-t-2 border-indigo-500" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"}`}
          >
            <Info size={16} />
            <span>Copia de Fórmulas</span>
          </button>
        </div>

        {/* Tab Contents Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Left Block for Active Tab content (2 cols wide on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TAB 1: MISSION QUESTIONNAIRE & SAFEPRACTICE & CARRERA-SIMULATORS */}
            {currentTab === "misiones" && (
              <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full animate-fadeIn">
                {/* Onboarding flight manual explanation popup */}
                {showMissionsPopup && (
                  <div className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-indigo-500 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(99,102,241,0.25)] relative overflow-hidden">
                      {/* Decorative outer space elements */}
                      <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 pointer-events-none select-none">🚀</div>
                      <div className="absolute bottom-0 left-0 p-8 text-7xl opacity-5 pointer-events-none select-none">📡</div>
                      
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center bg-indigo-950 border border-indigo-400/30 rounded-full py-1.5 px-4 shadow-[0_0_15px_rgba(99,102,241,0.3)] mb-4 animate-pulse">
                          <span className="text-[10px] font-mono font-bold text-indigo-300 flex items-center gap-2 tracking-widest">
                             🛰️ OPERACIÓN CONTROL DE VUELO
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                          ¿Cómo Guiar la Nave a Tierra?
                        </h2>
                        <p className="text-xs text-indigo-200 mt-2">
                          Cadete <strong className="text-sky-400 font-mono">{studentName || "Estudiante"}</strong>, tus respuestas de física son las que alimentan nuestro propulsor voltaico del Axiom.
                        </p>
                      </div>

                      <div className="space-y-4 bg-slate-950/60 rounded-2xl p-5 border border-slate-800/80 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="bg-sky-950/80 border border-sky-500/30 rounded-xl p-2 shrink-0 text-xl">
                            🌍
                          </div>
                          <div>
                            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">La Meta: Rumbo Tierra (Arriba)</h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              Arriba verás el icono de la <strong>Tierra (🌍)</strong>. Nuestro destino para plantar la primera planta y salvar el universo.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-emerald-950/80 border border-emerald-500/30 rounded-xl p-2 shrink-0 text-xl animate-bounce">
                            🚀
                          </div>
                          <div>
                            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Empuje con Respuestas Correctas</h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              Entre <strong>más respuestas correctas</strong> tengas en las misiones libres de estrés, ¡más subirá la nave en la barra hacia la Tierra!
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-red-950/80 border border-red-500/30 rounded-xl p-2 shrink-0 text-xl">
                            🪐
                          </div>
                          <div>
                            <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Frenado por Errores</h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              Si tienes <strong>respuestas incorrectas</strong>, la nave se quedará estancada en el espacio profundo o se deslizará disminuyendo su altitud.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono text-center sm:text-left leading-tight">
                          🔊 Emite ondas de sonido reactivas al subir y bajar.
                        </span>
                        <button
                          onClick={() => { setShowMissionsPopup(false); playSound("propulsion"); }}
                          className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-bold font-mono text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer hover:scale-105 active:scale-95 text-center"
                        >
                          🚀 INICIAR NAVEGACIÓN
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VERTICAL SHIELD / PROGRESS GAUGE */}
                <div id="vertical_navigation_track" className="w-full lg:w-36 bg-slate-900/60 border-2 border-indigo-500/40 rounded-3xl p-4 flex flex-row lg:flex-col items-center justify-between relative backdrop-blur-md shrink-0 gap-3 md:gap-4 shadow-xl">
                  {/* Glowing background highlights */}
                  <div className="absolute inset-x-0 top-0 h-1/4 bg-sky-500/5 filter blur-xl rounded-t-3xl pointer-events-none"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-red-500/5 filter blur-xl rounded-b-3xl pointer-events-none"></div>

                  {/* Header: Earth Destination (Arriba / Izquierda) */}
                  <div className="text-center z-10 w-1/3 lg:w-full flex lg:flex-col items-center justify-center lg:justify-start gap-1">
                    <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(14,165,233,0.8)] block animate-pulse">🌍</span>
                    <div className="text-left lg:text-center">
                      <span className="text-[10px] font-mono font-black text-sky-400 block tracking-widest uppercase leading-none">Rumbo Tierra</span>
                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Destino Final</span>
                    </div>
                  </div>

                  {/* Vertical Progress Bar Body Segment (Centro) */}
                  <div className="flex-1 lg:w-full flex items-center justify-center relative min-h-[140px] lg:min-h-[220px] max-h-[260px]">
                    {/* The Rail Tube */}
                    <div className="w-4 bg-slate-950 rounded-full h-full border border-slate-850 relative shadow-inner overflow-visible flex flex-col justify-end">
                      {/* Active level line */}
                      <div 
                        className="bg-gradient-to-t from-orange-500 via-indigo-500 to-sky-400 rounded-full w-full transition-all duration-700 ease-out"
                        style={{ height: `${axiomShipProgress}%` }}
                      ></div>

                      {/* Moving Indicator: The Space Ship Icon (🚀) */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20 flex flex-col items-center"
                        style={{ bottom: `calc(${axiomShipProgress}% - 6px)` }}
                      >
                        <div className="bg-slate-900 border-2 border-sky-450 rounded-full p-2 hover:scale-110 transition shadow-[0_0_15px_rgba(56,189,248,0.73)]">
                          <span className="text-xl block filter drop-shadow-[0_2px_5px_rgba(56,189,248,0.5)]">🚀</span>
                        </div>
                        {isAnswered && isCorrect && (
                          <span className="absolute -top-7 text-[9px] bg-emerald-500 text-white font-mono rounded-lg px-2 py-0.5 font-bold animate-bounce whitespace-nowrap">+Subida!</span>
                        )}
                        <div className="h-4 flex items-center justify-center text-xs text-orange-500 animate-pulse mt-1">
                          🔥
                        </div>
                      </div>
                    </div>

                    {/* Left/Right Scale Reference lines */}
                    <div className="absolute right-1 top-0 h-full flex flex-col justify-between text-[8px] font-mono text-slate-500 select-none z-10 pointer-events-none">
                      <span>100%</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>
                  </div>

                  {/* Footer: Outer Space Origin (Abajo / Derecha) */}
                  <div className="text-center z-10 w-1/3 lg:w-full border-l lg:border-l-0 lg:border-t border-slate-800 lg:pt-3 pl-3 lg:pl-0 flex lg:flex-col items-center justify-center lg:justify-start gap-1">
                    <span className="text-3xl block filter drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">🪐</span>
                    <div className="text-left lg:text-center">
                      <span className="text-[10px] font-mono font-bold text-red-400 block tracking-wider uppercase leading-none">Abismo Espacio</span>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 font-black uppercase">
                        {axiomShipProgress <= 30 ? "Nave Atascada" : axiomShipProgress >= 100 ? "¡Tierra a Salvo!" : "En Vuelo"}
                      </p>
                      <div className="mt-1 bg-slate-950/80 rounded-lg px-2 py-0.5 text-[10px] font-mono text-indigo-400 border border-slate-850 inline-block font-black">
                        {Math.round(axiomShipProgress)}% Altitud
                      </div>
                      <button
                        onClick={() => { setShowMissionsPopup(true); playSound("click"); }}
                        className="mt-1.5 text-[9px] text-cyan-400 font-bold border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 rounded-lg px-2 py-1 hover:text-cyan-200 transition-all block w-full text-center cursor-pointer font-mono"
                        title="Ver Instructivo de Navegación"
                      >
                        ❓ Reglas de Vuelo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Missions selection / Questionnaire content */}
                <div className="flex-1 space-y-6">
                  
                  {/* Mission selection dashboard */}
                  {!activeMission ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                          <Compass className="text-sky-400 animate-spin-slow" size={20} />
                          Elige tu Destino de Física-Verse
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Conecta con tus aliados de Wall-E en misiones libres de estrés</p>
                      </div>
                      <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-mono">3 Misiones Disponibles</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {spatialMissionsPreset.map((mis) => {
                        const isUnlocked = student.xp >= mis.unlockedAtXp;
                        return (
                          <div 
                            key={mis.id} 
                            className={`border-2 rounded-2xl p-5 flex flex-col justify-between transition relative overflow-hidden ${
                              isUnlocked 
                                ? "border-slate-800 bg-slate-900 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                                : "border-slate-950 bg-slate-950/60 opacity-60"
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                                  mis.difficulty === "Bajo" ? "bg-emerald-950/50 border border-emerald-800 text-emerald-400" :
                                  mis.difficulty === "Medio" ? "bg-amber-950/50 border border-amber-800 text-amber-400" :
                                  "bg-red-950/50 border border-red-800 text-red-400"
                                }`}>
                                  Dificultad {mis.difficulty}
                                </span>
                                <span className="text-xs text-indigo-400 font-mono font-black">+{mis.xpReward} XP</span>
                              </div>

                              <h3 className="font-extrabold text-slate-200 mt-1">{mis.title}</h3>
                              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{mis.description}</p>
                              <p className="text-[11px] text-sky-400 font-mono mt-3 flex items-center gap-1">
                                <MapPin size={10} /> Ubicación: {mis.location}
                              </p>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-850 flex items-center justify-between">
                              {!isUnlocked ? (
                                <span className="text-[11px] text-rose-400 font-mono">🔒 Desbloquear con {mis.unlockedAtXp} XP total</span>
                              ) : (
                                <span className="text-[11px] text-emerald-400 font-mono">⚡ Desbloqueado</span>
                              )}

                              <button
                                onClick={() => isUnlocked && startMission(mis)}
                                disabled={!isUnlocked}
                                className={`px-4 py-2 rounded-xl font-bold text-xs transition duration-300 flex items-center gap-1.5 cursor-pointer ${
                                  isUnlocked 
                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                }`}
                              >
                                <span>Iniciar</span>
                                <Play size={10} className="fill-current" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Fun Idea Salvaje 1 Spotlight inside the Tab */}
                    <div className="mt-8 bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-indigo-950 border border-indigo-600 text-indigo-400 text-[10px] font-mono px-2 py-0.5 rounded">IDEA SALVAJE 1</span>
                        <h3 className="font-extrabold text-indigo-300">¡Bailando en el Espacio con WALL-E y EVE!</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed md:w-3/4">
                        Ajusta la fuerza del extintor y calcula la aceleración real experimentada para que Wall-E se propulse horizontalmente en el vacío estelar hasta encontrarse con su amada EVE.
                      </p>

                      {/* Interactive Propulsion Lab Widget */}
                      <div className="mt-4 p-4 bg-slate-900 border border-slate-805 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div className="space-y-3">
                            <div>
                              <label className="text-[11px] font-mono text-slate-400 flex justify-between">
                                <span>fuerza de empuje del extintor (Acción)</span>
                                <span className="text-indigo-400 font-bold">{propulsionForce} N</span>
                              </label>
                              <input 
                                type="range" 
                                min={20} 
                                max={250} 
                                step={10}
                                value={propulsionForce} 
                                onChange={(e) => { setPropulsionForce(Number(e.target.value)); playSound("click"); }}
                                className="w-full accent-indigo-500 mt-1 cursor-pointer"
                              />
                            </div>

                            <div>
                              <p className="text-[11px] font-mono text-slate-405 flex justify-between">
                                <span>Masa total (Masa de WALL-E + Objeto Equipado)</span>
                                <span className="text-indigo-400 font-bold">{propulsionMass} kg</span>
                              </p>
                              <p className="text-[10px] text-slate-500 italic mt-0.5">
                                Equipado actualmente: <b>{equippedItem.name} ({equippedItem.mass} kg)</b>
                              </p>
                            </div>

                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-center font-mono text-xs">
                              <span className="text-slate-400">Ecuación 2da Ley: a = F / m</span>
                              <div className="text-sm font-bold text-sky-400 mt-1">
                                {propulsionForce} N / {propulsionMass} kg =&nbsp;
                                <span className="text-indigo-400 text-base">{(propulsionForce / propulsionMass).toFixed(2)} m/s²</span>
                              </div>
                            </div>
                          </div>

                          {/* 2D Space Race visualizer simulation stage */}
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-36 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-600">Simulación Espacial</div>
                            
                            <div className="absolute top-4 left-4 flex gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                            </div>

                            {/* Outer stars decoration */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                            {/* Moving Wall-E & Eve stage */}
                            <div className="flex-1 w-full relative flex items-center">
                              {/* EVE static target */}
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-center">
                                <div className="text-3xl animate-bounce delay-150">⚪</div>
                                <span className="text-[10px] font-mono text-slate-400">EVE</span>
                              </div>

                              {/* Wall-E moving sprite */}
                              <div 
                                className="absolute transition-all duration-300 ease-out flex flex-col items-center"
                                style={{ left: `calc(${simJetDistance}% - 14px)` }}
                              >
                                <div className="text-3xl relative">
                                  🤖
                                  {thrustCount > 0 && !simWinState && (
                                    <span className="absolute -left-6 top-1.5 text-orange-500 animate-ping text-sm rotate-90">🔥</span>
                                  )}
                                </div>
                                <span className="text-[9px] font-mono bg-slate-800 px-1 py-0.2 rounded mt-1 text-slate-300">WALL-E</span>
                              </div>
                            </div>

                            {/* Controller buttons & indicators */}
                            <div className="flex items-center justify-between border-t border-slate-900 pt-1.5">
                              <span className="text-[10px] text-slate-400 font-mono">
                                Distancia: <b>{simJetDistance}%</b>
                              </span>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={firePropulsion}
                                  disabled={simWinState}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded px-3 py-1 text-[11px] font-bold tracking-wider uppercase transition cursor-pointer disabled:opacity-50"
                                >
                                  Propulsar CO2 🚀
                                </button>
                                <button
                                  onClick={resetPropulsionSim}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded px-2 py-1 text-[11px] cursor-pointer"
                                  title="Reiniciar simulador"
                                >
                                  <RotateCcw size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {simWinState && (
                          <div className="p-3 bg-indigo-950/60 border border-indigo-700 rounded-xl text-center space-y-1">
                            <p className="font-bold text-sky-300 flex items-center justify-center gap-2 text-sm">
                              <Sparkles size={16} className="text-emerald-400 animate-spin" />
                              ¡ESTACIÓN ALCANZADA! Newton estaría orgulloso
                            </p>
                            <p className="text-xs text-slate-300">
                              Wall-E coordinó su impulso para vencer la inercia espacial. ¡Logró entregarle la planta a EVE a tiempo de forma segura!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Active Mission Question view (Práctica primero, luego teoría) */
                  <div className="bg-slate-900/60 border-2 border-indigo-500 rounded-3xl p-6 md:p-8 relative">
                    
                    {/* Background indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-mono">
                        Pregunta: {activeQuestionIndex + 1} / {activeMission.questions.length}
                      </span>
                      <button
                        onClick={() => { setActiveMission(null); playSound("click"); }}
                        className="text-slate-400 hover:text-slate-200 text-xs bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full cursor-pointer"
                        title="Abandonar Misión"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>

                    <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">{activeMission.title}</p>
                    <h2 className="text-xl font-bold text-slate-100 mt-2 mb-4 leading-normal">
                      Materia: {activeMission.questions[activeQuestionIndex].concept}
                    </h2>

                    {/* Step 1: Learning/Simulation Sandbox before answer */}
                    <div className="bg-slate-950 rounded-2xl p-4 mb-6 border border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Mecánica de Práctica Visual</h4>
                      </div>
                      <p className="text-xs text-slate-300 italic mb-3">
                        "{activeMission.questions[activeQuestionIndex].narrative}"
                      </p>

                      {/* Render custom simulated layout according to the interactive type */}
                      {activeMission.simulationType === "recycle-scale" && (
                        <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-around text-center border border-slate-850">
                          <div>
                            <span className="text-2xl block animate-bounce">🥾</span>
                            <span className="text-[10px] font-mono text-slate-450 block mt-1">BOTA DE CUERO</span>
                            <span className="text-xs font-bold text-sky-400 font-mono">0.5 kg</span>
                          </div>
                          <div className="text-indigo-400 text-xl font-mono">×</div>
                          <div>
                            <span className="text-2xl block">🌍</span>
                            <span className="text-[10px] font-mono text-slate-450 block mt-1">GRAVEDAD TIERRA</span>
                            <span className="text-xs font-bold text-sky-400 font-mono">9.8 m/s²</span>
                          </div>
                          <div className="text-indigo-400 text-xl font-mono">=</div>
                          <div className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5">
                            <span className="text-[9px] font-mono text-slate-500 block leading-none">W = m · g</span>
                            <span className="text-sm font-bold text-emerald-400 font-mono">4.9 Newtons</span>
                          </div>
                        </div>
                      )}

                      {activeMission.simulationType === "propulsion" && (
                        <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-around text-center border border-slate-850 font-mono text-xs">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase block leading-none">Fuerza Empuje</p>
                            <p className="font-black text-sky-300 mt-1">60 N</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase block leading-none">Inercia (Masa m)</p>
                            <p className="font-black text-indigo-400 mt-1">120 kg</p>
                          </div>
                          <div className="bg-slate-950 px-2 py-1 rounded">
                            <p className="text-[9px] text-slate-500 block">a = F/m</p>
                            <p className="font-bold text-emerald-400">0.5 m/s²</p>
                          </div>
                        </div>
                      )}

                      {activeMission.simulationType === "axiom-elevator" && (
                        <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-around text-center border border-slate-850 font-mono text-xs">
                          <div>
                            <p className="text-[9px] text-slate-500 uppercase block">Altura (h)</p>
                            <p className="font-black text-sky-300 mt-1">10 metros</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-500 uppercase block">Gravedad Axiom (g)</p>
                            <p className="font-black text-indigo-400 mt-1">10 m/s²</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-500 uppercase block">Ep = m · g · h</p>
                            <p className="font-bold text-emerald-400 mt-1">0.8 kg × 10 × 10 = 80 J</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: The actual question prompt */}
                    <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
                      <p className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-4">
                        <HelpCircle size={18} className="text-sky-400 shrink-0" />
                        {activeMission.questions[activeQuestionIndex].questionText}
                      </p>

                      <div className="space-y-2.5">
                        {activeMission.questions[activeQuestionIndex].options.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => { if (!isAnswered) { setSelectedOption(idx); playSound("click"); } }}
                              disabled={isAnswered}
                              className={`w-full text-left p-4 rounded-xl text-xs transition duration-200 border cursor-pointer ${
                                isAnswered
                                  ? idx === activeMission.questions[activeQuestionIndex].correctAnswerIndex
                                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                                    : isSelected
                                      ? "bg-red-950/40 border-red-500 text-red-300"
                                      : "bg-slate-950 border-slate-900 text-slate-500"
                                  : isSelected
                                    ? "bg-indigo-950/40 border-indigo-500 text-slate-100 font-medium"
                                    : "bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                                  isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Actions row with protection mechanics (pista / hint of M-O) */}
                      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between pt-4 border-t border-slate-850">
                        <div>
                          <button
                            onClick={() => { setShowHint((p) => !p); playSound("click"); }}
                            className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Bot size={14} className="text-emerald-400" />
                            <span>{showHint ? "Ocultar Pista de M-O" : "Pedir Pista a M-O"}</span>
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {!isAnswered ? (
                            <button
                              onClick={handleAnswerSubmit}
                              disabled={selectedOption === null}
                              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition duration-300 cursor-pointer ${
                                selectedOption !== null 
                                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950" 
                                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              Verificar Respuesta
                            </button>
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition duration-300 shadow-md cursor-pointer flex items-center gap-2"
                            >
                              <span>{activeQuestionIndex + 1 === activeMission.questions.length ? "Terminar Misión" : "Siguiente pregunta"}</span>
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Visual display of Hint */}
                      {showHint && (
                        <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-800 rounded-xl flex gap-3 animate-pulse">
                          <span className="text-2xl pt-1">🧹</span>
                          <div>
                            <h5 className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">Pista Escaneada por M-O</h5>
                            <p className="text-xs text-emerald-300 mt-1 leading-relaxed">
                              "{activeMission.questions[activeQuestionIndex].hint}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Detailed quantitative physics Feedback after answer (Aprender del error es crecer!) */}
                      {isAnswered && (
                        <div className={`mt-4 p-4 rounded-xl border ${
                          isCorrect 
                            ? "bg-emerald-950/20 border-emerald-800 text-emerald-300" 
                            : "bg-red-950/20 border-red-800 text-red-300"
                        }`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {isCorrect ? (
                              <CheckCircle size={18} className="text-emerald-400" />
                            ) : (
                              <XCircle size={18} className="text-red-400" />
                            )}
                            <span className="text-xs font-mono uppercase tracking-widest font-bold">
                              {isCorrect ? "¡Impecable! Limpieza Completa" : "Alerta de Polvo Conceptual"}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-200">
                            {activeMission.questions[activeQuestionIndex].explanation}
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* Celebration display of mission completed */}
                {completedCurriculum && activeMission && (
                  <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border-2 border-indigo-400 rounded-3xl p-6 text-center space-y-4 animate-pulse">
                    <span className="text-6xl block">🚀</span>
                    <h2 className="text-2xl font-black text-slate-100">¡Reto Superado de Física-Verse!</h2>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      ¡Felicidades, cadete {studentName}! Completaste la misión <b>{activeMission.title}</b> de forma exitosa. Has purificado todo el aire de basura conceptual.
                    </p>
                    <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl inline-block max-w-xs mx-auto font-mono text-xs">
                      <p className="text-indigo-400">Recompensas Ganadas:</p>
                      <p className="font-extrabold text-sm text-slate-200 mt-1 flex justify-center items-center gap-1.5">
                        <span>+{activeMission.xpReward} XP Generada</span>
                        <Star className="text-indigo-400 fill-indigo-400" size={14} />
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => { setActiveMission(null); setCompletedCurriculum(false); playSound("click"); }}
                        className="bg-indigo-600 hover:bg-indigo-505 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
                      >
                        Volver a la Base Estelar
                      </button>
                    </div>
                  </div>
                )}

                </div>
              </div>
            )}

            {/* TAB 2: WALL-E'S RECYCLE BIN BARREL (Idea Salvaje 3 - Banco de Objetos) */}
            {currentTab === "banco" && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                      <Archive size={20} className="text-indigo-400" />
                      Banco de Objetos Reciclables
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Conoce la masa real de los desechos acumulados por WALL-E y equipalos para alterar simulaciones</p>
                  </div>

                  {/* Show Currently Equipped as Physical Tool */}
                  <div className="bg-indigo-950/50 border border-indigo-700/80 px-4 py-2 rounded-xl text-xs flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block leading-none">Equipado en Simulaciones</span>
                      <span className="font-extrabold text-slate-200">{equippedItem.name} ({equippedItem.mass} kg)</span>
                    </div>
                  </div>
                </div>

                {/* Grid list of trash items gathered */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recycledItemsRepo.map((item) => {
                    const isEquipped = equippedItem.id === item.id;
                    return (
                      <div 
                        key={item.id}
                        onClick={() => { setEquippedItem(item); playSound("success"); }}
                        className={`p-4 rounded-2xl border transition duration-200 cursor-pointer flex gap-3.5 relative overflow-hidden ${
                          isEquipped 
                            ? "bg-slate-900 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]" 
                            : "bg-slate-950 border-slate-850 hover:border-slate-700"
                        }`}
                      >
                        {/* Decorative selected badge */}
                        {isEquipped && (
                          <div className="absolute top-0 right-0 bg-indigo-600 text-[9px] font-bold text-white px-2.5 py-0.5 rounded-bl-xl font-mono">
                            HERRAMIENTA ACTIVA
                          </div>
                        )}

                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-3xl shrink-0 border border-slate-800">
                          {item.id === "item_bota_planta" ? "🌱" :
                           item.id === "item_extintor_propulsion" ? "🧯" :
                           item.id === "item_cubo_basura" ? "📦" :
                           item.id === "item_cinta_hello_dolly" ? "📼" :
                           item.id === "item_cubo_rubik" ? "🧩" :
                           item.id === "item_cubierto_spork" ? "🍴" :
                           item.id === "item_bateria_portatil" ? "🔋" : "⚙️"}
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-200 text-sm">{item.name}</h4>
                          <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                          
                          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                            <span className="bg-sky-950/50 border border-sky-900 text-sky-400 px-2 py-0.5 rounded">
                              Masa: {item.mass} kg
                            </span>
                            <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                              Propiedad: {item.specialProperty}
                            </span>
                          </div>

                          <span className="text-[10px] text-indigo-400 block pt-1.5">
                            🔬 <b>Principio Relacionado:</b> {item.physicsTopic}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Info size={14} className="text-amber-500 animate-pulse" />
                    ¿Cómo afecta este objeto equipado al resto de las pestañas?
                  </h4>
                  <ul className="list-disc pl-5 text-slate-350 space-y-1">
                    <li><b>En la pestaña Lab del Axiom ( sliders ):</b> El objeto se usa como la masa colgante para determinar el potencial gravitatorio acumulado.</li>
                    <li><b>En el simulador de carreras espaciales de WALL-E ( tab 1 ):</b> La masa del objeto se suma al peso de Wall-E, variando el valor final de la aceleración ($a = F/m$) producida por los motores del extintor.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: HOLODETECTOR EXPERIMENT SANDBOX (Idea Salvaje 4 - Sliders) */}
            {currentTab === "laboratorio" && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Flame className="text-red-400" size={20} />
                    Laboratorio Holodetector del Axiom (Sliders)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Modula la gravedad del entorno y eleva la bota con la planta para acumular suficiente Energía Potencial Gravitacional ($E_p = m \cdot g \cdot h$) que active el dispositivo de retorno a casa.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column Controllers */}
                  <div className="space-y-4">
                    
                    {/* Active object mass display block */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 block">Elemento cargado como masa (m)</span>
                      <div className="flex justify-between items-center whitespace-nowrap">
                        <span className="font-black text-slate-200 text-sm flex items-center gap-1.5">
                          🎁 {equippedItem.name}
                        </span>
                        <span className="bg-indigo-950 border border-indigo-700 text-indigo-400 font-mono font-bold text-xs px-2.5 py-1 rounded">
                          {equippedItem.mass} kg
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-550 italic">
                        *Puedes cambiar de objeto libremente en la pestaña "2. Banco de Reciclaje".
                      </p>
                    </div>

                    {/* Height input slider (h) */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                      <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block flex justify-between">
                        <span>Altura de Elevación (h)</span>
                        <span className="text-indigo-400 font-bold">{sandboxHeight} metros</span>
                      </label>
                      <input 
                        type="range" 
                        min={1} 
                        max={50} 
                        step={1}
                        value={sandboxHeight} 
                        onChange={(e) => { setSandboxHeight(Number(e.target.value)); setSandboxResultTriggered(false); playSound("click"); }}
                        className="w-full accent-indigo-500 mt-2 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-600 mt-1 font-mono">
                        <span>1 md</span>
                        <span>25 md</span>
                        <span>50 md</span>
                      </div>
                    </div>

                    {/* Gravity selection preset pills (g) */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                      <label className="text-[11px] font-mono text-slate-440 uppercase tracking-widest block mb-2.5">
                        Gravedad Simulada (g): <b className="text-sky-400">{sandboxGravityLabel}</b>
                      </label>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => chooseGravityPreset(9.8, "Tierra (9.8 m/s²)")}
                          className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${sandboxGravity === 9.8 ? "bg-indigo-950 border-indigo-500 text-indigo-300" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
                        >
                          Tierra 🌍
                          <span className="block text-[9px] font-mono text-slate-500">9.8 m/s²</span>
                        </button>
                        <button
                          onClick={() => chooseGravityPreset(10.0, "Simulación Axiom (10 m/s²)")}
                          className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${sandboxGravity === 10.0 ? "bg-indigo-950 border-indigo-500 text-indigo-350" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
                        >
                          Axiom 🚢
                          <span className="block text-[9px] font-mono text-slate-500">10.0 m/s²</span>
                        </button>
                        <button
                          onClick={() => chooseGravityPreset(1.6, "Luna (1.6 m/s²)")}
                          className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${sandboxGravity === 1.6 ? "bg-indigo-950 border-indigo-500 text-indigo-350" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
                        >
                          Luna 🌙
                          <span className="block text-[9px] font-mono text-slate-500">1.6 m/s²</span>
                        </button>
                      </div>
                    </div>

                    {/* Submit test trigger button */}
                    <button
                      onClick={triggerHolodetectorTest}
                      className="w-full bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-502 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-md text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>ACTIVAR HOLODETECTOR 🌿</span>
                    </button>
                  </div>

                  {/* Right Column visual sandbox feedback graph */}
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 h-full space-y-4">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest block">Pantalla de Sensores de Energía</span>
                    
                    {/* Kinetic/Gravitational dynamic Elevator visual simulation */}
                    <div className="bg-slate-900 border border-slate-850 rounded-2xl h-44 relative overflow-hidden flex items-end">
                      
                      {/* Grid background lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#090d16_1px,transparent_1px),linear-gradient(to_bottom,#090d16_1px,transparent_1px)] bg-[size:14px_14px] opacity-40"></div>

                      {/* Moving Lift platform or cargo container */}
                      <div 
                        className="absolute w-full h-2 bg-slate-800 border-t border-indigo-500 transition-all duration-700 ease-out z-10"
                        style={{ bottom: `${(sandboxHeight / 50) * 100}%` }}
                      >
                        {/* Interactive cargo item model icon floating over elevator */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl flex flex-col items-center">
                          <span className={`${sandboxAnimationActive ? "animate-spin" : "animate-bounce"}`}>🌱</span>
                          <span className="text-[8px] bg-slate-950 text-sky-400 px-1.5 rounded uppercase font-mono border border-slate-800">
                            {equippedItem.name.substring(0, 10)}...
                          </span>
                        </div>
                      </div>

                      {/* Bottom axis indicator */}
                      <div className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-500">Base del Hangar (0 metros)</div>
                      <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-500">Sello de Emergencia (50 metros)</div>

                      {/* Active green holodetector threshold visual zone */}
                      <div className="absolute top-0 right-0 w-2.5 h-full bg-slate-900 border-l border-slate-800 flex flex-col justify-end">
                        <div className="bg-emerald-500/30 w-full rounded-t-lg" style={{ height: "40%" }}></div>
                      </div>
                    </div>

                    {/* Calculated real-time Energy result display block */}
                    <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-slate-400">Energía Potencial Gravitacional ($E_p$):</span>
                        <span className="text-xs font-bold font-mono text-slate-450">$m \cdot g \cdot h$</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 py-3 rounded-xl text-center">
                        <p className="text-xs text-slate-400 font-mono">
                          {equippedItem.mass} kg × {sandboxGravity} m/s² × {sandboxHeight} m =
                        </p>
                        <p className="text-2xl font-black text-indigo-400 tracking-tight font-mono mt-1">
                          {Number(equippedItem.mass * sandboxGravity * sandboxHeight).toFixed(1)} <span className="text-sm">Julios (J)</span>
                        </p>
                      </div>

                      {/* Threshold validator label advice */}
                      <div className="text-[11px] text-slate-400 leading-relaxed font-sans pt-1">
                        *Para activar el holodetector y dar inicio al código verde de rescate de la Tierra, requieres alcanzar una Energía mínima registrada de <b className="text-emerald-400">100 Julios</b>. Modula los sliders.
                      </div>

                      {sandboxResultTriggered && (
                        <div className={`p-2.5 rounded-xl text-center text-xs animate-bounce mt-2 ${
                          (equippedItem.mass * sandboxGravity * sandboxHeight) >= 100 
                            ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                            : "bg-red-950/40 border border-red-800 text-red-300"
                        }`}>
                          {(equippedItem.mass * sandboxGravity * sandboxHeight) >= 100 ? (
                            <span>🛡️ ¡SISTEMA OPERATIVO! Código Verde Activado en la Nave Axiom.</span>
                          ) : (
                            <span>❌ Sin energía suficiente. Intenta aumentar la Altura o cambiar de objeto.</span>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: IA SIDEKICK M-O CHATBOT (Idea Salvaje 2) */}
            {currentTab === "chat_mo" && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-lg font-extrabold text-slate-100 mb-1 flex items-center gap-1.5">
                    <Bot size={20} className="text-emerald-400" />
                    Idea Salvaje 2: Consultora de IA con M-O
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    M-O es sumamente obsesivo-compulsivo y escaneará tus malas ecuaciones o consultas de física en un instante. El error no se penaliza: ¡aprende y diviértete con este robot limpiador!
                  </p>
                </div>

                <MOChatbot 
                  currentTopic={activeMission?.questions[activeQuestionIndex]?.concept || "Leyes de Newton y Conservación de Energía Mecánica"}
                  selectedToolName={equippedItem.name}
                  onXpAwarded={awardXp}
                  unlockedMissions={student.unlockedMissions}
                />
              </div>
            )}

            {/* TAB 5: FORMULA COPIA CHEATSHEETS */}
            {currentTab === "formulas" && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Info size={20} className="text-indigo-400" />
                    Copia de Fórmulas y Conceptos Clave
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Repasa las leyes fundamentales de movimiento y trabajo antes de abordar las misiones del Axiom
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formulaStock.map((form) => (
                    <div key={form.topic} className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-2 hover:border-indigo-400 transition">
                      <h4 className="font-extrabold text-indigo-300 text-xs tracking-wide uppercase">{form.topic}</h4>
                      <p className="text-xl font-mono font-black text-sky-400 tracking-wider pt-1">{form.expression}</p>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{form.description}</p>
                      
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-850 mt-3 space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider font-bold">Significado de Símbolos:</span>
                        <div className="space-y-1">
                          {form.elements.map((el) => (
                            <div key={el.symbol} className="text-slate-400 text-xs font-mono">
                              <b className="text-sky-400">{el.symbol}:</b> {el.meaning}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Static Sidebar for Student's Achievements and Badges */}
          <div className="space-y-6">
            
            {/* Gamification Dashboard - Achievements (Logros Desbloqueables) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <h3 className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
                  <Trophy size={16} className="text-amber-500" />
                  Logros Desbloqueados
                </h3>
                <span className="bg-indigo-950 border border-indigo-700 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-mono font-black">
                  {student.achievements.length} / {achievementsList.length}
                </span>
              </div>

              <div className="space-y-3.5 max-h-[420px] overflow-y-auto scrollbar-none pr-1">
                {achievementsList.map((ach) => {
                  const isUnlocked = student.achievements.includes(ach.id);
                  return (
                    <div 
                      key={ach.id}
                      className={`p-3 rounded-2xl border transition ${
                        isUnlocked 
                          ? "bg-indigo-950/20 border-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.15)]" 
                          : "bg-slate-950/90 border-slate-900 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          isUnlocked ? "bg-indigo-900/50 text-indigo-400 border border-indigo-400" : "bg-slate-900 text-slate-600 border border-slate-800"
                        }`}>
                          {ach.iconName === "PlaneTakeoff" ? "🚀" :
                           ach.iconName === "Sparkles" ? "🧼" :
                           ach.iconName === "Trash" ? "🏗️" :
                           ach.iconName === "Leaf" ? "🌱" :
                           ach.iconName === "Bot" ? "🧹" : "📂"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className={`font-bold text-xs truncate ${isUnlocked ? "text-indigo-300" : "text-slate-450"}`}>
                              {ach.title}
                            </h4>
                            {isUnlocked && <Check size={12} className="text-emerald-400 shrink-0" />}
                          </div>
                          <p className="text-slate-400 text-[10px] leading-snug mt-0.5 line-clamp-2">{ach.description}</p>
                          
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[9px] font-mono text-slate-500">Criterio: {ach.criteria}</span>
                            <span className={`text-[9.5px] font-mono font-black ${isUnlocked ? "text-indigo-400" : "text-slate-600"}`}>
                              +{ach.xpValue} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar overall status */}
              <div className="pt-3 border-t border-slate-850 space-y-1.5 font-mono text-[11px] text-slate-450">
                <div className="flex justify-between text-[10px]">
                  <span>PUNTAJE INTEGRAL ACADÉMICO:</span>
                  <span className="text-indigo-400 font-bold">
                    {Math.round((student.achievements.length / achievementsList.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${(student.achievements.length / achievementsList.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Physics-Verse Guide Tips Card */}
            <div className="bg-gradient-to-tr from-slate-950 to-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3.5">
              <h4 className="font-extrabold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                Guía de Alivio de Estrés
              </h4>
              
              <div className="space-y-3 text-xs leading-relaxed text-slate-350">
                <p>
                  🚀 <b>Sin temor al error:</b> Los exámenes tradicionales penalizan; en cambio, en Física-Verse puedes responder infinitas veces. Si fallas, M-O te entrega una pista detallada.
                </p>
                <p>
                  🌱 <b>Ajuste Progresivo:</b> Equipa diferentes piezas del basurero de Wall-E en la pestaña <i>"2. Banco de Reciclaje"</i> para observar experimentalmente cómo aumenta o disminuye la inercia gravitatoria.
                </p>
                <p>
                  🤖 <b>M-O Chat gratis:</b> Si no entiendes un concepto de física de décimo, escribe tu pregunta directo en el chat. Responderá con humor robótico para guiarte en tu proyecto de vida.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Humble professional design footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 py-10 text-center space-y-2 relative z-10 backdrop-blur-sm">
        <p className="text-xs text-slate-500 font-mono tracking-wider">
          FÍSICA-VERSE • EL CAMPO DE ENTRENAMIENTO MULTIVERSAL DE DÉCIMO GRADO
        </p>
        <p className="text-[11px] text-slate-600">
          Diseñado para mitigar la ansiedad académica y promover la experimentación divertida • Hecho por David Morales & Yenni Niño
        </p>
      </footer>
      </div> {/* Closing relative z-10 content container wrapper */}
    </div>
  );
}
