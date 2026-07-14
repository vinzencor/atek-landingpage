import React, { useEffect, useState } from 'react';
import type ReCAPTCHAType from 'react-google-recaptcha';

interface ReCaptchaWrapperProps {
  sitekey: string;
  onChange: (token: string | null) => void;
  onExpired: () => void;
  onErrored: () => void;
  recaptchaRef: React.RefObject<ReCAPTCHAType>;
}

const ReCaptchaWrapper: React.FC<ReCaptchaWrapperProps> = ({
  sitekey,
  onChange,
  onExpired,
  onErrored,
  recaptchaRef,
}) => {
  const [ReCAPTCHA, setReCAPTCHA] = useState<typeof ReCAPTCHAType | null>(null);

  useEffect(() => {
    // Dynamically import ReCAPTCHA only on client side
    import('react-google-recaptcha').then((module) => {
      setReCAPTCHA(() => module.default);
    });
  }, []);

  if (!ReCAPTCHA) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse text-gray-500">Loading reCAPTCHA...</div>
      </div>
    );
  }

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={sitekey}
      onChange={onChange}
      onExpired={onExpired}
      onErrored={onErrored}
    />
  );
};

export default ReCaptchaWrapper;

