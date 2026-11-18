# 🔮 Oráculo de la Psique v2.0

**Inteligencia Arquetípica y Tarot Evolutivo** · **Noruf_Labs**

Aplicación web estática (*Single Page Application*), móvil-first y **100 % privada en el navegador**, diseñada para funcionar sin servidores ni claves API mediante un motor heurístico local, con soporte opcional **BYOK** (*Bring Your Own Key*) para Google Gemini, OpenAI y Groq.

> ⚠️ **Advertencia de honestidad:** El tarot no es una ciencia demostrada. Considéralo una herramienta de entretenimiento introspectivo y reflexión simbólica.

---

## ✨ Características Principales

- **100 % Offline y Privado (0 €):** Motor heurístico local con los **22 Arcanos Mayores** (`0` al `21`) redactados en prosa literaria con enfoque dual:
  - 🧠 **Psicología Junguiana:** Espejo interno, análisis directo de bloqueos subconscientes y cero complacencia.
  - ✨ **Tradición Mística:** Lectura simbólica clásica, tendencias y augurio tradicional.
- **Jerarquía Protagonista + Debate en Grupo:** Veredicto tajante arriba del todo (`SÍ · CAMINO ABIERTO`, `NO · FRENO ACTIVO` o `SÍ, CON ESTA CONDICIÓN` en ≤ 15 palabras), seguido de cartas vectoriales SVG interactivas, relato en 3 bloques (*La Escena*, *La Verdad Incómoda / El Giro*, *El Cierre*) y una pregunta provocadora final para comentar en la mesa.
- **Barajado Criptográfico Real:** Basado en `crypto.getRandomValues` con *rejection sampling* (sin sesgo de módulo) y 25 % de probabilidad de cartas invertidas cuando está habilitado.
- **Modo IA Opcional (BYOK):** Adaptadores directos desde navegador (`fetch`) para **Google Gemini**, **OpenAI (`gpt-4o-mini`)** y **Groq**, con claves guardadas solo en `sessionStorage` por defecto y *fallback* automático al motor local ante cualquier fallo.
- **Diario Privado y Exportación:** Historial cronológico en `localStorage`, descarga directa en Markdown (`.md`) mediante `Blob` nativo e impresión limpia a PDF mediante `@media print`.

---

## 🛠️ Desarrollo Local

```bash
npm install
npm run dev      # Servidor de desarrollo
npm test         # Tests unitarios (Vitest)
npm run build    # Compilación estática en dist/
```

---

## 🚀 Despliegue Automático en GitHub Pages

Este repositorio incluye el flujo oficial en `.github/workflows/deploy.yml`. Cada `git push` a la rama `main` ejecuta los tests, compila `dist/` y publica automáticamente en **GitHub Pages** (asegúrate de activar **Settings → Pages → Source: GitHub Actions** en el repositorio).

---

## 👤 Autoría

- **Laboratorio:** `Noruf_Labs`
- **Autor:** Norberto Urrea Falla (`norbertouf@gmail.com`)
