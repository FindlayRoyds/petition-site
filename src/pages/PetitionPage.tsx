import React, { ReactNode, useState } from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button } from "baseui/button";
import { Petition, Category } from "../types"; // Import the Petition interface
import { Skeleton } from 'baseui/skeleton';
import { Block } from "baseui/block";
import { AspectRatioBox, AspectRatioBoxBody } from "baseui/aspect-ratio-box";
import { Avatar } from "baseui/avatar";
import { useNavigate } from 'react-router-dom'
import { Badge, COLOR } from "baseui/badge";
import { useParams } from 'react-router-dom';
import { PetitionAdvanced } from '../types';
import { StyledDivider, SIZE } from "baseui/divider";
import axios from 'axios';
import SupportTierList from '../components/SupportTierList';
import PetitionCard from '../components/PetitionCard';


export default function PetitionPage() {
    const [css, theme] = useStyletron()
    let { id: petitionId } = useParams<{ id: string }>();
    const [petition, setPetition] = useState<PetitionAdvanced>()
    // const date = new Date(petition.creationDate);
    // const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    const [isImageLoaded, setImageLoaded] = React.useState(false);
    const image = new Image();
    image.src = `http://localhost:4941/api/v1/petitions/${petition?.petitionId}/image`;
    image.onload = () => setImageLoaded(true);

    const date = new Date;
    const [formattedDate, setFormattedDate] = useState<String>("")
    const [similarPetitions, setSimilarPetitions] = useState<Petition[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const navigate = useNavigate()

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
        const getPetition = () => {
            let apiRequest = `http://localhost:4941/api/v1/petitions/${petitionId}`
            axios.get(apiRequest)
                .then((response) => {
                    setPetition(response.data)
                }, (error) => {
                    console.log("error :(")
                })
        }
        getPetition()
        getCategories()
    }, [petitionId])

    React.useEffect(() => {
        const getSimilarPetitions = () => {
            let apiRequest = `http://localhost:4941/api/v1/petitions/`
            axios.get(apiRequest)
                .then((response) => {
                    setSimilarPetitions(response.data.petitions.filter((petition2: Petition) => (petition2.ownerId === petition?.ownerId || petition2.categoryId === petition?.categoryId) && petition2.petitionId != petition?.petitionId));
                }, (error) => {
                    console.log("error :(")
                })
        }
        getSimilarPetitions()
    }, [petition?.petitionId])

    React.useEffect(() => {
        if (petition) {
            const date = new Date(petition.creationDate)
            setFormattedDate(`${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`)
        }
    }, [petition?.creationDate])

    return (
        <div className={css({ maxWidth: "1200px", margin: "0 auto", padding: "16px", paddingTop: "48px", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "32px", color: theme.colors.primary })}>
            <div className={css({ width: "100%", display: "flex", flexDirection: "row", columnGap: "32px" })}>
                <div className={css({ width: "75%" })}>
                    <AspectRatioBox>
                        <AspectRatioBoxBody>
                            {isImageLoaded?
                                <img
                                    src={image.src}
                                    className={css({width: "100%", height: "100%", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", borderTopLeftRadius: "14px", borderTopRightRadius: "14px"})}
                                />
                                : <Skeleton height="100%" width="100%" animation overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({
                                        borderRadius: "20px"
                                    })
                                    }
                                }}>
                                </Skeleton>
                            }
                        </AspectRatioBoxBody>
                    </AspectRatioBox>
                </div>
                <div className={css({width: "100%", display: "flex", flexDirection: "column", rowGap: "12px"})}>
                    <div className={css({
                            width: "100%",
                            fontSize: theme.typography.DisplayMedium.fontSize, 
                            fontWeight: theme.typography.DisplayMedium.fontWeight
                        })}
                    >
                        {petition?.title}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: "10px"}}>
                        <div>
                            <Avatar
                                name={`${petition?.ownerFirstName} ${petition?.ownerLastName}`}
                                size="scale1400"
                                src={`http://localhost:4941/api/v1/users/${petition?.ownerId}/image`}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', color: theme.colors.primary, fontSize: theme.typography.ParagraphMedium.fontSize}}>
                            <div>
                                <span>
                                    Uploaded by {petition?.ownerFirstName} {petition?.ownerLastName}
                                </span>
                            </div>
                            <div>{formattedDate}</div>
                        </div>
                    </div>

                    <div className={css({
                            width: "100%",
                            paddingTop: "24px",
                            fontSize: theme.typography.ParagraphLarge.fontSize, 
                            fontWeight: theme.typography.ParagraphLarge.fontWeight
                        })}
                    >
                        {petition?.description}
                    </div>
                    <div className={css({
                        width: "100%",
                        fontSize: theme.typography.ParagraphLarge.fontSize, 
                        fontWeight: theme.typography.ParagraphLarge.fontWeight
                    })}
                    >
                        {petition?.numberOfSupporters ?? 0 > 0 ?
                            petition?.moneyRaised + " dollars raised by " + petition?.numberOfSupporters + " supporter" + (petition?.numberOfSupporters == 1? "" : "s") :
                            "This petition does not have any supporters yet"
                        }
                        
                    </div>
                </div>
            </div>

            <StyledDivider $size={SIZE.section} className={css({ width: "100%"})} />

            
            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", columnGap: "0px" }}>
            {petition?.supportTiers
                .sort((a, b) => {
                if (petition?.supportTiers.length === 3) {
                    if (petition?.supportTiers.length === 3) {
                        const maxCost = Math.max(...petition.supportTiers.map(tier => tier.cost));
                        const minCost = Math.min(...petition.supportTiers.map(tier => tier.cost));
                        if (a.cost !== maxCost && a.cost !== minCost) return -1;
                        if (b.cost !== maxCost && b.cost !== minCost) return 1;
                        return b.cost - a.cost;
                      } else {
                        return b.cost - a.cost;
                      }
                } else {
                    return a.cost - b.cost;
                }
                })
                .map((tier, index, arr) => {
                let level;
                if (arr.length === 3) {
                    level = index === 0 ? 2 : index === 1 ? 1 : 3;
                } else if (arr.length === 2) {
                    level = index === 0 ? 2 : 1;
                } else {
                    level = 1
                }
                return <SupportTierList tier={tier} level={level} petition={petition} />;
                })}
            </div>

            <StyledDivider $size={SIZE.section} className={css({ width: "100%"})} />
            
            <div className={css({
                            width: "100%",
                            fontSize: theme.typography.DisplaySmall.fontSize, 
                            fontWeight: theme.typography.DisplaySmall.fontWeight,
                            textAlign: "center"
                        })}
            >Similar Petitions</div>
            {similarPetitions.length == 0?
                    <div className={css({ fontSize: "32px", textAlign: "center", width: "100%", paddingBottom: "48px" })}>No similar petitions</div> :
            
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
                
                    {similarPetitions.map((petition: Petition, index: any) => {
                        const category = categories.find((category) => category.categoryId === petition.categoryId)
                        if (!category) {
                            return null
                        }
                        return (
                            <PetitionCard petition={petition} category={category} key={index} />
                        )
                    })
                }
            </div>
            }
        </div>
    )
}
