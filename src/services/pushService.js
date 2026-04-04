// src/services/pushService.js
// Handles browser Web Push subscription lifecycle

import axiosClient from '../api/axiosClient';

/**
 * Convert a base64 VAPID public key to Uint8Array
 * (required by pushManager.subscribe)
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Check if push notifications are supported in this browser
 */
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Request notification permission from the user
 * Returns: 'granted' | 'denied' | 'default'
 */
export async function requestPermission() {
  if (!isPushSupported()) return 'unsupported';
  return await Notification.requestPermission();
}

/**
 * Register service worker and subscribe to push
 * Saves subscription to backend automatically
 */
export async function subscribeToPush() {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  const permission = await requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  // Register service worker
  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await navigator.serviceWorker.ready;

  // Check for existing subscription first
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      throw new Error('VITE_VAPID_PUBLIC_KEY is not set in environment variables');
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }

  // Save subscription to backend
  await axiosClient.post('notifications/subscribe', subscription.toJSON());

  return subscription;
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush() {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration('/sw.js');
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    // Tell backend to remove this subscription
    try {
      await axiosClient.post('notifications/unsubscribe', { endpoint: subscription.endpoint });
    } catch (e) {
      console.warn('Could not remove subscription from backend:', e);
    }
    await subscription.unsubscribe();
  }
}

/**
 * Get current subscription status
 * Returns: 'subscribed' | 'unsubscribed' | 'unsupported' | 'denied'
 */
export async function getPushStatus() {
  if (!isPushSupported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';

  try {
    const registration = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!registration) return 'unsubscribed';
    const subscription = await registration.pushManager.getSubscription();
    return subscription ? 'subscribed' : 'unsubscribed';
  } catch {
    return 'unsubscribed';
  }
}
