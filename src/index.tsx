import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider as StyletronProvider } from "styletron-react"
import { Client as Styletron } from "styletron-engine-monolithic"
import {LightTheme, DarkTheme, BaseProvider, useStyletron} from "baseui"
import App from './App'
import {usePersistentStore} from "./store"
import { useEffect } from 'react'

const engine = new Styletron()
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const RootComponent: React.FC = () => {
    const [css] = useStyletron()
    const theme = usePersistentStore(state => state.theme)

    useEffect(() => {
        // Set the background color of the body to the background color of the theme
        document.body.style.backgroundColor = theme.colors.backgroundPrimary
        console.log('hi')
    }, [theme])

    return (
        <BaseProvider theme={theme}>
                <App/>
        </BaseProvider>
    )
}

root.render(
    <StyletronProvider value={engine}>
            <RootComponent />
    </StyletronProvider>
)
