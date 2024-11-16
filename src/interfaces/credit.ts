export interface CreditData {
  action: string;
  amount: number;
  description: string;
  user_id: string;
}

export interface Credit extends CreditData {
  id: string;
}
