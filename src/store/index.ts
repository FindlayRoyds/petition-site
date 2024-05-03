import create from 'zustand'
import {LightTheme} from "baseui"

interface AppState {
    theme: any
    setTheme: (theme: any) => void
}

const getLocalStorage = (key: any): string => JSON.parse(window.localStorage.getItem(key) as any)
const setLocalStorage = (key: any, value:string) => window.localStorage.setItem(key, JSON.stringify(value))

const useStore = create<AppState>((set) => ({
    theme: getLocalStorage('theme') || LightTheme,
    setTheme: (theme: any) => set(() => {
        setLocalStorage('theme', theme)
        return {theme: theme}
    }),
}))

export const useAppStore = useStore