import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-monolithic";
import { LightTheme, DarkTheme, BaseProvider } from "baseui";
import App from './App';
import {useAppStore} from "./store";

const engine = new Styletron();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <StyletronProvider value={engine}>
        <BaseProvider theme={DarkTheme}>
            <App />
        </BaseProvider>
    </StyletronProvider>,
);
