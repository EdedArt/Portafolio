# Portafolio · Edgar Arteaga

Portafolio personal de **Edgar Mauricio Arteaga Realpe**, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia (sede Pasto). Es la base de la exposición final de la materia **Diseño de Interfaces de Software**.

Sitio estático (solo frontend), bilingüe (español / inglés), con tema claro y oscuro, animaciones 3D y un “Lab 3D” interactivo con los cuatro proyectos publicados: PodcastCraft AI, AutoClean AI, ElderGuard AI y Plomo y Paja.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- Tailwind CSS v4 (tokens de diseño en `src/index.css`, bloque `@theme`)
- Framer Motion (animaciones de interfaz)
- Three.js con `@react-three/fiber` y `@react-three/drei` (fondo de partículas y Lab 3D)
- Lenis (scroll suave) y `lucide-react` (íconos)

## Cómo correrlo

Necesitas Node.js 20 o superior.

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # revisa tipos y genera la versión final en dist/
npm run preview   # sirve dist/ para probar la versión final
```

## Desplegar en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio.
3. Vercel detecta Vite solo. Si te lo pide: comando de build `npm run build` y carpeta de salida `dist`.
4. **Deploy**. Cada `git push` a `main` vuelve a publicar el sitio.

`vercel.json` ya trae `cleanUrls` y caché larga para los archivos de `assets/`.

> **Formulario de contacto (FormSubmit):** la primera vez que alguien envíe el formulario desde el sitio publicado, FormSubmit te manda un correo de activación a `edgar20arteaga06@gmail.com`. Ábrelo y confirma; desde ahí los mensajes llegan directo a Gmail.

## Dónde cambiar textos y datos

| Qué | Archivo |
| --- | --- |
| Proyectos, herramientas, trayectoria, habilidades, idiomas, logros y testimonios | `src/data/content.ts` |
| Correo, GitHub, **LinkedIn**, ruta del CV, coordenadas | arriba de `src/data/content.ts` |
| Textos de la interfaz (hero, sobre mí, botones, formulario, etc.) | `src/i18n/es.ts` y `src/i18n/en.ts` |
| Fecha de nacimiento (la edad se calcula sola) | `src/lib/age.ts` |
| Colores de los temas | `src/index.css` (`:root` y `.dark`) |
| Foto y hoja de vida | `public/edgar.jpg` y `public/CV_Edgar_Arteaga.pdf` |

Cada texto de `content.ts` tiene su versión en los dos idiomas: `{ es: '...', en: '...' }`. Los diccionarios `es.ts` y `en.ts` deben tener la misma forma (TypeScript avisa si falta algo en inglés).

### LinkedIn

En `src/data/content.ts`:

```ts
export const LINKEDIN_URL = 'https://www.linkedin.com/in/tu-usuario'
```

Mientras esté vacío, los íconos y la tarjeta de LinkedIn no se muestran.

### Capturas o videos de un proyecto

Cada proyecto acepta `images` y `video` opcionales. Si existen, aparecen en el modal “Ver detalles”:

```ts
{
  id: 'podcastcraft',
  // ...
  video: 'https://www.youtube.com/embed/ID_DEL_VIDEO', // o '/proyectos/podcast.mp4'
  images: [
    { src: '/proyectos/podcast-1.png', alt: { es: 'Línea de tiempo', en: 'Timeline' } },
  ],
}
```

Pon los archivos en `public/proyectos/`.

## Reemplazar los testimonios borrador

Los tres testimonios de `src/data/content.ts` son **borradores**: llevan `borrador: true`, por eso la tarjeta muestra la etiqueta “Borrador” y en lugar del nombre aparece el rol. Cuando tengas una opinión real:

1. Cambia `texto` (en `es` y `en`) por las palabras reales de la persona.
2. Agrega `nombre: 'Nombre Apellido'` y actualiza `iniciales`.
3. Cambia `borrador: true` por `borrador: false`.

```ts
{
  borrador: false,
  nombre: 'David Cabezas',
  iniciales: 'DC',
  rol: { es: 'Compañero de equipo · Plomo y Paja', en: 'Teammate · Plomo y Paja' },
  texto: { es: '...', en: '...' },
  hashtags: ['#Arte2D', '#TrabajoEnEquipo', '#Responsable'],
}
```

## Accesibilidad y rendimiento

- HTML semántico, foco visible, navegación por teclado (incluido el Lab 3D: ← → para cambiar y Enter para encender) y textos alternativos.
- Con `prefers-reduced-motion` se apagan las animaciones decorativas, el scroll suave y el giro automático.
- En móvil se usan menos partículas, sin sombras ni reflejos en el Lab 3D y `dpr` máximo de 1.5.
- Three.js se carga de forma diferida: el fondo cuando el navegador queda libre y el Lab 3D cuando te acercas a la sección. El Lab deja de renderizar cuando sale de pantalla.
- Si el navegador no soporta WebGL, el Lab muestra un respaldo con tarjetas en CSS 3D.

## Estructura

```
src/
  components/   header, footer, cursor, fondo 3D, mockups, modal y Lab 3D
  data/         content.ts (todo el contenido editable)
  i18n/         diccionarios es/en y contexto useI18n()
  lib/          edad, hooks, navegación y scroll suave
  sections/     una sección por archivo, en el orden de la página
  theme/        tema claro/oscuro
```
