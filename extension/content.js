const overlay = document.createElement('div');
overlay.id = 'caption-overlay';
overlay.textContent = '';
document.documentElement.appendChild(overlay);

chrome.runtime.onMessage.addListener((msg) => {
  overlay.textContent = msg.transcript;
});
