import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider as StyletronProvider } from "styletron-react"
import { Client as Styletron } from "styletron-engine-monolithic"
import {LightTheme, DarkTheme, BaseProvider, useStyletron} from "baseui"
import App from './App'
import {usePersistentStore} from "./store"

const engine = new Styletron()
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const RootComponent: React.FC = () => {
    const [css] = useStyletron()
    const theme = usePersistentStore(state => state.theme)

    return (
        <BaseProvider theme={theme}>
            <div className={css({height:"100vh", width:"100vw", backgroundColor:`${theme.colors.backgroundPrimary}`})}>
                <App/>
            </div>
        </BaseProvider>
    )
}

root.render(
    <StyletronProvider value={engine}>
            <RootComponent />
    </StyletronProvider>
)
