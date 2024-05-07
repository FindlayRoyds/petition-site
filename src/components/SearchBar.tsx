import * as React from "react";
import {Search, ChevronDown} from "baseui/icon";
import { Input } from "baseui/input";
import {Button, KIND, SIZE} from "baseui/button";
import {useStyletron} from "baseui";
import {
    ParagraphLarge,
    ParagraphMedium,
    ParagraphSmall,
    ParagraphXSmall,
    LabelLarge,
    LabelMedium,
    LabelSmall,
    LabelXSmall,
} from "baseui/typography";
import { StatefulPopover } from "baseui/popover";
import { Block } from "baseui/block";

export default function SearchBar() {
    const [css, theme] = useStyletron()
    const [isFocused, setIsFocused] = React.useState(false);
    const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        if (!isAdvancedOpen) {
            setIsFocused(false)
        }
    }
    const updateAdvancedOpen = (open: boolean) => {
        setIsAdvancedOpen(open)
        if (open) {
            setIsFocused(true)
        } else {
            setIsFocused(false)
        }
    }

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
                        width: isFocused ? "115px" : 0,
                        transition: `opacity ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}, width ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}`,
                        opacity: isFocused ? 1 : 0,
                        overflow: 'hidden',
                        
                    })} fade ${isFocused ? 'show' : ''}`}>
                        <StatefulPopover
                            content={() => (
                                <Block padding={"20px"}>
                                    Hello, there! 👋
                                    <Input placeholder="Focusable Element" />
                                </Block>
                            )}
                            returnFocus
                            autoFocus
                            onOpen={() => updateAdvancedOpen(true)}
                            onClose={() => updateAdvancedOpen(false)}
                        >
                            <Button kind={KIND.tertiary} size={SIZE.compact} overrides={{
                                BaseButton: {
                                    style: () => ({
                                        height: '80%',
                                        whiteSpace: 'nowrap'
                                    }),
                                },
                            }}
                            endEnhancer={() => <ChevronDown title="" />}>
                                <LabelMedium>Advanced</LabelMedium>
                            </Button>
                        </StatefulPopover>
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