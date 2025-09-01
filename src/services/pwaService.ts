// import { Workbox } from 'workbox-window';

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAService {
  private workbox: any | null = null;
  private installPrompt: any = null;
  private isUpdateAvailable = false;
  private onlineCallbacks: (() => void)[] = [];
  private offlineCallbacks: (() => void)[] = [];
  private updateCallbacks: ((available: boolean) => void)[] = [];

  async initialize(): Promise<void> {
    try {
      // Initialize service worker
      if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
        // this.workbox = new Workbox('/sw.js');
        
        // Service worker events
        this.workbox.addEventListener('waiting', () => {
          this.isUpdateAvailable = true;
          this.notifyUpdateCallbacks(true);
        });

        this.workbox.addEventListener('controlling', () => {
          window.location.reload();
        });

        this.workbox.addEventListener('activated', () => {
          // console.log('Service worker activated');
        });

        await this.workbox.register();
        // console.log('Service worker registered successfully');
      }

      // Network status monitoring
      this.setupNetworkMonitoring();
      
      // Background sync setup
      this.setupBackgroundSync();
      
      // Push notifications setup
      this.setupPushNotifications();
      
      // console.log('PWA service initialized successfully');
    } catch (error) {
      // console.error('PWA service initialization failed:', error);
    }
  }

  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      // console.log('App went online');
      this.notifyOnlineCallbacks();
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      // console.log('App went offline');
      this.notifyOfflineCallbacks();
    });
  }

  private setupBackgroundSync(): void {
    if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        // Register background sync
        return ((registration as any).sync as any).register('background-sync');
      }).catch(error => {
        // console.error('Background sync registration failed:', error);
      });
    }
  }

  private async setupPushNotifications(): Promise<void> {
    if ((import.meta as any).env?.PROD && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // console.log('Push notifications enabled');
      }
    }
  }

  private async syncOfflineData(): Promise<void> {
    try {
      // Trigger sync of offline data when coming back online
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          ((registration as any).sync as any).register('background-sync-offline-data');
        }
      }
    } catch (error) {
      // console.error('Failed to sync offline data:', error);
    }
  }

  // Install app
  async installApp(): Promise<boolean> {
    if (!this.installPrompt) {
      // console.log('Install prompt not available');
      return false;
    }

    try {
      this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // console.log('App installed successfully');
        this.installPrompt = null;
        return true;
      } else {
        // console.log('App installation declined');
        return false;
      }
    } catch (error) {
      // console.error('App installation failed:', error);
      return false;
    }
  }

  // Update app
  async updateApp(): Promise<void> {
    if (!this.workbox || !this.isUpdateAvailable) {
      // console.log('No update available');
      return;
    }

    try {
      // Skip waiting and activate new service worker
      this.workbox.addEventListener('controlling', () => {
        window.location.reload();
      });

      if (this.workbox.waiting) {
        this.workbox.messageSkipWaiting();
      }
    } catch (error) {
      // console.error('App update failed:', error);
    }
  }

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Check if install prompt is available
  canInstall(): boolean {
    return !!this.installPrompt;
  }

  // Check if update is available
  hasUpdate(): boolean {
    return this.isUpdateAvailable;
  }

  // Event listeners
  onOnline(callback: () => void): void {
    this.onlineCallbacks.push(callback);
  }

  onOffline(callback: () => void): void {
    this.offlineCallbacks.push(callback);
  }

  onUpdate(callback: (available: boolean) => void): void {
    this.updateCallbacks.push(callback);
  }

  private notifyOnlineCallbacks(): void {
    this.onlineCallbacks.forEach(callback => callback());
  }

  private notifyOfflineCallbacks(): void {
    this.offlineCallbacks.forEach(callback => callback());
  }

  private notifyUpdateCallbacks(available: boolean): void {
    this.updateCallbacks.forEach(callback => callback(available));
  }

  // Static method to set install prompt
  static setInstallPrompt(prompt: any): void {
    const instance = pwaService;
    instance.installPrompt = prompt;
  }

  // Cache management
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      // console.log('All caches cleared');
    }
  }

  // Storage management
  async getStorageEstimate(): Promise<StorageEstimate | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return navigator.storage.estimate();
    }
    return null;
  }

  // Notification management
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          ...options
        });
      } else {
        new Notification(title, options);
      }
    }
  }

  // App info
  getAppInfo() {
    return {
      isInstalled: this.isInstalled(),
      canInstall: this.canInstall(),
      hasUpdate: this.hasUpdate(),
      isOnline: navigator.onLine,
      serviceWorkerSupported: 'serviceWorker' in navigator,
      notificationSupported: 'Notification' in window,
      backgroundSyncSupported: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
    };
  }
}

export const pwaService = new PWAService();
export { PWAService };
export default pwaService;
