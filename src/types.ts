export interface StudentState {
  xp: number;
  level: number;
  lives: number; // starts at 3
  achievements: string[]; // unlocked achievement IDs
  unlockedMissions: string[]; // unlocked mission IDs
  collectedItems: string[]; // recycled items collected
  scoreHistory: { [key: string]: boolean }; // tracks whether questions are answered correctly
}

export interface RecycledItem {
  id: string;
  name: string;
  description: string;
  mass: number; // in kg
  specialProperty: string;
  physicsTopic: string;
  iconName: string; // for rendering
}

export interface PhysicsFormula {
  topic: string;
  expression: string;
  description: string;
  elements: { symbol: string; meaning: string }[];
}

export interface PhysicsQuestion {
  id: string;
  missionId: string;
  concept: string; // e.g., "1ra Ley de Newton", "Energía Cinética"
  narrative: string; // Wall-E themed text
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  hint: string;
  explanation: string;
}

export interface SpatialMission {
  id: string;
  title: string;
  location: "Axiom" | "Tierra Planta de Reciclaje" | "Espacio Exterior";
  description: string;
  difficulty: "Bajo" | "Medio" | "Alto";
  xpReward: number;
  unlockedAtXp: number;
  iconName: string;
  questions: PhysicsQuestion[];
  simulationType: "propulsion" | "recycle-scale" | "axiom-elevator";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  criteria: string;
  iconName: string;
  xpValue: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
