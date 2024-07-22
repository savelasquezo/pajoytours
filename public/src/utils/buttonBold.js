import { useEffect, useRef } from 'react';

const BoldButton = ({ invoice, amount, integritySignature }) => {
  const scriptRef = useRef(null);
  console.log("BOLD-INFO")
  console.log(invoice)
  console.log(amount)
  console.log(integritySignature)
  useEffect(() => {
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.setAttribute('data-bold-button', 'default');
      script.setAttribute('data-order-id', invoice);
      script.setAttribute('data-currency', 'COP');
      script.setAttribute('data-amount', amount);
      script.setAttribute('data-api-key', `${process.env.NEXT_PUBLIC_BOLD_PUBLIC_KEY}`);
      script.setAttribute('data-integrity-signature', integritySignature);
      script.setAttribute('data-notification-url', 'https://pajoytours.com/app/v1/manager/notify-invoice-bold/');
      script.setAttribute('data-redirection-url', 'https://pajoytours.com');
      const container = document.getElementById('button');
      container?.insertAdjacentElement('afterend', script);

      scriptRef.current = script;
    }

    return () => {
    };
  }, []);

  return (
    <div id="button"></div>
  );
};

export default BoldButton;
