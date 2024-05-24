import * as React from "react";
import {useStyletron} from "baseui";
import {usePersistentStore} from "../store";
import { useNavigate } from 'react-router-dom'

export default () => {
    const [css, theme] = useStyletron()
    const themeStore = usePersistentStore(state => state.theme)
    const navigate = useNavigate()
    const user = usePersistentStore(state => state.user)

    return (
        <button className={css({backgroundColor: "transparent", border: "0px solid black", cursor: "pointer"})}
            onClick={() => {navigate(user == null? `/` : "/petitions")}}
        >
            <img src="/Logo.svg" className={css({
                height: theme.sizing.scale950,
                objectFit: "fill",
                preserveAspectRatio: "none",
                filter: themeStore.name == "dark-theme"? "invert(0%)" : "invert(100%)",
                transition: `filter ${theme.animation.timing600} ${theme.animation.easeOutCurve}`
            })}></img>
        </button>
    )
}