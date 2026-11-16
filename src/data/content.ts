/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENIDO DEL PORTAFOLIO (bilingüe)
 *  Edita aquí proyectos, trayectoria, habilidades y testimonios.
 *  Cada texto tiene su versión { es: '...', en: '...' }.
 * ─────────────────────────────────────────────────────────────
 */
import type { L, LList } from '../i18n/I18nProvider'

/* ───────────── Datos personales ───────────── */
export const EMAIL = 'edgar20arteaga06@gmail.com'
export const GITHUB_URL = 'https://github.com/EdedArt'
/** Pega aquí tu perfil de LinkedIn. Si queda vacío, el ícono se oculta. */
export const LINKEDIN_URL = 'https://www.linkedin.com/in/edgar-arteaga-267606368/'
export const CV_URL = '/CV_Edgar_Arteaga.pdf'
export const COORDS = '1.21° N · 77.28° W'
export const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`
export const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${EMAIL}`

/* ───────────── Cinta de tecnologías (hero) ───────────── */
export const marquee = [
  'JavaScript',
  'TypeScript',
  'React',
  'React Native',
  'Expo',
  'Electron',
  'Next.js',
  'Node.js',
  'Express',
  'NestJS',
  'PostgreSQL',
  'Python',
  'Django',
  'Java',
  'Unity',
  'C#',
  'Monkey C',
  'Connect IQ',
  'Google Gemini',
  'Tailwind CSS',
  'Git',
]

/* ───────────── Herramientas (Sobre mí) ───────────── */
export interface Tool {
  name: string
  category: L
  /** Dónde la he usado */
  usedIn: L
}

const tool = (category: L, name: string, usedIn: L): Tool => ({ name, category, usedIn })
const COURSES: L = { es: 'Proyectos de la carrera', en: 'University projects' }

export const tools: Tool[] = [
  tool({ es: 'Core', en: 'Core' }, 'JavaScript / TypeScript', { es: 'PodcastCraft AI, AutoClean AI y este portafolio', en: 'PodcastCraft AI, AutoClean AI and this portfolio' }),
  tool({ es: 'Frontend', en: 'Frontend' }, 'React + Next.js', { es: 'Pasión Nariño y este portafolio', en: 'Pasión Nariño and this portfolio' }),
  tool({ es: 'Móvil', en: 'Mobile' }, 'React Native + Expo', { es: 'AutoClean AI', en: 'AutoClean AI' }),
  tool({ es: 'Escritorio', en: 'Desktop' }, 'Electron', { es: 'PodcastCraft AI', en: 'PodcastCraft AI' }),
  tool({ es: 'Backend', en: 'Backend' }, 'Node.js + Express', { es: 'AutoClean AI y PodcastCraft AI', en: 'AutoClean AI and PodcastCraft AI' }),
  tool({ es: 'Backend', en: 'Backend' }, 'NestJS', { es: 'PetCare', en: 'PetCare' }),
  tool({ es: 'Datos', en: 'Data' }, 'PostgreSQL', { es: 'PetCare', en: 'PetCare' }),
  tool({ es: 'Datos', en: 'Data' }, 'Prisma + SQLite', { es: 'AutoClean AI', en: 'AutoClean AI' }),
  tool({ es: 'Lenguaje', en: 'Language' }, 'Java', COURSES),
  tool({ es: 'Backend', en: 'Backend' }, 'Python + Django', COURSES),
  tool({ es: 'Juegos', en: 'Games' }, 'Unity + C#', { es: 'Plomo y Paja', en: 'Plomo y Paja' }),
  tool({ es: 'Wearables', en: 'Wearables' }, 'Monkey C / Connect IQ', { es: 'ElderGuard AI', en: 'ElderGuard AI' }),
  tool({ es: 'IA', en: 'AI' }, 'Google Gemini API', { es: 'PodcastCraft, AutoClean y ElderGuard', en: 'PodcastCraft, AutoClean and ElderGuard' }),
  tool({ es: 'IA', en: 'AI' }, 'OpenAI API', { es: 'Plomo y Paja', en: 'Plomo y Paja' }),
  tool({ es: 'UI', en: 'UI' }, 'Tailwind CSS', { es: 'PodcastCraft AI y este portafolio', en: 'PodcastCraft AI and this portfolio' }),
  tool({ es: 'Entrega', en: 'Delivery' }, 'Git + GitHub', { es: 'Todos mis proyectos', en: 'All my projects' }),
]

