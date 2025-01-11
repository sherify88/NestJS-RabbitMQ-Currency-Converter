export interface ICreateTransaction {
    sourceCurrency: string;
    targetCurrency: string;
    amount: number;
    convertedAmount: number;
    userId: string;
    requestId: string;
}