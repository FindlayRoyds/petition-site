import create from 'zustand';

interface AppState {
    theme: string;
    setTheme: (theme: string) => void;
}

const getLocalStorage = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value:string) => window.localStorage.setItem(key, value);

const useStore = create<AppState>((set) => ({
    theme: getLocalStorage('theme'),
    setTheme: (theme: string) => set(() => {
        setLocalStorage('theme', theme)
        return {theme: theme}
    }),
}))

export const useAppStore = useStore;