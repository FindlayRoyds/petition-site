import * as React from "react";
import {Button} from "baseui/button";
import {useStyletron} from "baseui";
import { Block } from "baseui/block"
import {Combobox} from 'baseui/combobox';
import {useNavigate, useSearchParams} from 'react-router-dom'

type SortOptionT = {label: string; id: string};
const sortByOptions: SortOptionT[] = [
    {label: 'Alphabetical asc', id: 'ALPHABETICAL_ASC'},
    {label: 'Alphabetical desc', id: 'ALPHABETICAL_DESC'},
    {label: 'Cost asc', id: 'COST_ASC'},
    {label: 'Cost desc', id: 'COST_DESC'},
    {label: 'Date created asc', id: 'CREATED_ASC'},
    {label: 'Date created desc', id: 'CREATED_DESC'},
];

export default function SearchBar() {
    const [searchParams] = useSearchParams()
    const sortByParam = searchParams.get('sortBy')
    const searchTerm = searchParams.get('searchTerm')
    const [sortBy, setSortBy] = React.useState(sortByParam || "")
    const [css, theme] = useStyletron()
    const navigate = useNavigate()

    const handleSortByChange = (inputValue: string, option: SortOptionT | null) => {
        if (option === null || sortByOptions.some(o => o.label === inputValue)) {
            setSortBy(option ? option.id : "")
        } else {
            setSortBy(sortByOptions.find(o => o.id === sortBy)?.id || "")
        }
    }

    const generateSearchUrl = (params: {[key: string]: string | null}) => {
        const searchParams = new URLSearchParams();

        for (const key in params) {
            if (params[key] !== null && params[key] !== "") {
                searchParams.append(key, params[key] as string);
            }
        }

        return `/search?${searchParams.toString()}`;
    }

    const apply = () => {
        navigate(generateSearchUrl({ searchTerm, sortBy }));
    }

    return (
        <Block
            style={{
                padding: "16px",
                width: "250px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center", // Center the children horizontally
                margin: "0 auto", // Center the block horizontally
            }}
        >
            <Combobox
                value={sortByOptions.find(o => o.id === sortBy)?.label || ""}
                onChange={handleSortByChange}
                mapOptionToString={(o) => o.label}
                options={sortByOptions}
                name="input-overrides"
                clearable
                overrides={{
                    Root: {
                        style: {
                            width: "100%",
                        }
                    },
                    Input: {
                        props: {
                            placeholder: "Sort by",
                            onKeyDown: (e: { preventDefault: () => void; }) => {
                                e.preventDefault();
                            }
                        }
                    },
                    ListBox: {
                        style: ({ $theme }) => ({
                            borderRadius: "12px",
                            paddingRight: "12px",
                            paddingLeft: "12px",
                        })
                    },
                    ListItem: {
                        style: ({ $theme }) => ({
                            borderBottom: `${$theme.colors.backgroundTertiary} solid 0.5px`,
                        })
                    }
                }}
            />
            <Button
                style={{ width: "80%" }}
                onClick={() => {
                    apply()
                }}
            >
                Apply
            </Button>
        </Block>
    )
}