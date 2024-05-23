import { create } from 'zustand'
import { LightTheme } from "baseui"
import {User} from "../types";

interface PersistentStorage {
    theme: any
    setTheme: (theme: any) => void
    // token: any
    // setToken: (token: any) => void
    // userId: any
    // setUserId: (userId: any) => void
    user: any
    setUser: (user: any) => void
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
    // token: getLocalStorage('token'),
    // setToken: (token: any) => set(() => {
    //     setLocalStorage('token', token)
    //     return {token: token}
    // }),
    // userId: getLocalStorage('userId'),
    // setUserId: (userId: any) => set(() => {
    //     setLocalStorage('userId', userId)
    //     return {userId: userId}
    // }),
    user: getLocalStorage('user') == "null" ? null : JSON.parse(getLocalStorage('user')) as User,
    setUser: (user: any) => set(() => {
        setLocalStorage('user', JSON.stringify(user))
        return {user: user}
    }),
}))

export const useTemporaryStore = create<TemporaryStorage>((set) => ({
    test: false,
    setTest: (test: boolean) => set(() => {
        return { test }
    }),
}))