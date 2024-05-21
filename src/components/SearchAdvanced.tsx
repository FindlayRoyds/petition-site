import * as React from "react";
import {Button, KIND} from "baseui/button";
import {useStyletron} from "baseui";
import { Block } from "baseui/block"
import {Combobox} from 'baseui/combobox';
import {useNavigate, useSearchParams} from 'react-router-dom'
import { Slider } from "baseui/slider";
import { Select } from "baseui/select";
import { Petition, Category } from '../types' // Import the Petition type
import axios from 'axios'


type SortOptionT = {label: string; id: string};
const sortByOptions: SortOptionT[] = [
    {label: 'Alphabetical asc', id: 'ALPHABETICAL_ASC'},
    {label: 'Alphabetical desc', id: 'ALPHABETICAL_DESC'},
    {label: 'Cost asc', id: 'COST_ASC'},
    {label: 'Cost desc', id: 'COST_DESC'},
    {label: 'Date created asc', id: 'CREATED_ASC'},
    {label: 'Date created desc', id: 'CREATED_DESC'},
];

type CategoryItem = {
    id: string;
    label: string
  };

export default function SearchBar() {
    const [searchParams] = useSearchParams()
    const sortByParam = searchParams.get('sortBy')
    const searchTermParam = searchParams.get('searchTerm')
    const minCostParam = searchParams.get('minCost')
    const categoryIdsParam = searchParams.getAll('categoryIds')
    const [sortBy, setSortBy] = React.useState(sortByParam || "")
    const [minCost, setMinCost] = React.useState(minCostParam? Number(minCostParam) : 100);
    const [selectedCategories, setSelectedCategories] = React.useState<CategoryItem[]>([]);
    const [prevCategoryIdsParam, setPrevCategoryIdsParam] = React.useState([""]);
    const [css, theme] = useStyletron()
    const navigate = useNavigate()

    const [categories, setCategories] = React.useState<Category[]>([])


    const handleSortByChange = (inputValue: string, option: SortOptionT | null) => {
        if (option === null || sortByOptions.some(o => o.label === inputValue)) {
            setSortBy(option ? option.id : "")
        } else {
            setSortBy(sortByOptions.find(o => o.id === sortBy)?.id || "")
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
    
    const apply = () => {
        const minCostVal = minCost == 100? "" : minCost.toString()
        const valueIds = selectedCategories.map(v => v.id.toString());
        navigate(generateSearchUrl({ searchTerm: searchTermParam, sortBy, minCost: minCostVal, categoryIds: valueIds }));
    }

    const getCategories = () => {
        let apiRequest = "http://localhost:4941/api/v1/petitions/categories"
        axios.get(apiRequest)
        .then((response) => {
            const updatedData = response.data.map((item: { categoryId: any; name: any; }) => ({
                id: String(item.categoryId),
                label: item.name,
            }));
            setCategories(updatedData);
    
            const selected = updatedData.filter((category: { id: string; }) => categoryIdsParam?.includes(category.id));
            setSelectedCategories(selected);
        }, (error) => {
            console.log("error :(")
        })
    }
    
    React.useEffect(() => {
        if (JSON.stringify(prevCategoryIdsParam) !== JSON.stringify(categoryIdsParam)) {
            console.log(categoryIdsParam)
            getCategories()
            setPrevCategoryIdsParam(categoryIdsParam);
        }
    }, [categoryIdsParam, prevCategoryIdsParam])

    return (
        <Block
            style={{
                padding: "16px",
                width: "450px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
                margin: "0 auto",
            }}
        >
            <div className={css({textAlign: "left", width:"100%"})}>Sort by</div>
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
                            placeholder: "Select Option",
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

            <div className={css({textAlign: "left", width:"100%"})}>Maximum Cost</div>
            <Slider
                value={[minCost]}
                onChange={({ value }) => value && setMinCost(value[0])}
                onFinalChange={({ value }) => console.log(value)}
                min={0}
                step={1}
                valueToLabel={value => {
                    return value == 100 ? "Any" : value == 0? "Free" : "$" + value;
                }}
                overrides={{
                    InnerTrack: {
                        style: ({ $theme }) => ({
                            height: "6px",
                            borderRadius: "4px"
                        }),
                    },
                }}
            />

            <div className={css({textAlign: "left", width:"100%"})}>Categories</div>
            <Select
                overrides={{
                    ControlContainer: {
                      style: ({ $theme }) => ({
                        cursor: "pointer"
                      })
                    }
                }}
                options={categories.sort((a, b) => a.name?.localeCompare(b.name))}
                value={selectedCategories}
                multi
                placeholder="Select Option"
                onChange={params => setSelectedCategories(params.value as CategoryItem[])}
                searchable={false}
            />

            <div className={css({ display: "flex", flexDirection: "row", width: "100%", columnGap: "12px", boxSizing: 'border-box' })}>
                <Button
                    style={{ marginTop: "16px", width: "100%" }}
                    onClick={() => {
                        apply()
                    }}
                >
                    Apply
                </Button>
                <Button
                    style={{ marginTop: "16px", width: "50%" }}
                    kind={KIND.secondary}
                    onClick={() => {
                        setSortBy("")
                        setMinCost(100)
                        setSelectedCategories([])
                        navigate(searchTermParam==null? "/search" : `/search?searchTerm=${searchTermParam}`)
                    }}
                    overrides={{
                        BaseButton: {
                            style: ({ $theme }) => ({
                                border: `${$theme.colors.primary} solid 3px`
                            })
                        }
                    }}
                >
                    Clear
                </Button>
            </div>


        </Block>
    )
}