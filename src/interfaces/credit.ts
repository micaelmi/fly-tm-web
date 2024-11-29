export interface CreditData {
  action: string;
  amount: number;
  description: string;
  user_id: string;
}

export interface Credit extends CreditData {
  id: string;
}

export interface UserCredits {
  user: {
    credits: number;
    email: string;
  };
}

export interface PixPaymentRegisterData {
  amount: number;
  description: string;
  user_id: string;
}

export interface PixResponse {
  pix: {
    amount: number;
    creationDate: string;
    currency: string;
    expirationDate: string;
    id: number;
    qrCode: string;
    qrCodeBase64: string;
    status: string;
  };
}

export interface CreditTransactionResponse {
  creditTransactions: {
    id: string;
    action: string;
    amount: number;
    description: string;
    created_at: string;
    user_id: string;
  }[];
}
