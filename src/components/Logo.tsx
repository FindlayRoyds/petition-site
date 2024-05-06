import * as React from "react";
import {useStyletron} from "baseui";

export default () => {
    const [css, theme] = useStyletron()
    return (
        <button className={css({backgroundColor: "transparent", border: "0px solid black", cursor: "pointer"})}>
            <img src="/Logo.svg" className={css({height: "36px", filter: "invert(100%)"})}></img>
        </button>
    )
}