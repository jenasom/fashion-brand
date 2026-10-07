# Payment Provider Architecture

## 1. Provider Abstraction
To avoid coupling directly to Paystack, the payment layer defines a unified interface:

```typescript
export interface PaymentIntentOptions {
  amount: number; // in lowest currency unit (e.g. Kobo / Cents)
  currency: 'NGN' | 'USD' | 'EUR' | 'GBP';
  email: string;
  reference: string;
  metadata: {
    type: 'ORDER' | 'COURSE_ENROLLMENT' | 'TUTORING_BOOKING';
    targetId: string;
    userId?: string;
  };
  callbackUrl?: string;
}

export interface PaymentProvider {
  initializePayment(options: PaymentIntentOptions): Promise<{ authorizationUrl: string; accessCode: string; reference: string }>;
  verifyPayment(reference: string): Promise<{ isSuccessful: boolean; amount: number; reference: string; metadata: any }>;
  handleWebhook(signature: string, payload: any): Promise<{ handled: boolean; event: string; reference?: string }>;
}
```

## 2. Paystack Implementation
- Implements `PaymentProvider` interface.
- Calculates HMAC SHA-512 signature for inbound webhooks using the `PAYSTACK_SECRET_KEY`.
- Verifies transactions with the Paystack REST API (`/transaction/verify/:reference`).
- Built-in simulation / sandbox mode when keys are unset, enabling immediate testing with realistic payment authorization responses.
