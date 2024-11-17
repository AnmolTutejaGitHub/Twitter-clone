import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App/App';
import './index.css';
import { Provider as UserContextProvider } from './Context/UserContext';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

const ele = document.getElementById('root');
const root = ReactDOM.createRoot(ele);

root.render(
    <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <UserContextProvider>
                <App />
            </UserContextProvider>
        </PersistGate>
    </ReduxProvider>
);