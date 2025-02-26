export interface Transaction {
    id: number | null;
    amount: number;
    category: string;
    currency: string;
    date: string;
    description: string;
    merchant: string;
    type: string;
}