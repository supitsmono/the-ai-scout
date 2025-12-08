/**
 * Generate a device fingerprint for fraud detection
 * Combines multiple browser/device characteristics
 */
export function generateDeviceFingerprint(): string {
  const components: string[] = [];

  // User Agent
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    components.push(navigator.userAgent);
  }

  // Screen resolution
  if (typeof screen !== 'undefined') {
    components.push(`${screen.width}x${screen.height}`);
    components.push(`${screen.colorDepth}`);
  }

  // Timezone
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  // Language
  if (typeof navigator !== 'undefined' && navigator.language) {
    components.push(navigator.language);
  }

  // Platform
  if (typeof navigator !== 'undefined' && navigator.platform) {
    components.push(navigator.platform);
  }

  // Canvas fingerprint (if available)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      components.push(canvas.toDataURL());
    }
  } catch (e) {
    // Canvas not available
  }

  // WebGL fingerprint (if available)
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch (e) {
    // WebGL not available
  }

  // Combine and hash (simple hash function)
  const combined = components.join('|');
  return simpleHash(combined);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Store device fingerprint in localStorage for persistence
 */
export function getOrCreateDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const storageKey = 'ai_scout_device_fingerprint';
  
  // Try to get existing fingerprint
  const existing = localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  // Generate new fingerprint
  const fingerprint = generateDeviceFingerprint();
  localStorage.setItem(storageKey, fingerprint);
  
  return fingerprint;
}

