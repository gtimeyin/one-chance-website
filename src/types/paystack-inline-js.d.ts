declare module "@paystack/inline-js" {
  interface NewTransactionOptions {
    key: string;
    email: string;
    amount: number;            // minor units (kobo for NGN)
    currency?: string;          // e.g. "NGN", "USD", "KES"
    reference?: string;
    metadata?: Record<string, unknown>;
    channels?: string[];        // ['card', 'bank', 'ussd', ...]
    onSuccess?: (transaction: PaystackTransactionResult) => void;
    onCancel?: () => void;
    onLoad?: () => void;
    onError?: (error: { message?: string }) => void;
  }

  interface PaystackTransactionResult {
    reference: string;
    trans?: string;
    status?: string;
    message?: string;
    transaction?: string;
    trxref?: string;
    redirecturl?: string;
  }

  export default class PaystackPop {
    newTransaction(options: NewTransactionOptions): void;
    resumeTransaction(accessCode: string, callbacks?: Partial<NewTransactionOptions>): void;
    cancelTransaction(): void;
  }
}
