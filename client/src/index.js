import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App/App';
import './index.css';
import { Provider } from './Context/UserContext';


const ele = document.getElementById('root');
const root = ReactDOM.createRoot(ele);

root.render(
    <Provider>
        <App />
    </Provider>
)
