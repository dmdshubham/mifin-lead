import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "@mifin/redux/store";
import { PersistGate } from "redux-persist/integration/react";

interface storeProviderProps {
  children: ReactNode;
}

const StoreProvider: FC<storeProviderProps> = props => {
  const { children } = props;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
