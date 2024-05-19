import * as React from "react";
import {Search, ChevronDown} from "baseui/icon";
import { Input } from "baseui/input";
import {Button, KIND, SIZE} from "baseui/button";
import {useStyletron} from "baseui";
import { useNavigate } from 'react-router-dom'
import { LabelMedium } from "baseui/typography";
import { Popover, PLACEMENT } from "baseui/popover";
import { Block } from "baseui/block";
import { useSearchParams } from 'react-router-dom'
import SearchAdvanced from "./SearchAdvanced";

export default function SearchBar() {
    const [css, theme] = useStyletron()
    const [isFocused, setIsFocused] = React.useState(false)
    const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false)
    const [searchParams] = useSearchParams()
    const term = searchParams.get('term')
    const [sortBy, setSortBy] = React.useState('')
    const [searchValue, setSearchValue] = React.useState(term || "")

    const inputRef = React.useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => {
        if (!isAdvancedOpen) {
            setIsFocused(false)
        }
    }

    const search = () => {
        if (searchValue == "") {
            navigate(`/search`)
        } else {
            navigate(`/search?term=${searchValue}`)
        }
        
    }

    const updateSearchValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchValue(event.target.value)
    }
    const handleSearchKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            search()
        }
    }
    const handleSearchClick = () => {
        search()
    }

    const updateAdvancedOpen = (open: boolean, keepOpen: boolean) => {
        setIsAdvancedOpen(open)
        if (open) {
            setIsFocused(true)
        } else {
            if (!keepOpen) {
                setIsFocused(false)
            } else {
                setTimeout(() => inputRef.current?.focus(), 0)
            }
        }
    }

    return (
        <div className={css({width: isFocused ? '700px' : '300px', transition: `width ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}`})}>
            <Input
                inputRef={inputRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={updateSearchValue}
                value={searchValue}
                onKeyDown={handleSearchKeyDown}
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
                                <SearchAdvanced/>
                            )}
                            isOpen={isAdvancedOpen}
                            returnFocus
                            autoFocus
                            placement={PLACEMENT.bottomRight}
                            onClickOutside={() => {updateAdvancedOpen(false, false)}}
                            overrides={{
                                Inner: {
                                    style: ({ $theme }) => ({
                                    outline: `${$theme.colors.backgroundTertiary} solid 2px`,
                                    backgroundColor: $theme.colors.backgroundPrimary
                                    })
                                }
                            }}
                        >
                            <Button kind={KIND.tertiary} size={SIZE.compact} overrides={{
                                BaseButton: {
                                    style: () => ({
                                        height: '80%',
                                        whiteSpace: 'nowrap',
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
                        className={css({backgroundColor: "transparent", border: "0px solid black", cursor: "pointer"})}
                        onClick={handleSearchClick}>
                        <Search size={24} $color={theme.colors.primary}/>
                    </button>
                </>
                }
                placeholder={isFocused ? "" : "Search petitions"}
            />
        </div>
    );
}