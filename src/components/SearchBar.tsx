import * as React from "react";
import {Search, ChevronDown, ChevronUp} from "baseui/icon";
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
    const [searchParams] = useSearchParams()
    const sortBy = searchParams.get('sortBy')
    const minCost = searchParams.get('minCost')
    const searchTermParam = searchParams.get('searchTerm')
    const categoryIds = searchParams.getAll('categoryIds')
    const [searchTerm, setSearchTerm] = React.useState(searchTermParam || "")
    const [isAdvancedShown, setIsAdvancedShown] = React.useState(sortBy !== null)
    const [isFocused, setIsFocused] = React.useState(false)
    const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false)

    const inputRef = React.useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => {
        if (!isAdvancedOpen) {
            setIsFocused(false)
        }
    }

    const generateSearchUrl = (params: {[key: string]: string | string[] | null}) => {
        const searchParams = new URLSearchParams();
    
        for (const key in params) {
            if (params[key] !== null && params[key] !== "") {
                if (Array.isArray(params[key])) {
                    (params[key] as string[]).forEach(value => {
                        searchParams.append(key, value);
                    });
                } else {
                    searchParams.append(key, params[key] as string);
                }
            }
        }
    
        return `/search?${searchParams.toString()}`;
    }

    const search = () => {
        navigate(generateSearchUrl({ searchTerm, sortBy, minCost, categoryIds}));
    }

    const updateSearchValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(event.target.value)
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

    React.useEffect(() => {
        setIsAdvancedShown((sortBy !== null || minCost !== null || categoryIds.length != 0) || isFocused)
    }, [sortBy, isFocused, minCost])

    React.useEffect(() => {
        setSearchTerm(searchTermParam || "")
    }, [searchTermParam])

    return (
        <div className={css({width: isFocused ? '700px' : '350px', transition: `width ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}`})}>
            <Input
                inputRef={inputRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={updateSearchValue}
                value={searchTerm}
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
                        width: isAdvancedShown ? "115px" : 0,
                        transition: `opacity ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}, width ${theme.animation.timing500} ${theme.animation.easeOutQuinticCurve}`,
                        opacity: isAdvancedShown ? 1 : 0,
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
                            endEnhancer={() => isAdvancedOpen? <ChevronUp title="" /> : <ChevronDown title="" />}
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