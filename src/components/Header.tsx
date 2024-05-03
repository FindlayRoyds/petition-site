import * as React from "react";
import { StyledDivider, SIZE } from "baseui/divider";
import {useStyletron} from "baseui";

export default () => {
    const [css, theme] = useStyletron();
    return (
        <div>
            <div
                className={css({
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "65px",
                    width: "100%",
                    borderBottom: `${theme.borders.border300.borderWidth} ${theme.borders.border300.borderStyle} ${theme.borders.border300.borderColor}`
                })}>
                <div
                    className={css({
                        height: "20px",
                        width: "20px",
                        backgroundColor: "red"
                    })}
                ></div>
            </div>
        </div>
    );
}