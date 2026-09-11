const appBase = new URL('./', window.location.href);
const cacheName = 'ford-base-finder:' + appBase.href + ':v4';
let installPrompt = null;
let installationConfirmed = false;
const button = document.getElementById('install-app');
const status = document.getElementById('install-status');
const instructions = document.getElementById('install-instructions');
const displayMode = window.matchMedia('(display-mode: standalone)');
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = () => displayMode.matches || navigator.standalone === true;

function showInstalled() {
  installationConfirmed = true;
  installPrompt = null;
  button.hidden = true;
  status.textContent = 'Base Finder is installed. Open the app to search your reference.';
}
function showInstructions() {
  status.textContent = isIOS
    ? 'Open in Safari, then tap Share → Add to Home Screen → Add.'
    : 'Use your browser menu to install or add to your home screen. From ChatGPT, open this page in Chrome or Samsung Internet first.';
  if (isIOS) document.getElementById('ios-instructions').open = true;
  instructions.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  instructions.focus({ preventScroll: true });
}
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  if (installationConfirmed || standalone()) return;
  installPrompt = event;
  button.hidden = false;
  button.disabled = false;
  button.textContent = 'Install on my phone';
  status.textContent = 'Ready to install. Tap the button to add Base Finder to your phone.';
});
window.addEventListener('appinstalled', showInstalled);
displayMode.addEventListener?.('change', () => { if (standalone()) showInstalled(); });
button.addEventListener('click', async () => {
  if (!installPrompt) { showInstructions(); return; }
  const prompt = installPrompt;
  installPrompt = null;
  button.disabled = true;
  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (!installationConfirmed) status.textContent = choice.outcome === 'accepted'
      ? 'Installation requested. Your browser will finish adding Base Finder.'
      : 'Installation cancelled. You can install later or open Base Finder now.';
  } catch {
    if (!installationConfirmed) showInstructions();
  } finally {
    button.disabled = false;
    if (!installationConfirmed && !installPrompt) button.textContent = 'Show installation steps';
  }
});
if (standalone()) showInstalled();
else if (isIOS) {
  status.textContent = 'On iPhone or iPad, open in Safari and use Share → Add to Home Screen.';
  document.getElementById('ios-instructions').open = true;
}

async function prepareOffline() {
  const offline = document.getElementById('offline-status');
  if (!window.isSecureContext || !('serviceWorker' in navigator) || !('caches' in window)) {
    offline.textContent = 'Offline setup needs a supported browser on the published app. You can open Base Finder online.';
    return;
  }
  let timer;
  try {
    const setup = async () => {
      const registration = await navigator.serviceWorker.register(new URL('sw.js', appBase).href, { scope: appBase.pathname, updateViaCache: 'none' });
      const worker = registration.installing || registration.waiting;
      if (worker && worker.state !== 'activated') await new Promise((resolve, reject) => {
        const check = () => {
          if (worker.state === 'activated' || worker.state === 'redundant') {
            worker.removeEventListener('statechange', check);
            worker.state === 'activated' ? resolve() : reject(new Error('Offline setup failed'));
          }
        };
        worker.addEventListener('statechange', check);
        check();
      });
      await navigator.serviceWorker.ready;
      const cache = await caches.open(cacheName);
      const required = await Promise.all(['index.html', 'app.js', 'core.js', 'reference.txt', 'epc-reference.json'].map(path => cache.match(new URL(path, appBase).href)));
      if (required.some(response => !response || !response.ok || response.redirected)) throw new Error('Reference not fully cached');
    };
    await Promise.race([setup(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Offline setup timed out')), 25000); })]);
    offline.textContent = 'The included reference is saved for offline use on this browser.';
  } catch {
    offline.textContent = 'Offline setup is not complete yet. Stay online, open Base Finder, then return to this page to try again.';
  } finally { clearTimeout(timer); }
}
prepareOffline();
