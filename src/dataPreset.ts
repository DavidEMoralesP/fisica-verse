import { SpatialMission, RecycledItem, Achievement, PhysicsFormula } from "./types";

export const formulaStock: PhysicsFormula[] = [
  {
    topic: "Primera Ley de Newton (Inercia)",
    expression: "∑F = 0",
    description: "Un cuerpo permanece en reposo o en movimiento rectilíneo uniforme a menos que una fuerza neta externa actúe sobre él.",
    elements: [
      { symbol: "F", meaning: "Fuerza neta aplicada (Newtons)" }
    ]
  },
  {
    topic: "Segunda Ley de Newton (Dinámica)",
    expression: "F = m · a",
    description: "La aceleración de un cuerpo es directamente proporcional a la fuerza neta aplicada e inversamente proporcional a su masa.",
    elements: [
      { symbol: "F", meaning: "Fuerza neta (N)" },
      { symbol: "m", meaning: "Masa del cuerpo (kg)" },
      { symbol: "a", meaning: "Aceleración obtenida (m/s²)" }
    ]
  },
  {
    topic: "Tercera Ley de Newton (Acción-Reacción)",
    expression: "F_A_B = -F_B_A",
    description: "Siempre que un objeto ejerce una fuerza sobre un segundo objeto, este ejerce una fuerza de igual magnitud pero en sentido opuesto.",
    elements: [
      { symbol: "F_A_B", meaning: "Fuerza ejercida por el objeto A sobre el objeto B" },
      { symbol: "F_B_A", meaning: "Fuerza de reacción del objeto B sobre el objeto A" }
    ]
  },
  {
    topic: "Energía Potencial Gravitatoria",
    expression: "E_p = m · g · h",
    description: "Es la energía que posee un cuerpo debido a su posición en un campo gravitatorio.",
    elements: [
      { symbol: "m", meaning: "Masa del cuerpo (kg)" },
      { symbol: "g", meaning: "Gravedad de la Tierra (aprox. 9.8 m/s²)" },
      { symbol: "h", meaning: "Altura respecto a un punto de referencia (m)" }
    ]
  },
  {
    topic: "Energía Cinética",
    expression: "E_c = (1/2) · m · v²",
    description: "Es la energía asociada al movimiento de un cuerpo que viaja a una rapidez determinada.",
    elements: [
      { symbol: "m", meaning: "Masa del cuerpo (kg)" },
      { symbol: "v", meaning: "Velocidad constante (m/s)" }
    ]
  },
  {
    topic: "Trabajo Mecánico",
    expression: "W = F · d",
    description: "Cantidad de energía transferida cuando una fuerza constante desplaza un objeto a lo largo de una distancia en su misma dirección.",
    elements: [
      { symbol: "F", meaning: "Fuerza aplicada en la dirección del movimiento (N)" },
      { symbol: "d", meaning: "Distancia de desplazamiento (m)" }
    ]
  }
];

