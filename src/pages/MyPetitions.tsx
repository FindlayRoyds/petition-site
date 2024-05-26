import React, { useState } from 'react'
import PetitionCard from '../components/PetitionCard'
import axios from 'axios'
import { Cell, Grid } from 'baseui/layout-grid'
import { Petition, Category } from '../types' // Import the Petition type
import { useStyletron } from "baseui"
import { useParams } from 'react-router-dom'
import { Pagination } from "baseui/pagination"
import { Button, KIND } from 'baseui/button'
import { ArrowDown, ArrowLeft, ChevronLeft, TriangleLeft, TriangleRight } from 'baseui/icon'
import { useSearchParams } from 'react-router-dom'
import { Card, StyledBody, StyledAction } from "baseui/card";
import {Heading, HeadingLevel} from 'baseui/heading';
import { Skeleton } from 'baseui/skeleton';
import { Block } from "baseui/block";
import { AspectRatioBox, AspectRatioBoxBody } from "baseui/aspect-ratio-box";
import { Avatar } from "baseui/avatar";
import { useNavigate } from 'react-router-dom'
import { Badge, COLOR } from "baseui/badge";
import { PetitionAdvanced } from '../types';
import { StyledDivider, SIZE as DIVIDER_SIZE } from "baseui/divider";
import SupportTierList from '../components/SupportTierList';
import { Input } from 'baseui/input';
import { FormControl } from "baseui/form-control";
import { Notification, KIND as NOTIFICATION_KIND} from "baseui/notification";
import { ReactElement } from 'react';
import {usePersistentStore} from "../store"
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";
import {KIND as BUTTON_KIND} from "baseui/button/constants";
import { FileUploader } from "baseui/file-uploader";
import { Textarea } from 'baseui/textarea';
import { Select } from 'baseui/select';
import SupportTierCreator from '../components/SupportTierCreator';


export default function PetitionCardList() {
    const [searchParams] = useSearchParams()
    const searchTerm = searchParams.get('searchTerm')
    const sortBy = searchParams.get('sortBy')
    const minCost = searchParams.get('minCost')
    const categoryIds= searchParams.getAll('categoryIds')
    const [prevCategoryIds, setPrevCategoryIds] = React.useState([""]);
    const user = usePersistentStore(state => state.user)
    const [css, theme] = useStyletron()

    const [supportedPetitions, setSupportedPetitions] = useState<Petition[]>([])
    const [ownedPetitions, setOwnedPetitions] = useState<Petition[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [currentPage, setCurrentPage] = React.useState(1)
    const numPetitionsPerPage = 10

    const getPetitions = () => {
        if (user != null) {
            let supportedApiRequest = "http://localhost:4941/api/v1/petitions"
            supportedApiRequest += `?supporterId=${user.userId}`
            axios.get(supportedApiRequest)
                .then((response) => {
                    setSupportedPetitions(response.data.petitions)
                }, (error) => {
                    console.log("error :(")
                })
            let ownedApiRequest = "http://localhost:4941/api/v1/petitions"
            ownedApiRequest += `?ownerId=${user.userId}`
            axios.get(ownedApiRequest)
                .then((response) => {
                    setOwnedPetitions(response.data.petitions)
                }, (error) => {
                    console.log("error :(")
                })
        }
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

    React.useEffect(() => {
        getPetitions()
        getCategories()
    }, [setSupportedPetitions, currentPage])

    React.useEffect(() => {
        setCurrentPage(1)
        getPetitions()
        getCategories()
        // setPrevCategoryIds(categoryIds)
    }, [searchTerm, sortBy, minCost])

    React.useEffect(() => {
        if (JSON.stringify(prevCategoryIds) !== JSON.stringify(categoryIds)) {
            console.log("ran")
            setCurrentPage(1)
            getPetitions()
            getCategories()
            setPrevCategoryIds(categoryIds)
        }
    }, [categoryIds, prevCategoryIds])

    return (
        <div>
            {(supportedPetitions.length == 0)?
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
                    {supportedPetitions.map((petition: Petition, index: any) => {
                        const category = categories.find((category) => category.categoryId === petition.categoryId)
                        if (!category) {
                            return null
                        }
                        return (
                            <PetitionCard petition={petition} category={category} key={index} />
                        )
                    })}
                    {ownedPetitions.map((petition: Petition, index: any) => {
                        const category = categories.find((category) => category.categoryId === petition.categoryId)
                        if (!category) {
                            return null
                        }
                        return (
                            <PetitionCard petition={petition} category={category} key={index} />
                        )
                    })}
                </div>
            </div>
            }
        </div>
    )
}