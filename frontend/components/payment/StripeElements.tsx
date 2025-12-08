"use client";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface StripeCardFormProps {
  onPaymentMethodReady: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

function StripeCardForm({ onPaymentMethodReady, onError, disabled }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  // Auto-create payment method when card is complete
  useEffect(() => {
    if (!stripe || !elements || disabled) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const handleChange = async (event: any) => {
      if (event.complete && !event.error) {
        try {
          const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
          });

          if (pmError) {
            setError(pmError.message || "Failed to create payment method");
            onError(pmError.message || "Failed to create payment method");
            return;
          }

          if (paymentMethod) {
            setError(null);
            onPaymentMethodReady(paymentMethod.id);
          }
        } catch (err: any) {
          const errorMessage = err.message || "An error occurred";
          setError(errorMessage);
          onError(errorMessage);
        }
      } else if (event.error) {
        setError(event.error.message);
        onError(event.error.message);
      } else {
        setError(null);
      }
    };

    cardElement.on("change", handleChange);

    return () => {
      cardElement.off("change", handleChange);
    };
  }, [stripe, elements, disabled, onPaymentMethodReady, onError]);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "10px",
        color: "#ffffff",
        "::placeholder": {
          color: "#64748b",
        },
        fontFamily: "system-ui, sans-serif",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className={`p-2.5 sm:p-3 rounded-lg border bg-white/5 transition-all ${
          error ? "border-red-500/50" : "border-white/10"
        }`}>
          <CardElement options={cardElementOptions} />
        </div>
        {error && (
          <p className="text-[7px] sm:text-[8px] text-red-400 mt-1 flex items-center gap-0.5">
            {error}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 text-[7px] sm:text-[8px] text-slate-400">
        <Lock className="w-2.5 h-2.5" />
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}

interface StripeElementsWrapperProps {
  clientSecret?: string;
  onPaymentMethodReady: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function StripeElementsWrapper({
  clientSecret,
  onPaymentMethodReady,
  onError,
  disabled,
}: StripeElementsWrapperProps) {
  const options: StripeElementsOptions = {
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#06b6d4",
        colorBackground: "#0a0a0a",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/10">
        <p className="text-[8px] sm:text-[9px] text-amber-400">
          Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeCardForm
        onPaymentMethodReady={onPaymentMethodReady}
        onError={onError}
        disabled={disabled}
      />
    </Elements>
  );
}

// Export function to create payment method (can be called from parent)
export function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();

  const createPaymentMethod = async (): Promise<string | null> => {
    if (!stripe || !elements) {
      throw new Error("Stripe not initialized");
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      throw new Error("Card element not found");
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      throw new Error(error.message);
    }

    return paymentMethod?.id || null;
  };

  return { createPaymentMethod, stripe, elements };
}