export const recycledItemsRepo: RecycledItem[] = [
  {
    id: "item_bota_planta",
    name: "La Planta en la Bota",
    description: "La valiosa bota de cuero que contiene la pequeña planta sobreviviente. Tiene un valor simbólico gigante pero masa física estándar.",
    mass: 0.8,
    specialProperty: "Absorbe luz y CO2 para reducir la suciedad del aire.",
    physicsTopic: "Cálculo de peso y fuerza gravitacional (W = m·g)",
    iconName: "Compass"
  },
  {
    id: "item_extintor_propulsion",
    name: "Extintor de CO2",
    description: "Un extintor común cargado de dióxido de carbono comprimido. Excelente para bailar en el espacio siguiendo la Tercera Ley de Newton.",
    mass: 6.0,
    specialProperty: "Genera propulsión mediante escape de gas a presión constante.",
    physicsTopic: "Fuerza de empuje, acción y reacción, momentos.",
    iconName: "Flame"
  },
  {
    id: "item_cubo_basura",
    name: "Bloque Basura Compacta",
    description: "Un cubo de desechos sólidos que Wall-E comprimió a alta presión. Muy pesado e ideal para simular masa e inercia.",
    mass: 45.0,
    specialProperty: "Gran inercia; resiste fuertemente los cambios en su estado de movimiento.",
    physicsTopic: "Segunda Ley de Newton (Inercia de alta masa, F=m·a)",
    iconName: "Box"
  },
  {
    id: "item_cinta_hello_dolly",
    name: "Cinta de Video Magnética",
    description: "Película vieja en formato VHS preferida de Wall-E. Conserva música romántica del siglo XX.",
    mass: 0.2,
    specialProperty: "Baja masa, muy sensible a cualquier fuerza por pequeña que sea.",
    physicsTopic: "Energía y ondas de sonido.",
    iconName: "Film"
  },
  {
    id: "item_cubo_rubik",
    name: "Cubo Rompecabezas vintage",
    description: "Un objeto tridimensional de plástico de 3x3x3. Wall-E no sabe solucionarlo del todo rápido, pero le encanta guardarlo.",
    mass: 0.1,
    specialProperty: "Fricción estática casi nula sobre superficies pulidas.",
    physicsTopic: "Fuerzas mecánicas básicas y coeficientes de rozamiento.",
    iconName: "Grid"
  },
  {
    id: "item_cubierto_spork",
    name: "Cuchara-Tenedor Metálico",
    description: "Una de las mayores joyas de la colección de Wall-E: confuso artilugio que no encaja ni en cuchara ni en tenedor.",
    mass: 0.05,
    specialProperty: "Puede actuar como una palanca rígida de primer género.",
    physicsTopic: "Dinámica rotacional simple y equilibrio de momentos.",
    iconName: "Scissors"
  },
  {
    id: "item_bateria_portatil",
    name: "Batería de Carga Axiom",
    description: "Un condensador de electrones desechado que aún almacena energía para alimentar pantallas inteligentes.",
    mass: 1.5,
    specialProperty: "Almacena energía potencial eléctrica disponible para transformación.",
    physicsTopic: "Conservación de la energía y potencia mecánica.",
    iconName: "Battery"
  },
  {
    id: "item_rueda_hal",
    name: "Rueda Neumática Rodante",
    description: "Extraída de un carro de limpieza roto. Su caucho estriado da un magnífico agarre.",
    mass: 3.2,
    specialProperty: "Alto coeficiente de fricción cinética (μk = 0.6) sobre acero.",
    physicsTopic: "Fricción de rodadura y fuerza de rozamiento (F_f = μ·N)",
    iconName: "Settings"
  }
];

export const achievementsList: Achievement[] = [
  {
    id: "ach_primera_mision",
    title: "Primer Vuelo en el Axiom",
    description: "Resuelve con éxito el primer problema de física en el espacio exterior.",
    criteria: "Responder correctamente una pregunta de la zona de carrera espacial.",
    iconName: "PlaneTakeoff",
    xpValue: 150
  },
  {
    id: "ach_sin_errores",
    title: "Limpieza Impecable de Contaminantes",
    description: "Resuelve una misión completa de la zona de práctica sin perder ninguna vida extra.",
    criteria: "Responder 3 preguntas consecutivas de forma correcta.",
    iconName: "Sparkles",
    xpValue: 200
  },
  {
    id: "ach_maestro_reciclaje",
    title: "Ingeniero de Tierra Firme",
    description: "Completa todos los desafíos físicos en la Planta de Reciclaje de la Tierra.",
    criteria: "Completar la misión 'Planta de Reciclaje' superando sus incógnitas.",
    iconName: "Trash",
    xpValue: 250
  },
  {
    id: "ach_salvador_tierra",
    title: "Activador del Código Verde",
    description: "Introduce la planta en el holodetector superando los conceptos más avanzados de Trabajo y Potencia.",
    criteria: "Completar la misión 'Axiom Lab' y salvar la humanidad.",
    iconName: "Leaf",
    xpValue: 300
  },
  {
    id: "ach_coleccionista_banco",
    title: "Archivista del Desecho",
    description: "Desbloquea o recolecta 6 elementos únicos del banco de objetos reciclables de Wall-E.",
    criteria: "Inspeccionar las características físicas de la basura compactada en detalle.",
    iconName: "Archive",
    xpValue: 100
  },
  {
    id: "ach_mo_amigo",
    title: "Inocuidad Certificada",
    description: "Realiza tu primera consulta de limpieza al robot M-O en el canal de Inteligencia Artificial.",
    criteria: "Enviar un mensaje al chat M-O para recibir retroalimentación cariñosa.",
    iconName: "Bot",
    xpValue: 100
  }
];