/* ───────────── Proyectos ───────────── */
export type Platform = 'desktop' | 'mobile' | 'watch' | 'game'

export interface ProjectLink {
  label?: L
  url: string
}

export interface Project {
  id: string
  name: string
  platform: Platform
  platformLabel: L
  /** Requisitos / sistema compatible */
  requirements: L
  tagline: L
  description: L
  features: LList
  role: L
  team?: L
  tech: string[]
  installer: {
    file: string
    size?: L
    version?: string
    steps: LList
  }
  downloadUrl: string
  codeUrl: string
  extraCode?: ProjectLink[]
  /** Opcional: video real del proyecto (URL de YouTube embed o archivo .mp4 en /public) */
  video?: string
  /** Opcional: capturas reales (rutas en /public, p. ej. '/proyectos/podcast-1.png'); aparecen en la galería del modal */
  images?: { src: string; alt: L; width: number; height: number }[]
  /** 'phones': la galería muestra las capturas en una fila de teléfonos */
  galleryLayout?: 'wide' | 'phones'
}

export const projects: Project[] = [
  {
    id: 'podcastcraft',
    name: 'PodcastCraft AI',
    platform: 'desktop',
    platformLabel: { es: 'Escritorio', en: 'Desktop' },
    requirements: { es: 'Windows 10/11 (64 bits)', en: 'Windows 10/11 (64-bit)' },
    tagline: {
      es: 'Editor de audio y podcasts con IA para Windows.',
      en: 'AI-powered audio and podcast editor for Windows.',
    },
    description: {
      es: 'Aplicación de escritorio para editar audios MP3: importas el audio, lo cortas, subes o bajas el volumen de cada carril, agregas o eliminas partes y exportas el resultado en MP3. Trae un asistente con Google Gemini que transcribe y sugiere cortes.',
      en: 'Desktop app for editing MP3 audio: import the audio, cut it, raise or lower the volume of each track, add or remove parts and export the result as MP3. It includes a Google Gemini assistant that transcribes and suggests cuts.',
    },
    features: {
      es: [
        'Línea de tiempo multipista con edición no destructiva.',
        'Cortar con S, reproducir con Espacio y zoom en la forma de onda.',
        'Volumen por carril de 0 % a 200 %.',
        'Exportación real a MP3 con FFmpeg.',
        'Asistente de IA con Gemini: transcripción y sugerencias de corte.',
        'Inicio de sesión local con varias cuentas y código de recuperación.',
        'Español/inglés y tema claro/oscuro.',
      ],
      en: [
        'Multitrack timeline with non-destructive editing.',
        'Cut with S, play with Space and zoom into the waveform.',
        'Per-track volume from 0% to 200%.',
        'Real MP3 export with FFmpeg.',
        'Gemini AI assistant: transcription and cut suggestions.',
        'Local sign-in with multiple accounts and a recovery code.',
        'Spanish/English and light/dark theme.',
      ],
    },
    role: {
      es: 'Desarrollo completo: diseño de la interfaz, motor de audio y empaquetado del instalador.',
      en: 'Full development: interface design, audio engine and installer packaging.',
    },
    tech: ['Electron', 'JavaScript', 'Web Audio API', 'Node.js', 'Express', 'FFmpeg', 'Google Gemini', 'Tailwind CSS'],
    installer: {
      file: 'PodcastCraft AI.exe',
      size: { es: '~106 MB', en: '~106 MB' },
      version: '1.2.0',
      steps: {
        es: [
          'Descarga el instalador desde GitHub Releases.',
          'Ejecuta PodcastCraft AI.exe.',
          'Si aparece “Windows protegió su PC”, toca Más información → Ejecutar de todas formas.',
        ],
        en: [
          'Download the installer from GitHub Releases.',
          'Run PodcastCraft AI.exe.',
          'If “Windows protected your PC” appears, click More info → Run anyway.',
        ],
      },
    },
    downloadUrl: 'https://github.com/EdedArt/PodcastCraft_AI/releases/latest',
    codeUrl: 'https://github.com/EdedArt/PodcastCraft_AI',
    images: [
      { src: '/proyectos/podcastcraft-light.webp', width: 1365, height: 699, alt: { es: 'Editor multipista de PodcastCraft AI en tema claro', en: 'PodcastCraft AI multitrack editor in light theme' } },
      { src: '/proyectos/podcastcraft-dark.webp', width: 1364, height: 695, alt: { es: 'Editor multipista de PodcastCraft AI en tema oscuro', en: 'PodcastCraft AI multitrack editor in dark theme' } },
    ],
  },
  {
    id: 'autoclean',
    name: 'AutoClean AI',
    platform: 'mobile',
    platformLabel: { es: 'Móvil', en: 'Mobile' },
    requirements: { es: 'Android', en: 'Android' },
    tagline: {
      es: 'Sigue en tiempo real el lavado de tu carro.',
      en: 'Track your car wash in real time.',
    },
    description: {
      es: 'App para un autolavado. El operario registra el vehículo, le asigna un paquete y una bahía y avanza las fases del lavado; el cliente consulta con su placa cómo va su carro y cuánto falta. Usa Gemini Vision para leer placas y fases en las fotos de las cámaras.',
      en: 'App for a car wash. The operator registers the vehicle, assigns a package and a bay and moves the wash through its phases; the customer checks with their plate how the car is doing and how long is left. It uses Gemini Vision to read plates and phases from camera photos.',
    },
    features: {
      es: [
        'Roles de operario y cliente.',
        'Fases Pendiente, Remojo, Lavado, Polichado (según el paquete), Secado y Listo.',
        'Tiempo estimado de entrega.',
        'Evidencia fotográfica privada para el operario.',
        'Lectura de placas con Gemini Vision.',
        'Español/inglés y tema claro/oscuro.',
        'Backend desplegado en Render.',
      ],
      en: [
        'Operator and customer roles.',
        'Pending, Soak, Wash, Polish (depending on the package), Dry and Ready phases.',
        'Estimated delivery time.',
        'Private photo evidence for the operator.',
        'License plate reading with Gemini Vision.',
        'Spanish/English and light/dark theme.',
        'Backend deployed on Render.',
      ],
    },
    role: {
      es: 'Desarrollo de la app móvil y del backend.',
      en: 'Development of the mobile app and the backend.',
    },
    tech: [
      'React Native',
      'Expo',
      'TypeScript',
      'Expo Router',
      'TanStack Query',
      'i18next',
      'Node.js',
      'Express',
      'Prisma',
      'SQLite',
      'JWT',
      'Zod',
      'Gemini Vision',
    ],
    installer: {
      file: 'AutoClean AI (.apk · EAS Build)',
      steps: {
        es: [
          'Descarga el archivo .apk en tu celular.',
          'Permite “instalar apps de origen desconocido” cuando Android lo pida.',
          'Abre el .apk e instala.',
        ],
        en: [
          'Download the .apk file on your phone.',
          'Allow “install unknown apps” when Android asks.',
          'Open the .apk and install it.',
        ],
      },
    },
    downloadUrl: 'https://github.com/EdedArt/AutoClean_AI_Frontend/releases/latest',
    codeUrl: 'https://github.com/EdedArt/AutoClean_AI_Frontend',
    extraCode: [{ label: { es: 'Código backend', en: 'Backend code' }, url: 'https://github.com/EdedArt/AutoClean_AI' }],
    galleryLayout: 'phones',
    images: [
      { src: '/proyectos/autoclean-login.webp', width: 214, height: 464, alt: { es: 'Inicio de sesión', en: 'Sign-in' } },
      { src: '/proyectos/autoclean-buscar.webp', width: 213, height: 445, alt: { es: 'Consulta por placa', en: 'Plate lookup' } },
      { src: '/proyectos/autoclean-remojo-light.webp', width: 212, height: 464, alt: { es: 'Fase de remojo (30 %)', en: 'Soak phase (30%)' } },
      { src: '/proyectos/autoclean-lavado-light.webp', width: 214, height: 450, alt: { es: 'Fase de lavado (55 %), tema claro', en: 'Wash phase (55%), light theme' } },
      { src: '/proyectos/autoclean-secado-light.webp', width: 212, height: 442, alt: { es: 'Fase de secado (80 %), tema claro', en: 'Dry phase (80%), light theme' } },
      { src: '/proyectos/autoclean-lavado-dark.webp', width: 213, height: 445, alt: { es: 'Fase de lavado (55 %), tema oscuro', en: 'Wash phase (55%), dark theme' } },
      { src: '/proyectos/autoclean-secado-dark.webp', width: 213, height: 446, alt: { es: 'Fase de secado (80 %), tema oscuro', en: 'Dry phase (80%), dark theme' } },
    ],
  },
  {
    id: 'elderguard',
    name: 'ElderGuard AI',
    platform: 'watch',
    platformLabel: { es: 'Smartwatch', en: 'Smartwatch' },
    // Cuando esté instalada en el reloj, cambiar a "funcionando en un Garmin Forerunner 165 real"
    requirements: { es: 'Garmin Forerunner 165', en: 'Garmin Forerunner 165' },
    tagline: {
      es: 'Un reloj que cuida a los adultos mayores.',
      en: 'A watch that looks after older adults.',
    },
    description: {
      es: 'App nativa para relojes Garmin (Monkey C / Connect IQ) que detecta caídas y ritmo cardíaco anormal en reposo. Si pasa algo, muestra una cuenta regresiva que se puede cancelar y avisa a la familia con la ubicación. El texto de la alerta lo redacta Gemini; si no hay internet, usa una plantilla.',
      en: 'Native Garmin app (Monkey C / Connect IQ) that detects falls and abnormal resting heart rate. If something happens, it shows a cancellable countdown and notifies the family with the location. Gemini writes the alert text; without internet, it falls back to a template.',
    },
    features: {
      es: [
        'Detección de caídas con cuenta regresiva cancelable.',
        'Alerta de pulso alto en reposo.',
        'Botón SOS (mantener 2 segundos).',
        'Alertas simuladas a contactos con GPS.',
        'Mensaje de alerta generado con Gemini y respaldo sin conexión.',
        'Menú de demostración en el propio reloj.',
        'Interfaz de alto contraste (WCAG AAA) pensada para personas mayores.',
        'Español e inglés.',
        'También tiene una versión web de simulador y una versión para Wear OS como respaldo.',
      ],
      en: [
        'Fall detection with a cancellable countdown.',
        'High resting heart rate alert.',
        'SOS button (hold for 2 seconds).',
        'Simulated alerts to contacts with GPS.',
        'Alert message written by Gemini with an offline fallback.',
        'Demo menu right on the watch.',
        'High-contrast interface (WCAG AAA) designed for older adults.',
        'Spanish and English.',
        'It also has a web simulator version and a Wear OS version as a backup.',
      ],
    },
    role: {
      es: 'Desarrollo completo de las tres versiones (web, Wear OS y Garmin).',
      en: 'Full development of all three versions (web, Wear OS and Garmin).',
    },
    tech: ['Monkey C', 'Connect IQ SDK', 'Google Gemini', 'JavaScript', 'Vite', 'Vitest', 'Kotlin', 'Jetpack Compose'],
    installer: {
      file: 'ElderGuard AI (.prg)',
      steps: {
        es: [
          'Descarga el archivo .prg.',
          'Conecta el reloj Garmin al computador por USB.',
          'Copia el .prg en la carpeta GARMIN/APPS y desconecta el reloj.',
        ],
        en: [
          'Download the .prg file.',
          'Connect the Garmin watch to your computer over USB.',
          'Copy the .prg into the GARMIN/APPS folder and unplug the watch.',
        ],
      },
    },
    downloadUrl: 'https://github.com/EdedArt/ElderGuard_AI/releases/latest',
    codeUrl: 'https://github.com/EdedArt/ElderGuard_AI',
  },
  {
    id: 'plomoypaja',
    name: 'Plomo y Paja',
    platform: 'game',
    platformLabel: { es: 'Juego', en: 'Game' },
    requirements: { es: 'Windows 10/11 (64 bits)', en: 'Windows 10/11 (64-bit)' },
    tagline: {
      es: 'FPS de detective con estilo de caricatura de los años 30.',
      en: 'Detective FPS in a 1930s cartoon style.',
    },
    description: {
      es: 'Los Tres Cerditos contado desde el hermano mayor. Porky desapareció, su casa de paja quedó destruida y todo apunta a Don Lobo, el mafioso de la ciudad. Wilbur sale a buscarlo: recoge pistas, interroga a los hombres de Don Lobo y escucha una voz en su cabeza que puede ayudarlo o confundirlo. Lo que descubras cambia el final.',
      en: "The Three Little Pigs told from the older brother's side. Porky has vanished, his straw house is wrecked and everything points to Don Lobo, the city's mobster. Wilbur sets out to find him: he gathers clues, interrogates Don Lobo's men and hears a voice in his head that may help or mislead him. What you uncover changes the ending.",
    },
    features: {
      es: [
        'Pistas para explorar.',
        'Interrogatorios con decisiones.',
        'Voz interior generada con IA que reacciona a lo que haces.',
        'Escopeta y revólver.',
        'Tres finales.',
      ],
      en: [
        'Clues to explore.',
        'Interrogations with choices.',
        'AI-generated inner voice that reacts to what you do.',
        'Shotgun and revolver.',
        'Three endings.',
      ],
    },
    role: {
      es: 'Arte y sprites, enemigos, pistas y diálogos.',
      en: 'Art and sprites, enemies, clues and dialogue.',
    },
    team: {
      es: 'David Cabezas (programación y dirección), Edgar Arteaga (arte, personajes y pistas) y Cristian (voces, música y sonido).',
      en: 'David Cabezas (programming and direction), Edgar Arteaga (art, characters and clues) and Cristian (voices, music and sound).',
    },
    tech: ['Unity 2022.3 (URP)', 'C#', 'OpenAI API'],
    installer: {
      file: 'PlomoYPaja_v1.0.zip',
      size: { es: '~600 MB', en: '~600 MB' },
      version: '1.0',
      steps: {
        es: [
          'Descarga PlomoYPaja_v1.0.zip.',
          'Haz clic derecho → Extraer todo.',
          'Abre PLOMO_Y_PAJAV_1.exe sin sacarlo de su carpeta.',
        ],
        en: [
          'Download PlomoYPaja_v1.0.zip.',
          'Right-click → Extract all.',
          'Open PLOMO_Y_PAJAV_1.exe without moving it out of its folder.',
        ],
      },
    },
    downloadUrl: 'https://github.com/EdedArt/Plomo_Y_Paja/releases/latest',
    codeUrl: 'https://github.com/EdedArt/Plomo_Y_Paja',
    images: [
      { src: '/proyectos/plomo-portada.webp', width: 1348, height: 688, alt: { es: 'Portada del juego al atardecer', en: 'Game cover at sunset' } },
      { src: '/proyectos/plomo-menu.webp', width: 1365, height: 767, alt: { es: 'Menú principal: tormenta, el lobo y los tres cerditos', en: 'Main menu: storm, the wolf and the three little pigs' } },
    ],
  },
]

