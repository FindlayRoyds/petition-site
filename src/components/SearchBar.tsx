import * as React from "react";
import {Search, Show, ChevronDown} from "baseui/icon";
import { Input } from "baseui/input";
import {Button, KIND, SHAPE, SIZE} from "baseui/button";
import {useStyletron} from "baseui";

export default function SearchBar() {
    const [css, theme] = useStyletron()
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className={css({width: isFocused ? '700px' : '300px', transition: `width ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}`})}>
            <Input
                onFocus={handleFocus}
                onBlur={handleBlur}
                overrides={{
                    Root: {
                        style: () => ({
                            paddingRight: "0px"
                        }),
                    },
                    Input: {
                        style: () => ({
                            paddingRight: "0px",
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }),
                    },
                }}
                endEnhancer={
                <>
                    <div className={`${css({
                        backgroundColor: "transparent",
                        border: "0px solid black",
                        cursor: "pointer",
                        width: isFocused ? "100px" : 0,
                        transition: "width 0.5s ease-out, opacity 0.5s ease-out",
                    })} fade ${isFocused ? 'show' : ''}`}>
                        <Button kind={KIND.tertiary} size={SIZE.compact} overrides={{
                            BaseButton: {
                                style: () => ({
                                    height: '80%',
                                    whiteSpace: 'nowrap'
                                }),
                            },
                        }}
                        endEnhancer={() => <ChevronDown title="" />}>Advanced</Button>
                    </div>
                    <button
                        className={css({backgroundColor: "transparent", border: "0px solid black", cursor: "pointer"})}
                        onClick={() => {
                            console.log("search pressed")}}>
                        <Search size={24} $color={theme.colors.primary}/>
                    </button>
                </>
                }
                placeholder={isFocused ? "" : "Search petitions"}

            />
        </div>
    );
}