export const spatialMissionsPreset: SpatialMission[] = [
  {
    id: "mis_reciclaje_tierra",
    title: "Planta de Reciclaje (Misión Tierra)",
    location: "Tierra Planta de Reciclaje",
    description: "Explora la superficie terrestre y ayuda a Wall-E a clasificar piezas pesadas usando masa, inercia, peso y gravedad.",
    difficulty: "Bajo",
    xpReward: 300,
    unlockedAtXp: 0,
    iconName: "Trash",
    simulationType: "recycle-scale",
    questions: [
      {
        id: "q_rec_weight",
        missionId: "mis_reciclaje_tierra",
        concept: "Gravedad e Impulso en la Tierra Abandonada",
        narrative: "Wall-E resguarda una bota con una pequeña planta. Si la bota tiene una masa de 0.5 kg y la aceleración de la gravedad terrestre es de 9.8 m/s² aproximadamente, ¿cuál es el peso real ejercido sobre esta bota de cuero?",
        questionText: "¿Cuánto peso medirá en Newtons el sensor de la bota de Wall-E?",
        options: ["0.5 Newtons", "4.9 Newtons", "9.8 Newtons", "2.45 Newtons"],
        correctAnswerIndex: 1, // 4.9 N
        hint: "El peso es el producto directo de la masa por la aceleración de la gravedad (W = m · g). Toma m = 0.5 kg y g = 9.8 m/s².",
        explanation: "¡Correcto! Peso = masa × gravedad. 0.5 kg × 9.8 m/s² es igual a 4.9 Newtons. Esta pequeña fuerza mantiene a la amada planta unida a la biosfera."
      },
      {
        id: "q_rec_inertia",
        missionId: "mis_reciclaje_tierra",
        concept: "Primera Ley de Newton: Ley de la Inercia",
        narrative: "Wall-E tiene apilados cubos gigantes de basura compactada de 45 kg en reposo absoluto. Él intenta empujar un bloque pero no se mueve. ¿Por qué ocurre esto físicamente?",
        questionText: "De acuerdo con la Primera Ley de Newton, ¿qué mantiene al cubo de basura compactada estático hasta que Wall-E aplique una fuerza suficiente?",
        options: [
          "Su inercia intrínseca, que se resiste a cambiar el estado de reposo.",
          "La gravedad en el vacío que anula el movimiento rotatorio.",
          "La ausencia del aire que crea fricción magnética ascendente.",
          "Que los cubos no tienen energía potencial interna almacenada."
        ],
        correctAnswerIndex: 0,
        hint: "La Primera Ley o Inercia nos dice que un cuerpo tiende a conservar su estado original (reposo o velocidad constante) a menos que actúe una fuerza neta descompensada.",
        explanation: "¡Correcto! La inercia de la masa del bloque (45 kg) impulsa la resistencia natural de cualquier objeto de cambiar su estado actual, obligando a Wall-E a empujar con fuerza para romper la fricción y ponerlo en movimiento."
      },
      {
        id: "q_rec_kinetic",
        missionId: "mis_reciclaje_tierra",
        concept: "Energía Cinética en la Cinta de Basura",
        narrative: "Un bloque pesado de metal reciclado de 10 kg se desplaza sobre una cinta transportadora a una velocidad constante de 2 m/s. El computador del Axiom te pide estimar su Energía Cinética.",
        questionText: "¿Cuál es el valor exacto de la Energía Cinética de este bloque de metal?",
        options: ["10 Julios", "20 Julios", "40 Julios", "5 Julios"],
        correctAnswerIndex: 1, // Ec = 0.5 * 10 * 4 = 20 J
        hint: "Usa la fórmula clásica de la Energía Cinética: Ec = (1/2) · m · v². Reemplaza m = 10 y v = 2.",
        explanation: "¡Impecable! Ec = 0.5 × 10 kg × (2 m/s)² = 0.5 × 10 × 4 = 20 Julios. Esta es la energía contenida por la velocidad del material."
      }
    ]
  },
  {
    id: "mis_carrera_espacial",
    title: "Carreras Espaciales (CO2 Jet Stream)",
    location: "Espacio Exterior",
    description: "Conecta la propulsión del extintor de Wall-E y la agilidad de EVE. Resuelve problemas cinéticos y de propulsión para salvar la trayectoria de vuelo.",
    difficulty: "Medio",
    xpReward: 400,
    unlockedAtXp: 150,
    iconName: "PlaneTakeoff",
    simulationType: "propulsion",
    questions: [
      {
        id: "q_space_newton3",
        missionId: "mis_carrera_espacial",
        concept: "Tercera Ley de Newton (Acción y Reacción)",
        narrative: "En el espacio exterior, Wall-E baila alrededor de EVE usando un extintor de gas. Al presionar el gatillo, el gas de CO2 sale disparado en una dirección y Wall-E sale propulsado con la exacta misma fuerza en dirección contraria.",
        questionText: "¿Qué ley física describe el mecanismo de propulsión por el escape de gas del extintor?",
        options: [
          "Segunda Ley de Newton (la masa varía con el calor).",
          "Tercera Ley de Newton: Acción y Reacción.",
          "La Ley de Gravitación Universal de Einstein.",
          "Primera Ley de Newton (la masa en el vacío no se propulsa sino que flota)."
        ],
        correctAnswerIndex: 1,
        hint: "A cada fuerza de acción corresponde siempre otra fuerza de reacción igual en magnitud y dirección, pero opuesta en sentido.",
        explanation: "¡Perfecto! El empuje generado hacia atrás por el CO2 expulsado ejerce una fuerza idéntica hacia adelante sobre Wall-E. ¡Es la Tercera Ley de Newton en acción!"
      },
      {
        id: "q_space_accel",
        missionId: "mis_carrera_espacial",
        concept: "Segunda Ley de Newton (F = m·a)",
        narrative: "La masa total de Wall-E con el extintor es de 120 kg. Si el extintor expulsa gas de CO2 generando una fuerza horizontal neta constante de 60 N en el vacío absoluto, ¿con qué aceleración se moverá?",
        questionText: "Determina la aceleración lineal de Wall-E en el espacio:",
        options: ["2.0 m/s²", "0.5 m/s²", "12.0 m/s²", "72.0 m/s²"],
        correctAnswerIndex: 1, // a = F/m = 60/120 = 0.5
        hint: "Aplica la Segunda Ley: F = m · a, por lo tanto la aceleración es a = Fuerza / Masa. Divide 60 entre 120.",
        explanation: "¡Excepcional! Aceleración = Fuerza / Masa. 60 N / 120 kg = 0.5 m/s². Wall-E ganará exactamente 0.5 m/s en velocidad cada segundo de propulsión continua."
      },
      {
        id: "q_space_inertia_val",
        missionId: "mis_carrera_espacial",
        concept: "Inercia en el Espacio Vacío",
        narrative: "Wall-E apaga el extintor y deja de expulsar gas. En ese instante, su velocidad es de 5 m/s. Dado que en el vacío estelar profundo no hay atmósfera ni gravedad apreciable para frenarlo, ¿cuál será su movimiento?",
        questionText: "¿Qué sucederá con la velocidad y movimiento de Wall-E tras apagar el extintor?",
        options: [
          "Bajaría a velocidad cero instantáneamente por la inercia cósmica.",
          "Dará vueltas en círculo de forma natural debido a su propia órbita magnética.",
          "Seguirá moviéndose indefinidamente a una velocidad constante de 5 m/s en línea recta.",
          "Se desacelerará paulatinamente hasta frenarse del todo en unos 10 segundos."
        ],
        correctAnswerIndex: 2,
        hint: "Recuerda la Primera Ley de Newton: todo cuerpo continuará moviéndose a velocidad constante en ausencia de fuerzas netas externas que actúen sobre él.",
        explanation: "¡Excelente! Al no haber fricción de aire ni otra fuerza neta descompensada que lo frene, Wall-E continuará viajando indefinidamente en línea recta a 5 m/s constantes."
      }
    ]
  },
  {
    id: "mis_axiom_hangar",
    title: "Laboratorio Espacial en el Axiom (Examen Final)",
    location: "Axiom",
    description: "Ayuda al Capitán McCrea a devolver a la humanidad a su hogar. Asegura los parámetros de energía potencial y trabajo en el holodetector principal de la nave.",
    difficulty: "Alto",
    xpReward: 600,
    unlockedAtXp: 350,
    iconName: "Leaf",
    simulationType: "axiom-elevator",
    questions: [
      {
        id: "q_pot_energy",
        missionId: "mis_axiom_hangar",
        concept: "Energía Potencial Gravitacional en el Axiom",
        narrative: "Para activar el holodetector, la bota con la planta de masa de 0.8 kg debe ser elevada a una plataforma especial a una altura de 10 metros del suelo. Asumiendo la gravedad simulada del Axiom de 10 m/s² para simplificar, ¿cuánta Energía Potencial acumula la bota?",
        questionText: "¿Cuál es el valor exacto de la Energía Potencial Gravitacional?",
        options: ["8 Julios", "80 Julios", "0.8 Julios", "800 Julios"],
        correctAnswerIndex: 1, // Ep = m * g * h = 0.8 * 10 * 10 = 80 J
        hint: "Usa la fórmula Ep = m · g · h. Multiplica la masa (0.8 kg) por la gravedad (10 m/s²) y luego por la altura (10 m).",
        explanation: "¡Correcto! Ep = 0.8 kg × 10 m/s² × 10 m = 80 Julios. Esta es la energía potencial almacenada y lista para ser liberada."
      },
      {
        id: "q_axiom_work",
        missionId: "mis_axiom_hangar",
        concept: "Trabajo Mecánico de la Silla Flotante",
        narrative: "Para trasladar a un obeso ciudadano del Axiom, la silla voladora ejerce una fuerza de empuje constante de 150 Newtons en dirección horizontal para trasladar al pasajero por toda una rampa recta de 200 metros de longitud.",
        questionText: "¿Cuánto trabajo mecánico realiza el motor de la silla voladora?",
        options: [
          "30,000 Julios (30 kJ)",
          "1.33 Julios",
          "350 Julios",
          "7.5 Julios"
        ],
        correctAnswerIndex: 0, // W = F * d = 150 * 200 = 30000 J
        hint: "El trabajo se calcula multiplicando la fuerza ejercida en la dirección del desplazamiento por la distancia recorrida: W = F · d.",
        explanation: "¡Impresionante! W = 150 N × 200 m = 30,000 Julios (o 30 Kilojulios). Trabajo significa transferencia real de energía mecánica."
      },
      {
        id: "q_conservation",
        missionId: "mis_axiom_hangar",
        concept: "Conservación de la Energía Mecánica",
        narrative: "Wall-E cae accidentalmente desde el techo interior del Axiom. Al inicio de su caída, tiene 1000 Julios de Energía Potencial Gravitacional completa y cero Energía Cinética. Cuando ha caído hasta la mitad de la altura total y despreciando la resistencia del aire, ¿qué energías posee en ese punto intermedio?",
        questionText: "Por conservación de la energía mecánica, a la mitad del camino su balance es:",
        options: [
          "1000 J de potencial y 1000 J de cinética.",
          "0 J de potencial y 1000 J de cinética.",
          "500 J de potencial y 500 J de cinética.",
          "500 J de potencial y 0 J de cinética."
        ],
        correctAnswerIndex: 2,
        hint: "La Energía Mecánica Total (Et = Ep + Ec) debe ser siempre conservada y dar igual a 1000 J. Si cae a la mitad de la altura, su energía potencial disminuye por la mitad.",
        explanation: "¡Perfecto! Al estar a la mitad de la altura, la mitad de la energía potencial (500 J) se ha transformado en energía cinética de movimiento (500 J), manteniendo la suma total inmutable en 1000 Julios de energía interna."
      }
    ]
  }
];
