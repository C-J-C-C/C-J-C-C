let listening = false;
let mediaRecorder;
let ws;

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-listening') return;

  if (!listening) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    ws = new WebSocket('ws://localhost:3000');
    ws.addEventListener('message', (event) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { transcript: event.data });
        }
      });
    });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener('dataavailable', (e) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(e.data);
      }
    });
    mediaRecorder.start(250);
    listening = true;
  } else {
    mediaRecorder.stop();
    ws.close();
    listening = false;
  }
});
