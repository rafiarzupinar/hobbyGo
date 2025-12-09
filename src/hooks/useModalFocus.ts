import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * Modal focus yönetimi hook'u
 * Web: Modal açıldığında ilk focusable elemente focus verir, kapandığında önceki focus'u restore eder
 * React Native: Hiçbir şey yapmaz (sadece web için gerekli)
 */
export function useModalFocus() {
  const previousActiveElementRef = useRef<any>(null);

  useEffect(() => {
    // Sadece web platformunda çalış
    if (Platform.OS !== 'web') {
      return;
    }

    // Web-specific kod
    if (typeof document === 'undefined') {
      return;
    }

    // Mevcut focus edilmiş elementi sakla
    previousActiveElementRef.current = document.activeElement;

    // Kısa bir gecikme ile ilk focusable elemente focus ver
    const focusTimeout = setTimeout(() => {
      // Tüm focusable elementleri bul
      const focusableSelectors = [
        'input:not([disabled]):not([type="hidden"])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      const focusableElements = document.querySelectorAll(focusableSelectors);

      if (focusableElements.length > 0) {
        // İlk focusable elementi bul ve focus ver
        const firstElement = focusableElements[0] as HTMLElement;

        // Eğer element görünür ve erişilebilirse focus ver
        if (firstElement && firstElement.offsetParent !== null) {
          firstElement.focus();
        }
      }
    }, 100);

    // Cleanup: Modal kapandığında önceki focus'u restore et
    return () => {
      clearTimeout(focusTimeout);

      // Önceki elementi restore et
      if (previousActiveElementRef.current &&
          typeof previousActiveElementRef.current.focus === 'function') {
        try {
          previousActiveElementRef.current.focus();
        } catch (e) {
          // Element artık DOM'da yoksa sessizce hata görmezden gel
          console.debug('Could not restore focus to previous element');
        }
      }
    };
  }, []);
}
