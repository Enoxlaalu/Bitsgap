/* eslint @typescript-eslint/no-use-before-define: 0 */

import * as React from 'react';
import block from 'bem-cn-lite';
import { AddCircle } from '@material-ui/icons';

import { Switch, TextButton } from 'src/components';

import { QUOTE_CURRENCY } from '../../constants';
import './TakeProfit.scss';
import InputRow from 'src/PlaceOrder/components/InputRow/InputRow';
import { IInputRow } from 'src/PlaceOrder/model';

type Props = {
    inputRows: IInputRow[];
    addProfitTarget: () => void;
    takeProfitSwitch: boolean;
    toggleTakeProfitSwitch: (value: boolean) => void;
    getProjectedProfit: number;
};

const b = block('take-profit');

const TakeProfit = ({
    inputRows,
    addProfitTarget,
    takeProfitSwitch,
    toggleTakeProfitSwitch,
    getProjectedProfit
}: Props) => {
    return (
        <div className={b()}>
            <div className={b('switch')}>
                <span>Take profit</span>
                <Switch
                    checked={takeProfitSwitch}
                    onChange={toggleTakeProfitSwitch}
                />
            </div>
            {takeProfitSwitch && (
                <div className={b('content')}>
                    {inputRows.map((row) => {
                        return <InputRow key={row.id} row={row} />;
                    })}
                    {inputRows.length < 5 && (
                        <TextButton
                            className={b('add-button')}
                            onClick={addProfitTarget}
                        >
                            <AddCircle className={b('add-icon')} />
                            <span>Add profit target {inputRows.length}/5</span>
                        </TextButton>
                    )}
                    <div className={b('projected-profit')}>
                        <span className={b('projected-profit-title')}>
                            Projected profit
                        </span>
                        <span className={b('projected-profit-value')}>
                            <span>{getProjectedProfit.toFixed(2)}</span>
                            <span className={b('projected-profit-currency')}>
                                {QUOTE_CURRENCY}
                            </span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export { TakeProfit };
