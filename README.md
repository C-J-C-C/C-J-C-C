# Local Caption Translator

Este repositorio contiene una base para:

- **Extensión Chrome (MV3)** que captura el micrófono, envía el audio a un backend y muestra subtítulos sobre cualquier pestaña.  El atajo `Ctrl+Shift+L` inicia o detiene la escucha.
- **Backend Node.js** que realiza reconocimiento de voz (ASR) y traducción de forma local usando modelos open‑source.

## Ejecución

### Backend

```bash
cd backend
npm install
node server.js
```
El primer arranque descargará los modelos de ASR (`Xenova/whisper-tiny`) y traducción (`Helsinki-NLP/opus-mt-es-en`).  Una vez descargados se usarán localmente.

### Extensión
1. Abrir `chrome://extensions` y activar **Developer mode**.
2. Cargar la carpeta `extension` con *Load unpacked*.
3. En cualquier pestaña usar `Ctrl+Shift+L` para iniciar o pausar.

## Cambiar idiomas
- En `backend/server.js` se puede ajustar el modelo de traducción para otras combinaciones de idiomas.
- Para salida de audio (TTS) en iOS u otros clientes se puede reutilizar este backend como punto de partida.