/* ───────────── Testimonios ─────────────
 * Mientras `borrador` sea true, la tarjeta muestra la etiqueta “Borrador”
 * y en lugar del nombre se muestra el rol. Cuando tengas el testimonio real:
 * 1) cambia `texto` por las palabras reales,
 * 2) llena `nombre` (y `iniciales`),
 * 3) pon `borrador: false`.
 */
export interface Testimonial {
  borrador: boolean
  nombre?: string
  iniciales: string
  rol: L
  texto: L
  hashtags: string[]
}

export const testimonials: Testimonial[] = [
  {
    borrador: true,
    iniciales: 'PP',
    rol: { es: 'Compañero de equipo · Plomo y Paja', en: 'Teammate · Plomo y Paja' },
    texto: {
      es: 'Edgar se encargó del arte, los enemigos y las pistas del juego. Siempre entregó a tiempo y, cuando algo no encajaba con la historia, proponía cambios en lugar de esperar instrucciones.',
      en: "Edgar handled the game's art, enemies and clues. He always delivered on time and, when something didn't fit the story, he proposed changes instead of waiting for instructions.",
    },
    hashtags: ['#Arte2D', '#TrabajoEnEquipo', '#Responsable'],
  },
  {
    borrador: true,
    iniciales: 'DI',
    rol: { es: 'Docente · Diseño de Interfaces de Software', en: 'Professor · Software Interface Design' },
    texto: {
      es: 'Sus entregas cuidan los detalles de la interfaz: tema claro y oscuro, dos idiomas y buena accesibilidad. Llevó un mismo proyecto del navegador hasta un reloj real.',
      en: 'His work takes care of interface details: light and dark themes, two languages and good accessibility. He took the same project from the browser all the way to a real watch.',
    },
    hashtags: ['#UI', '#Accesibilidad', '#Multiplataforma'],
  },
  {
    borrador: true,
    iniciales: 'UC',
    rol: { es: 'Compañero de clase · UCC Pasto', en: 'Classmate · UCC Pasto' },
    texto: {
      es: 'Es de los que explican con paciencia y comparten lo que aprenden. Cuando el grupo se trababa con algo técnico, Edgar buscaba la forma de resolverlo y nos la enseñaba.',
      en: "He's one of those who explain patiently and share what they learn. When the group got stuck on something technical, Edgar found a way to solve it and taught it to us.",
    },
    hashtags: ['#Colaboración', '#Aprendizaje', '#Compromiso'],
  },
]

