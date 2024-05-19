import React, { useState } from 'react'
import PetitionCard from './PetitionCard'
import axios from 'axios'
import { Cell, Grid } from 'baseui/layout-grid'
import { Petition, Category } from '../types' // Import the Petition type
import { useStyletron } from "baseui"
import { useParams } from 'react-router-dom'
import { Pagination } from "baseui/pagination"
import { Button, KIND } from 'baseui/button'
import { ArrowDown, ArrowLeft, ChevronLeft, TriangleLeft, TriangleRight } from 'baseui/icon'
import { useSearchParams } from 'react-router-dom'


export default function PetitionCardList() {
    const [searchParams] = useSearchParams()
    const term = searchParams.get('term')
    const sortBy = searchParams.get('sort')
    const [css, theme] = useStyletron()

    const [petitions, setPetitions] = useState<Petition[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [currentPage, setCurrentPage] = React.useState(1)
    const [numberOfPages, setNumberOfPages] = React.useState(1)
    const numPetitionsPerPage = 8

    React.useEffect(() => {
        const getPetitions = () => {
            let apiRequest = "http://localhost:4941/api/v1/petitions"
            apiRequest += `?startIndex=${(currentPage - 1) * numPetitionsPerPage}`
            apiRequest += `&count=${numPetitionsPerPage}`
            if (term != null) {
                apiRequest += `&q=${term}`
            }
            if (sortBy != null) {
                apiRequest += `&sortBy=${sortBy}`
            }
            axios.get(apiRequest)
                .then((response) => {
                    setPetitions(response.data.petitions)
                    setNumberOfPages(Math.ceil(response.data.count / numPetitionsPerPage))
                }, (error) => {
                    console.log("error :(")
                })
        }
        const getCategories = () => {
            let apiRequest = "http://localhost:4941/api/v1/petitions/categories"
            axios.get(apiRequest)
                .then((response) => {
                    setCategories(response.data)
                }, (error) => {
                    console.log("error :(")
                })
        }
        getPetitions()
        getCategories()
    }, [setPetitions, term, currentPage])

    return (
        <div
            className={css({
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <div
                className={css({
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gridGap: theme.sizing.scale600,
                    padding: theme.sizing.scale600,
                    width: '100%',
                    boxSizing: 'border-box',
                })}
            >
                {petitions.map((petition: Petition, index: any) => {
                    const category = categories.find((category) => category.categoryId === petition.categoryId)
                    if (!category) {
                        return null
                    }
                    return (
                        <PetitionCard petition={petition} category={category} key={index} />
                    )
                })}
            </div>
            <div
                className={css({
                    width: "100%",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '24px',
                    columnGap: "12px"
                })}
            >
                <Button
                    startEnhancer={
                        <TriangleLeft size={24}/>
                    }
                    kind={KIND.tertiary}
                    disabled={ currentPage == 1 }
                    onClick={() => {
                        setCurrentPage(1)
                    }}
                >
                    Start
                </Button>
                <Pagination
                    numPages={numberOfPages}
                    currentPage={currentPage}
                    onPageChange={({ nextPage }) => {
                        setCurrentPage(
                            Math.min(Math.max(nextPage, 1), numberOfPages)
                        )
                    }}
                />
                <Button
                    endEnhancer={
                        <TriangleRight size={24}/>
                    }
                    kind={KIND.tertiary}
                    disabled={currentPage == numberOfPages}
                    onClick={() => {
                        setCurrentPage(numberOfPages)
                    }}
                >
                    End
                </Button>
            </div>
        </div>
    )
}