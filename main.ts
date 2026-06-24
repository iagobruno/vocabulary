import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import './global.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');

/* Service worker */

registerSW({
  immediate: true,
  onRegisteredSW() {
    if (sessionStorage.getItem('sw-updated')) {
      sessionStorage.removeItem('sw-updated');
      showUpdateToast();
    }
  },
});

navigator.serviceWorker?.addEventListener('controllerchange', () => {
  sessionStorage.setItem('sw-updated', 'true');
});

function showUpdateToast() {
  const existing = document.getElementById('update-toast');
  if (existing) return;

  const toast = document.createElement('div');
  toast.id = 'update-toast';
  toast.textContent = 'Aplicativo atualizado';
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    right: 'auto',
    padding: '10px 18px',
    background: '#2d2d2d',
    'border-radius': '6px',
    color: 'rgb(255, 255, 255)',
    'font-size': '0.8rem',
    'text-align': 'center',
    'z-index': '99999',
    'font-family': 'Inter, sans-serif',
    transform: 'translateY(calc(-100% + -24px)) translateX(-50%)',
    transition: 'transform 0.3s',
  });
  document.body.prepend(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0%) translateX(-50%)';
  });
  setTimeout(() => {
    toast.addEventListener('transitionend', () => toast.remove());
    toast.style.transform = 'translateY(calc(-100% + -24px)) translateX(-50%)';
  }, 3000);
}
