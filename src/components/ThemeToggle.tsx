import * as React from "react";
import { Button, SHAPE, KIND, SIZE } from "baseui/button";
import { ButtonGroup } from "baseui/button-group";
import { Show } from "baseui/icon";
import {useAppStore} from "../store";
import {DarkTheme, LightTheme} from "baseui";

export default () => {
    const themeStore = useAppStore(state => state.theme)
    const setTheme = useAppStore(state => state.setTheme)

    const switchTheme = () => {
        console.log(themeStore)
        if (themeStore.name == "dark-theme") {
            setTheme(LightTheme)
        } else {
            setTheme(DarkTheme)
        }
    }

    return (
        <Button shape={SHAPE.square} size={SIZE.compact} kind={KIND.tertiary} onClick={switchTheme}>
            <Show size={24}/>
        </Button>
    )
}