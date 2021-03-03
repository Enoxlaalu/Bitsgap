import * as React from 'react';

import { PlaceOrderStore } from './store/PlaceOrderStore';

export const store = new PlaceOrderStore();

const storeContext = React.createContext(store);

const useStore = () => {
    return React.useContext(storeContext);
};

const StoreProvider: React.FC = ({ children }) => (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
);

export { useStore, StoreProvider };
