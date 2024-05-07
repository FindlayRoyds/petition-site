import * as React from "react";
import {useStyletron} from "baseui";
import {useAppStore} from "../store";

export default () => {
    const [css, theme] = useStyletron()
    const themeStore = useAppStore(state => state.theme)

    return (
        <button className={css({backgroundColor: "transparent", border: "0px solid black", cursor: "pointer"})}>
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