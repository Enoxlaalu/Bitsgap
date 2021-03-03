import * as React from 'react';
import { NumberInput } from 'src/components';
import { QUOTE_CURRENCY } from 'src/PlaceOrder/constants';
import { Cancel } from '@material-ui/icons';
import block
    from 'bem-cn-lite';
import {
    useStore
} from 'src/PlaceOrder/context';
import { observer } from 'mobx-react';
import { IInputRow } from 'src/PlaceOrder/model';

const b = block('take-profit');

type Props = {
    row: IInputRow
}

const InputRow = observer(({ row }: Props) => {
    const {
        activeOrderSide,
        price,
        deleteInput
    } = useStore();
    const { profit, tradePrice, amountToSell } = row;

    const saveProfit = (value) => {
        row.profit = value;
    };

    const saveAmountToSell = (value) => {
        row.amountToSell = value;
    };

    const saveTradePrice = (value) => {
        row.profit = price ? (value - price) / price * 100 : 0;
    };

    function renderInputs() {
        return (
            <div className={b('inputs')}>
                <NumberInput
                    value={profit}
                    decimalScale={2}
                    InputProps={{ endAdornment: '%' }}
                    variant="underlined"
                    onBlur={saveProfit}
                    error={row.errors?.profit}
                />
                <NumberInput
                    value={tradePrice}
                    decimalScale={2}
                    InputProps={{ endAdornment: QUOTE_CURRENCY }}
                    variant="underlined"
                    onBlur={saveTradePrice}
                    error={row.errors?.tradePrice}
                />
                <NumberInput
                    value={amountToSell}
                    decimalScale={2}
                    InputProps={{ endAdornment: '%' }}
                    variant="underlined"
                    onBlur={saveAmountToSell}
                    error={row.errors?.amountToSell}
                />
                <div
                    className={b('cancel-icon')}
                    onClick={deleteInput(row.id)}
                >
                    <Cancel />
                </div>
            </div>
        );
    }

    function renderTitles() {
        return (
            <div className={b('titles')}>
                <span>Profit</span>
                <span>Trade price</span>
                <span>Amount to {activeOrderSide === 'buy' ? 'sell' : 'buy'}</span>
            </div>
        );
    }

    return (
        <>
            {renderTitles()}
            {renderInputs()}
        </>
    );
});

export default InputRow;