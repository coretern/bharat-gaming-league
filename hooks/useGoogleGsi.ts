'use client';

import { useEffect, useState, useRef } from 'react';
import { signIn } from 'next-auth/react';

interface UseGoogleGsiProps {
  callbackUrl: string;
  mode: string;
  setSuccessMessage: (msg: string) => void;
  loginHintEmail?: string;
}

export function useGoogleGsi({ callbackUrl, mode, setSuccessMessage, loginHintEmail }: UseGoogleGsiProps) {
  const [gsiInitialized, setGsiInitialized] = useState(false);
  const promptedRef = useRef(false);

  // Reset the prompted flag when mode changes back to login
  useEffect(() => {
    if (mode !== 'login') {
      promptedRef.current = false;
    }
  }, [mode]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Google Client ID is missing. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment.');
      return;
    }

    const initGsi = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        const initOpts: any = {
          client_id: clientId,
          callback: async (response: any) => {
            try {
              const res = await signIn('credentials', {
                idToken: response.credential,
                callbackUrl,
                redirect: false,
              });
              if (res?.error) {
                console.error('Google ID Token auth failed:', res.error);
              } else {
                setSuccessMessage('Successfully signed in with Google!');
                window.location.href = callbackUrl;
              }
            } catch (err) {
              console.error('Google auth callback error:', err);
            }
          },
          auto_select: false,
        };

        if (loginHintEmail && loginHintEmail.includes('@') && loginHintEmail.includes('.')) {
          initOpts.login_hint = loginHintEmail.toLowerCase().trim();
        }

        (window as any).google.accounts.id.initialize(initOpts);

        // Render the official Google personalized button with dynamic width
        const btnContainer = document.getElementById('google-signin-btn');
        if (btnContainer && (mode === 'login' || mode === 'signup')) {
          // Calculate width dynamically based on container for full responsiveness
          const containerWidth = btnContainer.parentElement?.offsetWidth || btnContainer.offsetWidth;
          const buttonWidth = Math.min(Math.max(containerWidth - 4, 200), 400);

          (window as any).google.accounts.id.renderButton(btnContainer, {
            theme: 'filled_blue',
            size: 'large',
            width: buttonWidth,
            text: 'continue_with',
            shape: 'pill',
          });
        }
        setGsiInitialized(true);
      }
    };

    let intervalId: any;
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      initGsi();
    } else {
      intervalId = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          initGsi();
          clearInterval(intervalId);
        }
      }, 150);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mode, callbackUrl, setSuccessMessage, loginHintEmail]);

  return gsiInitialized;
}
