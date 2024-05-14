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
import { Popover, PLACEMENT } from "baseui/popover";
import { Block } from "baseui/block";

export default function SearchBar() {
    const [css, theme] = useStyletron()
    const [isFocused, setIsFocused] = React.useState(false);
    const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        if (!isAdvancedOpen) {
            setIsFocused(false)
        }
    }
    const updateAdvancedOpen = (open: boolean, keepOpen: boolean) => {
        setIsAdvancedOpen(open)
        if (open) {
            setIsFocused(true)
        } else {
            if (!keepOpen) {
                setIsFocused(false)
            } else {
                setTimeout(() => inputRef.current?.focus(), 0);
            }
        }
    }

    return (
        <div className={css({width: isFocused ? '700px' : '300px', transition: `width ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}`})}>
            <Input
                inputRef={inputRef}
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
                        <Popover
                            content={() => (
                                <Input placeholder="Focusable Element" />
                            )}
                            isOpen={isAdvancedOpen}
                            returnFocus
                            autoFocus
                            placement={PLACEMENT.bottomRight}
                            onClickOutside={() => {updateAdvancedOpen(false, false)}}
                        >
                            <Button kind={KIND.tertiary} size={SIZE.compact} overrides={{
                                BaseButton: {
                                    style: () => ({
                                        height: '80%',
                                        whiteSpace: 'nowrap'
                                    }),
                                },
                            }}
                            endEnhancer={() => <ChevronDown title="" />}
                            onMouseDown={() => {updateAdvancedOpen(!isAdvancedOpen, true)}}>
                                <LabelMedium>Advanced</LabelMedium>
                            </Button>
                        </Popover>
                    </div>
                    <button
                        className={css({backgroundColor: "transparent", border: "0px solid black", cursor: "pointer"})}>
                        <Search size={24} $color={theme.colors.primary}/>
                    </button>
                </>
                }
                placeholder={isFocused ? "" : "Search petitions"}

            />
        </div>
    );
}