/* ───────────── Trayectoria ───────────── */
export type TimelineKind = 'projects' | 'degree' | 'course' | 'events' | 'work' | 'graduated'
export interface TimelineItem {
  kind: TimelineKind
  date: L
  tag: L
  title: L
  place?: L
  text?: L
}

export const timeline: TimelineItem[] = [
  {
    kind: 'projects',
    date: { es: '2026 · Presente', en: '2026 · Present' },
    tag: { es: 'PROYECTOS', en: 'PROJECTS' },
    title: { es: 'Cuatro apps publicadas con instalador', en: 'Four apps shipped with an installer' },
    place: { es: 'Diseño de Interfaces de Software, UCC', en: 'Software Interface Design, UCC' },
    text: {
      es: 'PodcastCraft AI, AutoClean AI, ElderGuard AI y Plomo y Paja: escritorio, móvil, smartwatch y videojuego.',
      en: 'PodcastCraft AI, AutoClean AI, ElderGuard AI and Plomo y Paja: desktop, mobile, smartwatch and video game.',
    },
  },
  {
    kind: 'degree',
    date: { es: '2024 · Presente', en: '2024 · Present' },
    tag: { es: 'PREGRADO', en: 'DEGREE' },
    title: { es: 'Ingeniería de Software · 5.º semestre', en: 'Software Engineering · 5th semester' },
    place: {
      es: 'Universidad Cooperativa de Colombia, sede Pasto',
      en: 'Universidad Cooperativa de Colombia, Pasto campus',
    },
    text: {
      es: 'Programación, bases de datos, arquitectura de software, diseño de interfaces y metodologías ágiles.',
      en: 'Programming, databases, software architecture, interface design and agile methodologies.',
    },
  },
  {
    kind: 'course',
    date: { es: '2026 · En curso', en: '2026 · In progress' },
    tag: { es: 'FORMACIÓN', en: 'TRAINING' },
    title: { es: 'Curso de ciberseguridad', en: 'Cybersecurity course' },
    text: {
      es: 'Fundamentos de seguridad aplicados al desarrollo de software.',
      en: 'Security fundamentals applied to software development.',
    },
  },
  {
    kind: 'events',
    date: { es: 'Durante la carrera', en: 'During my degree' },
    tag: { es: 'EVENTOS', en: 'EVENTS' },
    title: { es: '4 seminarios de Ingeniería de Software', en: '4 Software Engineering seminars' },
    text: {
      es: 'Además de conferencias y charlas de tecnología.',
      en: 'Plus technology conferences and talks.',
    },
  },
  {
    kind: 'work',
    date: { es: 'Antes y durante la carrera', en: 'Before and during my degree' },
    tag: { es: 'EXPERIENCIA', en: 'EXPERIENCE' },
    title: { es: 'Atención al público', en: 'Customer service' },
    place: {
      es: 'Droguería Novasalud (regencia de farmacia) y Pasión Nariño',
      en: 'Droguería Novasalud (pharmacy) and Pasión Nariño',
    },
    text: {
      es: 'Atención al cliente, apoyo administrativo e inventario.',
      en: 'Customer service, administrative support and inventory.',
    },
  },
  {
    kind: 'graduated',
    date: { es: '7 de diciembre de 2023', en: 'December 7, 2023' },
    tag: { es: 'GRADUADO', en: 'GRADUATED' },
    title: { es: 'Bachiller Académico', en: 'High school diploma' },
    place: {
      es: 'Institución Educativa Municipal Libertad, Pasto',
      en: 'Institución Educativa Municipal Libertad, Pasto',
    },
  },
]

