import { create } from 'zustand'
import { LightTheme } from "baseui"

interface PersistentStorage {
    theme: any
    setTheme: (theme: any) => void
}

interface TemporaryStorage {
    test: boolean
    setTest: (test: boolean) => void
}

const getLocalStorage = (key: any): string => JSON.parse(window.localStorage.getItem(key) as any)
const setLocalStorage = (key: any, value:string) => window.localStorage.setItem(key, JSON.stringify(value))

export const usePersistentStore = create<PersistentStorage>((set) => ({
    theme: getLocalStorage('theme') || LightTheme,
    setTheme: (theme: any) => set(() => {
        setLocalStorage('theme', theme)
        return {theme: theme}
    }),
}))

export const useTemporaryStore = create<TemporaryStorage>((set) => ({
    test: false,
    setTest: (test: boolean) => set(() => {
        return { test }
    }),
}))