import { observable, computed, action } from 'mobx';

import {
    IInputRow,
    OrderSide
} from '../model';
import { InputRowStore } from 'src/PlaceOrder/store/InputRowStore';
import { SyntheticEvent } from 'react';

export class PlaceOrderStore {
    @observable activeOrderSide: OrderSide = 'buy';
    @observable price: number = 0;
    @observable amount: number = 0;

    @observable profit = 2;

    @computed get tradePrice() {
        return this.price + this.price * (this.profit / 100);
    }

    @observable inputRow = {
        profit: this.profit,
        tradePrice: this.tradePrice
    }

    @computed get newInputProfit() {
        return this.inputRows[this.inputRows.length - 1].profit + 2 || 2;
    }

    @observable inputRows: IInputRow[] = [new InputRowStore(2)];

    @computed get total(): number {
        return this.price * this.amount;
    }

    @action.bound
    public setOrderSide(side: OrderSide) {
        this.activeOrderSide = side;
    }

    @action.bound
    public setPrice(price: number) {
        this.price = price;
    }
    
    @action.bound
    public setAmount(amount: number) {
        this.amount = amount;
    }
    
    @action.bound
    public setTotal(total: number) {
        this.amount = this.price > 0 ? total / this.price : 0;
    }

    private setInputRows = (inputs: IInputRow[]) => (this.inputRows = inputs);

    private getPropertyArray(prop: string): number[] {
        return this.inputRows.map((i) => i[prop]);
    }

    private getPropertySum(prop: string): number {
        const amounts = this.getPropertyArray(prop);
        return amounts.reduce((prev, next) => prev + next, 0);
    }

    @computed get getInputWithMaxAmount(): IInputRow {
        return this.inputRows.reduce((prev, current) => {
            return prev.amountToSell > current.amountToSell ? prev : current;
        });
    }
    
    @action.bound
    public addProfitTarget() {
        const amountsSum = this.getPropertySum('amountToSell');
        if (amountsSum + 20 > 100) {
            const inputWithMaxAmount: IInputRow = this.getInputWithMaxAmount;

            inputWithMaxAmount.amountToSell =
                inputWithMaxAmount.amountToSell - (amountsSum + 20 - 100);
        }

        this.setInputRows([
            ...this.inputRows,
            new InputRowStore(this.newInputProfit, 20)
        ]);
    }

    @observable takeProfitSwitch: boolean = false;

    @action.bound
    public toggleTakeProfitSwitch = (value: boolean) => {
        if (!value) {
            this.setInputRows([new InputRowStore(2)]);
        }
        this.takeProfitSwitch = value;
    };

    @action.bound
    public deleteInput = (id: number) => () => {
        if (this.inputRows.length === 1) {
            this.toggleTakeProfitSwitch(false);
            return;
        }
        const newInputs = this.inputRows.filter((i) => i.id !== id);
        this.setInputRows(newInputs);
    };

    private getProjectedProfitForTarget(target: IInputRow): number {
        const { tradePrice, amountToSell } = target;

        return this.activeOrderSide === 'buy'
            ? (amountToSell / 100) * this.amount * (tradePrice - this.price)
            : (amountToSell / 100) * this.amount * (this.price - tradePrice);
    }

    @computed get getProjectedProfit(): number {
        return this.inputRows.reduce((prev, curr) => {
            return prev + this.getProjectedProfitForTarget(curr);
        }, 0);
    }

    @action.bound
    public submitForm(e: SyntheticEvent) {
        e.preventDefault();

        const newInputs = [...this.inputRows];
        const profitsSum = this.getPropertySum('profit');
        const amountsSum = this.getPropertySum('amountToSell');

        newInputs.forEach((input, i) => {
            input.errors = {};

            if (profitsSum > 500) {
                input.errors.profit = 'Maximum profit sum is 500%';
            }
            if (input.profit < 0.01) {
                input.errors.profit = 'Minimum value is 0.01';
            }
            if (i !== 0 && input.profit < this.inputRows[i - 1].profit) {
                input.errors.profit =
                    'Each target\'s profit should be greater than the previous one';
            }
            if (input.tradePrice <= 0) {
                input.errors.tradePrice = 'Price must be greater than 0';
            }
            if (amountsSum > 100) {
                input.errors.amountToSell = `${amountsSum}% out of 100% selected. Please decrease by ${
                    amountsSum - 100
                }%`;
            }
        });

        this.setInputRows(newInputs);
    }
}
