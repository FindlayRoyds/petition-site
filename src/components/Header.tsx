import * as React from "react"
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {useAppStore} from "../store"
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

export default () => {
    const [css, theme] = useStyletron()

    return (
        <div className={css({
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            height: "65px",
            width: "100%",
            paddingLeft: "25px",
            paddingRight: "25px",
            boxSizing: "border-box",
            borderBottom: `${theme.borders.border300.borderWidth} ${theme.borders.border300.borderStyle} ${theme.borders.border300.borderColor}`,
        })}>
            <div className={css({
                marginRight: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px"
            })}>
                <Logo/>
            </div>
            <div className={css({margin: "auto"})}></div>
            <div className={css({
                marginLeft: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px"
            })}>
                <SearchBar/>
                <ThemeToggle/>
            </div>
        </div>
    );
}

// <div className={css({width:"300px", backgroundColor:"blue"})}>middle</div>