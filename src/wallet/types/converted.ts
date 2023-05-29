export interface IResConvertCurrency {
  old_amount: number;
  old_currency: string;
  new_currency: string;
  new_amount: number;
  error?: string;
}
