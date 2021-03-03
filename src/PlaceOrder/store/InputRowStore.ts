import {
    action,
    computed,
    observable
} from 'mobx';
import { store } from 'src/PlaceOrder/context';
import { IInputRow } from 'src/PlaceOrder/model';

export class InputRowStore {
    @observable profit: number;
    @observable amountToSell: number;
    @observable id: number;
    @observable errors: {
        [key: string]: string
    };

    @computed get tradePrice(): number {
        return store.price + store.price * (this.profit / 100);
    }

    constructor(profit: number, amountToSell: number = 100) {
        this.profit = profit;
        this.amountToSell = amountToSell;
        this.id = Date.now();
    }

    @action.bound
    public saveProfit = (row: IInputRow) => (value: number) => {
        row.profit = value;
    }

    @action.bound
    public saveTradePrice= (row: IInputRow) => (value: number) => {
        row.profit = store.price ? (value - store.price) / store.price * 100 : 0;
    }
}