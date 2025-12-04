import ReactDOM from "react-dom/client";
import Providers from "@mifin/redux/appProvider";
import App from "@mifin/pages/App";
import "@mifin/translations";
import { registerSW } from 'virtual:pwa-register';

// PWA Install Prompt Handler
let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  console.log('PWA install prompt available');
  
  // Store in window for access from components
  (window as any).pwaInstallPrompt = deferredPrompt;
  
  // Dispatch custom event that components can listen to
  window.dispatchEvent(new Event('pwa-install-available'));
});

// Track successful installation
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed successfully');
  deferredPrompt = null;
  (window as any).pwaInstallPrompt = null;
});

// Register service worker with better update handling
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      const shouldUpdate = confirm(
        'New version available! Click OK to update and reload the app.'
      );
      if (shouldUpdate) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('✅ App ready to work offline');
      console.log('✅ PWA can now be used without internet connection');
      // Optional: Show a toast notification
      const event = new CustomEvent('app-offline-ready');
      window.dispatchEvent(event);
    },
    onRegistered(registration) {
      console.log('✅ Service Worker registered successfully');
      console.log('📦 Service Worker Scope:', registration?.scope);
      
      // Log cache status
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          console.log('📦 Available caches:', cacheNames);
          cacheNames.forEach(cacheName => {
            caches.open(cacheName).then(cache => {
              cache.keys().then(requests => {
                console.log(`📦 Cache "${cacheName}": ${requests.length} items`);
              });
            });
          });
        });
      }
      
      // Check for updates every hour
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // 1 hour
      }
    },
    onRegisterError(error) {
      console.error('❌ Service Worker registration failed:', error);
    },
    immediate: true,
  });
  
  // Check if service worker is controlling the page
  navigator.serviceWorker.ready.then(registration => {
    console.log('✅ Service Worker ready and active');
    console.log('🔧 Controlling?', !!navigator.serviceWorker.controller);
    if (!navigator.serviceWorker.controller) {
      console.warn('⚠️ Service Worker not controlling this page yet. Refresh may be needed.');
    }
  });
}

// Expose PWA install function globally
(window as any).installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
    deferredPrompt = null;
    (window as any).pwaInstallPrompt = null;
  } else {
    console.log('PWA install prompt not available');
  }
};

// Hide splash screen helper
const hideSplashScreen = () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
    }, 300);
  }
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Providers>
    <App />
  </Providers>
);

// Hide splash screen after React is rendered
setTimeout(() => {
  hideSplashScreen();
}, 100);
