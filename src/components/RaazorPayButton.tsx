import { useEffect, useRef, FC } from 'react';

const RazorpayButton: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content first
    containerRef.current.innerHTML = '';

    // Create form
    const form = document.createElement('form');

    // Create script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_QREtPITUQfuDsH');
    script.async = true;

    // Append script to form
    form.appendChild(script);

    // Append form to container
    containerRef.current.appendChild(form);

    // Cleanup when unmounted
    return () => {
      containerRef.current?.replaceChildren(); // Safer cleanup
    };
  }, []);

  return <div ref={containerRef} />;
};

export default RazorpayButton;
