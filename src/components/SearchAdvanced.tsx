import * as React from "react";
import {Search, ChevronDown} from "baseui/icon";
import { Input } from "baseui/input";
import {Button, KIND, SIZE} from "baseui/button";
import {useStyletron} from "baseui";
import { useNavigate } from 'react-router-dom'
import { LabelMedium } from "baseui/typography";
import { Popover, PLACEMENT } from "baseui/popover";
import { Block } from "baseui/block"
import {Combobox} from 'baseui/combobox';
import {FormControl} from 'baseui/form-control';
import { useSearchParams } from 'react-router-dom'


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
    const [sortBy, setSortBy] = React.useState(sortByParam || "")
    const [css, theme] = useStyletron()

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
                value={sortBy}
                onChange={setSortBy}
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
            <Button style={{ width: "80%" }}>Apply</Button>
        </Block>
    )
}