export type OrderSide = 'buy' | 'sell';

export interface IInputRow {
    id: number;
    profit: number;
    tradePrice: number;
    amountToSell: number;
    errors?: {
        profit?: string;
        tradePrice?: string;
        amountToSell?: string;
    };
}