import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Google Maps Platform runtime error & quota interception
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-auth-failure'));
};

const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  } else if (msg.includes('RefererNotAllowedMapError')) {
    window.dispatchEvent(new CustomEvent('gmp-referer-error'));
  } else if (msg.includes('ApiNotActivatedMapError')) {
    window.dispatchEvent(new CustomEvent('gmp-api-not-activated'));
  } else if (msg.includes('InvalidKeyMapError')) {
    window.dispatchEvent(new CustomEvent('gmp-invalid-key'));
  } else if (msg.includes('BillingNotEnabledMapError')) {
    window.dispatchEvent(new CustomEvent('gmp-billing-error'));
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
