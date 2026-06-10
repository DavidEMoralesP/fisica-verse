import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Trash2, HelpCircle, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface MOChatbotProps {
  currentTopic?: string;
  selectedToolName?: string;
  onCheatSheetRequested?: (topic: string) => void;
  onXpAwarded?: (xp: number, label: string) => void;
  unlockedMissions: string[];
}

export default function MOChatbot({
  currentTopic = "Mecánica general y Leyes de Movimiento",
  selectedToolName,
  onCheatSheetRequested,
  onXpAwarded,
  unlockedMissions,
}: MOChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "mo_welcome",
      role: "model",
      text: "💥 ¡ALERTA DE CONTAMINANTE! 🔍 Escaneando entorno... ¡Ufff! Detecto un 87% de partículas de confusión de física por aquí. ¡Hola! Soy el robot limpiador M-O (Microbe-Obliterator). Estoy asignado para barrer todas tus dudas físicas sobre las leyes del movimiento y energía. ¿Tienes una fórmula sucia flotando en el cerebro? ¡Pregúntame o selecciona un tema sugerido para pasarle la aspiradora de la lucidez!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [moMood, setMoMood] = useState<"clean" | "scanning" | "happy" | "alert">("clean");
  const [errorText, setErrorText] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorText(null);
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setMoMood("scanning");

    try {
      // Map state-history to server request
      const requestHistory = messages.filter(m => m.id !== "mo_welcome").map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const res = await fetch("/api/chat/mo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: requestHistory,
          currentTopic: currentTopic,
          selectedTool: selectedToolName || "Ninguno",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al comunicarse con el servidor");
      }

      const data = await res.json();

      const modelMsg: ChatMessage = {
        id: `mo_${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
      setMoMood("happy");

      // Give a tiny interaction XP if it's the first chat message of the session
      if (messages.length === 1 && onXpAwarded) {
        onXpAwarded(50, "Primera consulta a M-O");
      }

      // Revert mood to default after a small timeout
      setTimeout(() => setMoMood("clean"), 5000);
    } catch (error: any) {
      console.error("Error chatbot backend:", error);
      setErrorText(error.message || "Error al conectar con M-O. Asegura tu GEMINI_API_KEY.");
      setMoMood("alert");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = (query: string) => {
    sendMessage(query);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "mo_welcome",
        role: "model",
        text: "🧼 ¡Mesa de trabajo esterilizada! M-O ha limpiado el historial para remover el polvo estelar acumulado. Iniciando escáner de nuevo... listo. ¡Dime qué limpiamos hoy!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorText(null);
    setMoMood("clean");
  };

  // Robot virtual face animations & expressions
  const renderMoface = () => {
    switch (moMood) {
      case "scanning":
        return (
          <div className="relative w-16 h-16 bg-slate-800 border-2 border-emerald-500 rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-bounce"></div>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping delay-75"></span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 mt-2 tracking-widest">SCANNING</span>
          </div>
        );
      case "happy":
        return (
          <div className="w-16 h-16 bg-slate-800 border-2 border-cyan-400 rounded-xl flex flex-col items-center justify-center p-1 shadow-[0_0_15px_rgba(34,211,238,0.3)] duration-300">
            <div className="flex justify-around w-full px-2 mt-1">
              <span className="w-3.5 h-3 bg-cyan-400 rounded-t-full rounded-r-full rotate-12"></span>
              <span className="w-3.5 h-3 bg-cyan-400 rounded-t-full rounded-l-full -rotate-12"></span>
            </div>
            <div className="w-6 h-1.5 bg-cyan-400 rounded-full mt-2 animate-bounce"></div>
            <span className="text-[8px] font-mono text-cyan-300 mt-1">BRIGHT</span>
          </div>
        );
      case "alert":
        return (
          <div className="w-16 h-16 bg-red-950 border-2 border-red-500 rounded-xl flex flex-col items-center justify-center p-1 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-bounce">
            <div className="flex justify-around w-full px-2">
              <span className="w-4 h-1 bg-red-400 rotate-12"></span>
              <span className="w-4 h-1 bg-red-400 -rotate-12"></span>
            </div>
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mt-2">
              <span className="text-white text-[9px] font-bold">!</span>
            </div>
            <span className="text-[8px] font-mono text-red-400 mt-1">ERROR</span>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-slate-800 border-2 border-sky-500 rounded-xl flex flex-col items-center justify-center p-1 shadow-[0_0_12px_rgba(14,165,233,0.15)] hover:border-sky-400 cursor-pointer transition">
            <div className="flex justify-around w-full px-2">
              <span className="w-3.5 h-1.5 bg-sky-400 rounded-full"></span>
              <span className="w-3.5 h-1.5 bg-sky-400 rounded-full"></span>
            </div>
            <div className="w-8 h-1 bg-sky-400 rounded-full mt-3"></div>
            <span className="text-[8px] font-mono text-sky-400 mt-1.5">M-O READY</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[520px] shadow-2xl">
      {/* Bot Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {renderMoface()}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-100 text-sm">IA Sidekick: M-O Limpiador</h3>
              <span className="bg-slate-800 text-[10px] text-sky-400 px-1.5 py-0.5 rounded font-mono border border-sky-900">v1.2</span>
            </div>
            <p className="text-xs text-sky-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Detector de polvo conceptual activo
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          title="Borrar chat"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-slate-950 font-sans text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="text-[10px] text-slate-500 mb-1 px-1">
              {msg.role === "user" ? "Tú" : "M-O"} • {msg.timestamp}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed break-words shadow-md ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
              }`}
            >
              {msg.text.split("\n").map((para, i) => (
                <p key={i} className={i !== 0 ? "mt-1.5" : ""}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-1">
            <div className="bg-slate-800 text-slate-300 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700 flex items-center gap-2">
              <Loader2 className="animate-spin text-emerald-400" size={16} />
              <span className="text-xs font-mono text-emerald-400 tracking-wide animate-pulse">M-O ESTÁ ESCANEANDO TU CONFUSIÓN...</span>
            </div>
          </div>
        )}

        {errorText && (
          <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-200 text-xs flex gap-2">
            <AlertCircle className="text-red-400 shrink-0" size={16} />
            <div>
              <p className="font-semibold text-red-300">Falta API Key de Gemini: o error de red</p>
              <p className="mt-0.5 text-red-400">{errorText}</p>
              <p className="mt-1.5 text-[10px] text-slate-400 font-mono">Ve al botón superior <b>Settings &gt; Secrets</b>, añade una variable <b>GEMINI_API_KEY</b> con tu API Key provista por Google AI Studio ¡y listo!</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Recommended Topics / Quick Prompts */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
        <button
          onClick={() => handleSuggest("M-O, ¿qué nos dice la Primera Ley de Newton o Inercia de forma simple?")}
          className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          🧹 ¿Qué es la Inercia?
        </button>
        <button
          onClick={() => handleSuggest("M-O, explícame la fórmula de Fuerza F = m * a con un ejemplo de Wall-E compactando bloques")}
          className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          📦 Fila de fuerza F = m · a
        </button>
        <button
          onClick={() => handleSuggest("¿Cómo funciona el extintor de Wall-E en el espacio según la Tercera Ley de Newton?")}
          className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          🚀 Extintor Acción-Reacción
        </button>
        <button
          onClick={() => handleSuggest("Explícame la diferencia entre Energía Cinética y Energía Potencial Gravitacional con el Axiom de fondo")}
          className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          ⚡ Energía Cinética vs Potencial
        </button>
        <button
          onClick={() => handleSuggest("M-O, dame un dato curioso o chiste de la película Wall-E relacionado con la física")}
          className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          🤖 Chiste de Robot
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputText);
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Escribe una duda de física (Ej. tema: ${selectedToolName || currentTopic})...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          disabled={isLoading || !inputText.trim()}
        >
          <span>Enviar</span>
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
