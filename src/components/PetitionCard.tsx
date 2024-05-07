import * as React from "react";
import {useStyletron} from "baseui";
import {useAppStore} from "../store";

export default () => {
    const [css, theme] = useStyletron()
    const themeStore = useAppStore(state => state.theme)

    return (
        <div>
            hi
        </div>
    )
}