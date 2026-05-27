import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export type PasswordStep = 'idle' | 'otp' | 'password';

export function useProfilePassword(onSuccess: () => void) {
  const [step, setStep] = useState<PasswordStep>('idle');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const requestOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      toast.success('Verification code sent to your email!');
      setStep('otp');
      setCooldown(60);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndSetPassword = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP verification code');
      return;
    }
    if (!password || !confirmPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set-password',
          otp: otp.trim(),
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to configure password');

      toast.success('Login password successfully created!');
      setStep('idle');
      setOtp('');
      setPassword('');
      setConfirmPassword('');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('idle');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  return {
    step,
    setStep,
    otp,
    setOtp,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    cooldown,
    requestOtp,
    verifyAndSetPassword,
    resetForm,
  };
}