export const education = {
  degree: { es: 'Ingeniería de Software', en: 'Software Engineering' },
  school: { es: 'Universidad Cooperativa de Colombia, campus Pasto', en: 'Universidad Cooperativa de Colombia, Pasto campus' },
  period: { es: '2024 – en curso (5.º semestre)', en: '2024 – present (5th semester)' },
  bullets: {
    es: [
      '4 apps publicadas con instalador',
      'App propia funcionando en un reloj Garmin',
      '4 seminarios de Ingeniería de Software',
      'Curso de ciberseguridad en curso',
    ],
    en: [
      '4 apps shipped with an installer',
      'My own app running on a Garmin watch',
      '4 Software Engineering seminars',
      'Cybersecurity course in progress',
    ],
  } as LList,
}

/* ───────────── Habilidades ───────────── */
export type ToolStatus = 'production' | 'projects' | 'learning'
export interface SkillItem {
  name: string
  level: ToolStatus
}
export interface SkillGroup {
  title: L
  items: SkillItem[]
  /** Reverso de la tarjeta: en qué proyecto la usé */
  usedIn: LList
}

export const skillGroups: SkillGroup[] = [
  {
    title: { es: 'Web y Frontend', en: 'Web & Frontend' },
    items: [
      { name: 'HTML / CSS / JavaScript', level: 'production' },
      { name: 'TypeScript', level: 'production' },
      { name: 'Tailwind CSS', level: 'production' },
      { name: 'Vite', level: 'projects' },
    ],
    usedIn: {
      es: [
        'PodcastCraft AI: interfaz en HTML, JS y Tailwind',
        'AutoClean AI: app y backend en TypeScript',
        'ElderGuard AI: simulador web con Vite',
        'Este portafolio: React + Tailwind',
      ],
      en: [
        'PodcastCraft AI: UI in HTML, JS and Tailwind',
        'AutoClean AI: app and backend in TypeScript',
        'ElderGuard AI: web simulator with Vite',
        'This portfolio: React + Tailwind',
      ],
    },
  },
  {
    title: { es: 'Móvil y Wearables', en: 'Mobile & Wearables' },
    items: [
      { name: 'React Native + Expo', level: 'production' },
      { name: 'Monkey C / Connect IQ', level: 'production' },
      { name: 'Wear OS (Kotlin)', level: 'learning' },
    ],
    usedIn: {
      es: [
        'AutoClean AI: app Android con Expo y EAS Build',
        'ElderGuard AI: app en un Garmin Forerunner 165',
        'ElderGuard AI: versión de respaldo en Wear OS',
      ],
      en: [
        'AutoClean AI: Android app with Expo and EAS Build',
        'ElderGuard AI: app on a Garmin Forerunner 165',
        'ElderGuard AI: backup version on Wear OS',
      ],
    },
  },
  {
    title: { es: 'Escritorio y Juegos', en: 'Desktop & Games' },
    items: [
      { name: 'Electron', level: 'production' },
      { name: 'Web Audio API + FFmpeg', level: 'production' },
      { name: 'Unity + C#', level: 'projects' },
    ],
    usedIn: {
      es: [
        'PodcastCraft AI: app de escritorio con Electron',
        'PodcastCraft AI: motor de audio y exportación MP3',
        'Plomo y Paja: arte, enemigos y pistas en Unity',
      ],
      en: [
        'PodcastCraft AI: Electron desktop app',
        'PodcastCraft AI: audio engine and MP3 export',
        'Plomo y Paja: art, enemies and clues in Unity',
      ],
    },
  },
  {
    title: { es: 'Backend, IA y datos', en: 'Backend, AI & data' },
    items: [
      { name: 'Node.js + Express', level: 'production' },
      { name: 'Prisma + SQLite', level: 'projects' },
      { name: 'Google Gemini', level: 'production' },
      { name: 'OpenAI API', level: 'projects' },
      { name: 'Java', level: 'learning' },
    ],
    usedIn: {
      es: [
        'AutoClean AI: API en Express desplegada en Render',
        'AutoClean AI: base de datos con Prisma + SQLite',
        'Gemini en PodcastCraft, AutoClean y ElderGuard',
        'OpenAI: voz interior de Plomo y Paja',
        'Java: cursos de la carrera',
      ],
      en: [
        'AutoClean AI: Express API deployed on Render',
        'AutoClean AI: database with Prisma + SQLite',
        'Gemini in PodcastCraft, AutoClean and ElderGuard',
        'OpenAI: inner voice in Plomo y Paja',
        'Java: university courses',
      ],
    },
  },
]

