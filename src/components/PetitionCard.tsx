import React, { ReactNode } from 'react';
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


interface PetitionCardProps {
    petition: Petition;
    category: Category;
}

export default function PetitionCard({ petition, category }: PetitionCardProps) {
    const [css, theme] = useStyletron()
    const date = new Date(petition.creationDate);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    const [isImageLoaded, setImageLoaded] = React.useState(false);
    const image = new Image();
    image.src = `http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`;
    image.onload = () => setImageLoaded(true);

    const badgeHue = category.categoryId * 137.508;
    const badgeColor = `hsl(${badgeHue % 360}, 50%, 50%)`;

    const navigate = useNavigate()

    const navigateToPetition = () => {
        navigate(`/petition/${petition.petitionId}`)
    }
    const navigateToOwner = () => {
        navigate(`/user/${petition.petitionId}`)
    }

    React.useEffect(() => {
        setImageLoaded(false) // Reset the isImageLoaded state

        image.onload = () => {
            setImageLoaded(true) // Set the isImageLoaded state to true when the image is loaded
        }
    }, [petition.petitionId])

    return (
        <Block overrides={{
            Block: {
                style: {
                    border: `2px ${theme.borders.border400.borderStyle} ${theme.borders.border400.borderColor}`,
                    borderRadius: theme.borders.radius500,
                    boxShadow: theme.lighting.shallowBelow,
                    backgroundColor: theme.colors.backgroundSecondary
                },
            },
        }}>
            <div className={css({height: "100%", display: 'flex', flexDirection: 'column'})}>
                <div className={css({padding: "0px"})}>
                    <AspectRatioBox>
                        <AspectRatioBoxBody>
                            {isImageLoaded?
                                <Badge
                                    content={category.name}
                                    overrides={{
                                        Badge: {
                                        style: ({ $theme }) => ({
                                            backgroundColor: badgeColor,
                                            boxShadow: theme.lighting.shadow600
                                        })
                                        }
                                    }}>
                                <div className={css({position: 'relative', width: "100%", height: "100%"})}>
                                    <img
                                        src={image.src}
                                        className={css({width: "100%", height: "100%", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", borderTopLeftRadius: "14px", borderTopRightRadius: "14px", cursor: 'pointer'})}
                                        onClick={() => {
                                            navigateToPetition()
                                        }}
                                    />
                                    <div className={css({
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'radial-gradient(circle at center, transparent, rgba(0, 0, 0, 0.2) 200%)',
                                        borderRadius: '14px',
                                        pointerEvents: 'none'
                                    })} />
                                </div>
                                </Badge>
                                : <Skeleton height="100%" width="100%" animation overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({
                                        borderRadius: "20px"
                                    })
                                    }
                                }}>
                                </Skeleton>}
                        </AspectRatioBoxBody>
                    </AspectRatioBox>
                </div>
                <div className={css({padding: "24px", paddingTop: "12px", flex: 1, display: 'flex', flexDirection: 'column'})}>
                    <div
                        className={css({fontSize:theme.typography.HeadingSmall.fontSize, fontWeight:theme.typography.HeadingSmall.fontWeight, color: theme.colors.primary, marginBottom: "16px", cursor: 'pointer'})}
                        onClick={() => {
                            navigateToPetition()
                        }}
                    >
                        {petition.title}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: "16px"}}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: "10px"}}>
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    navigateToOwner()
                                }}
                            >
                                <Avatar
                                    name={`${petition.ownerFirstName} ${petition.ownerLastName}`}
                                    size="scale1400"
                                    src={`http://localhost:4941/api/v1/users/${petition.ownerId}/image`}
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', color: theme.colors.primary, fontSize: theme.typography.ParagraphMedium.fontSize}}>
                                <div>
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            navigateToOwner()
                                        }}
                                    >
                                        Uploaded by {petition.ownerFirstName} {petition.ownerLastName}
                                    </span>
                                </div>
                                <div>{formattedDate}</div>
                            </div>
                        </div>
                        <Button
                            overrides={{ BaseButton: { style: { width: "100%" } } }}
                            onClick={() => {
                                navigateToPetition()
                            }}
                        >
                            Support for { petition.supportingCost == 0? "free" : "$" + petition.supportingCost }
                        </Button>
                    </div>
                </div>
            </div>
        </Block>
    );
}


