import * as React from "react"
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {useAppStore} from "../store"
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

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
            <div className={css({width: "30px", backgroundColor: "red"})}>left</div>
            <div className={css({margin: "auto"})}>
                <SearchBar/>
            </div>
            <div className={css({
                marginLeft: "auto",
                display: "flex",
                flexDirection: "row",
            })}>
                <ThemeToggle/>
                <ThemeToggle/>
            </div>
        </div>
    );
}

// <div className={css({width:"300px", backgroundColor:"blue"})}>middle</div>