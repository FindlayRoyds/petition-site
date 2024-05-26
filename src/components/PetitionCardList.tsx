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
    const searchTerm = searchParams.get('searchTerm')
    const sortBy = searchParams.get('sortBy')
    const minCost = searchParams.get('minCost')
    const categoryIds= searchParams.getAll('categoryIds')
    const [prevCategoryIds, setPrevCategoryIds] = React.useState([""]);
    const [css, theme] = useStyletron()

    const [petitions, setPetitions] = useState<Petition[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [currentPage, setCurrentPage] = React.useState(1)
    const [numberOfPages, setNumberOfPages] = React.useState(1)
    const numPetitionsPerPage = 10

    const getPetitions = () => {
        let apiRequest = "http://localhost:4941/api/v1/petitions"
        apiRequest += `?startIndex=${(currentPage - 1) * numPetitionsPerPage}`
        apiRequest += `&count=${numPetitionsPerPage}`
        if (searchTerm != null) {
            apiRequest += `&q=${searchTerm}`
        }
        if (sortBy != null) {
            apiRequest += `&sortBy=${sortBy}`
        }
        if (minCost != null) {
            apiRequest += `&supportingCost=${minCost}`
        }
        apiRequest += categoryIds.map(id => `&categoryIds[]=${id}`).join('');
        axios.get(apiRequest)
            .then((response) => {
                setPetitions(response.data.petitions)
                setNumberOfPages(Math.ceil(response.data.count / numPetitionsPerPage))
            }, () => {
            })
    }
    const getCategories = () => {
        let apiRequest = "http://localhost:4941/api/v1/petitions/categories"
        axios.get(apiRequest)
            .then((response) => {
                setCategories(response.data)
            }, () => {
            })
    }

    React.useEffect(() => {
        getPetitions()
        getCategories()
    }, [setPetitions, currentPage])

    React.useEffect(() => {
        setCurrentPage(1)
        getPetitions()
        getCategories()
        // setPrevCategoryIds(categoryIds)
    }, [searchTerm, sortBy, minCost])

    React.useEffect(() => {
        if (JSON.stringify(prevCategoryIds) !== JSON.stringify(categoryIds)) {
            setCurrentPage(1)
            getPetitions()
            getCategories()
            setPrevCategoryIds(categoryIds)
        }
    }, [categoryIds, prevCategoryIds])

    return (
        <div>
            {(petitions.length == 0)?
                <div className={css({ width: "100%", textAlign: "center", paddingTop: "16px", fontSize: "32px" })}>
                    No petitions found
                </div> : 

                <div
                    className={css({
                        display: 'flex',
                        flexDirection: 'column',
                    })}
                >
                <div
                    className={css({
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
            }
        </div>
    )
}