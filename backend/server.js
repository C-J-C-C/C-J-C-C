import express from 'express';
import { WebSocketServer } from 'ws';
import { pipeline } from '@xenova/transformers';

const app = express();
const server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

const wss = new WebSocketServer({ server });

const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
const translator = await pipeline('translation', 'Helsinki-NLP/opus-mt-es-en');

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    try {
      const result = await asr(data);
      const translated = await translator(result.text);
      ws.send(translated[0].translation_text);
    } catch (err) {
      console.error(err);
    }
  });
});