export const spokenLanguages = [
  {
    name: { es: 'Español', en: 'Spanish' },
    level: { es: 'Nativo', en: 'Native' },
    note: { es: 'Mi lengua materna.', en: 'My mother tongue.' },
    value: 100,
  },
  {
    name: { es: 'Inglés', en: 'English' },
    level: { es: 'Intermedio', en: 'Intermediate' },
    note: {
      es: 'Lo leo y lo escribo sin problema; sigo practicando la conversación.',
      en: 'I read and write it comfortably; I keep practicing conversation.',
    },
    value: 55,
  },
]

export type AchievementIcon = 'graduation' | 'rocket' | 'watch' | 'mic' | 'shield' | 'presentation'
export const achievements: { icon: AchievementIcon; title: L; meta: L }[] = [
  {
    icon: 'graduation',
    title: { es: 'Bachiller Académico', en: 'High school diploma' },
    meta: { es: '7 dic 2023', en: 'Dec 7, 2023' },
  },
  {
    icon: 'rocket',
    title: { es: '4 apps publicadas con instalador', en: '4 apps shipped with an installer' },
    meta: { es: 'Escritorio, móvil, reloj y juego', en: 'Desktop, mobile, watch and game' },
  },
  {
    icon: 'watch',
    // Cuando esté instalada en el reloj, cambiar a "funcionando en un Garmin Forerunner 165 real"
    title: { es: 'App nativa para Garmin (Monkey C / Connect IQ)', en: 'Native Garmin app (Monkey C / Connect IQ)' },
    meta: { es: 'ElderGuard AI · Forerunner 165', en: 'ElderGuard AI · Forerunner 165' },
  },
  {
    icon: 'mic',
    title: { es: '4 seminarios de Ingeniería de Software', en: '4 Software Engineering seminars' },
    meta: { es: 'UCC Pasto', en: 'UCC Pasto' },
  },
  {
    icon: 'shield',
    title: { es: 'Curso de ciberseguridad', en: 'Cybersecurity course' },
    meta: { es: 'En curso', en: 'In progress' },
  },
  {
    icon: 'presentation',
    title: { es: 'Conferencias de tecnología', en: 'Technology conferences' },
    meta: { es: 'Durante la carrera', en: 'During my degree' },
  },
]
