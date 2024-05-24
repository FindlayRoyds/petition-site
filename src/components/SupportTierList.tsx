import React, { ReactNode, useEffect, useState } from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button, KIND } from "baseui/button";
import { Petition, Category, Supporter } from "../types";
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
import { SupportTier } from '../types';
import { ListHeading, ListItem, ListItemLabel } from "baseui/list";


interface SupportTierListProps {
    tier: SupportTier;
    level: number;
    petitionId: number;
}

export default function SupportTierList({ tier, level, petitionId }: SupportTierListProps) {
    const [css, theme] = useStyletron()
    const [supporters, setSupporters] = useState<Supporter[]>([])

    const tierBorderColors = ["hsl(51, 100%, 50%);", "hsl(0, 0%, 75%);", "hsl(36, 36%, 52%)"]
    const tierBackgroundColorsLight = ["hsl(51, 100%, 93%);", "hsl(0, 0%, 97%);", "hsl(36, 36%, 93%)"]
    const tierBackgroundColorsDark = ["hsl(51, 100%, 15%);", "hsl(0, 0%, 15%);", "hsl(36, 36%, 15%)"]
    const supportButtonTypes = [KIND.primary, KIND.secondary, KIND.secondary]

    useEffect(() => {
        const getSupporters = () => {
            let apiRequest = `http://localhost:4941/api/v1/petitions/${petitionId}/supporters`
            axios.get(apiRequest)
                .then((response) => {
                    setSupporters(response.data)
                }, (error) => {
                    console.log("error :(")
                })
        }
        getSupporters()
    }, [petitionId])

    const supportersInTier = supporters.filter(supporter => supporter.supportTierId === tier.supportTierId);
    
    return (
        <Block className={css({ maxWidth: "300px", width: "100%", marginTop: (level - 1) * 64 + "px", border: "4px solid " + tierBorderColors[level - 1], backgroundColor: theme.name == "dark-theme"? tierBackgroundColorsDark[level - 1] : tierBackgroundColorsLight[level - 1], borderBottomRadius: "0px", borderTopLeftRadius: level == 3? "0px" : "24px", borderTopRightRadius: level == 2? "0px" : "24px", padding: "24px", display: "flex", flexDirection: "column", rowGap: "12px", color: theme.colors.primary })}>
            <div>
                <div className={css({
                        width: "100%",
                        paddingBottom: "12px",
                        fontSize: theme.typography.HeadingSmall.fontSize, 
                        fontWeight: theme.typography.HeadingSmall.fontWeight,
                        textAlign: "center"
                    })}
                >
                    {tier.title}
                </div>
                <div className={css({ paddingBottom: "12px" })}>
                    {tier.description}
                </div>
            </div>
            
            <div className={css({ marginTop: 'auto' })}>
                <Button kind={supportButtonTypes[level - 1]} className={css({ width: "100%" })}>
                    Support for { "$" + tier.cost}
                </Button>
                
                <div className={css({ paddingTop: "16px" })}>
                    <StyledDivider $size={SIZE.section} className={css({ width: "100%" })} />
                </div>
                
                <div className={css({
                        width: "100%",
                        paddingTop: "12px",
                        fontSize: theme.typography.HeadingSmall.fontSize, 
                        fontWeight: theme.typography.HeadingSmall.fontWeight,
                        textAlign: "center"
                    })}
                >
                    {supportersInTier.length == 0? "No supporters yet" :
                    supportersInTier.length == 1? "1 supporter" :
                    supportersInTier.length + " supporters"}
                </div>

                <ul className={css({ width: "100%", height: "175px", overflowY: "auto", boxSizing: "border-box", paddingLeft: "0" })}>
                {supportersInTier.map((supporter, index) => (
                    <ListItem 
                        key={index} 
                        overrides={{
                        Root: {
                            style: ({ $theme }) => ({
                            backgroundColor: 'transparent',
                            paddingRight: "0px"
                            })
                        }
                        }}
                    >
                        <ListItemLabel>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: "10px"}}>
                                <div>
                                    <Avatar
                                        name={`${supporter.supporterFirstName} ${supporter.supporterLastName}`}
                                        size="scale1400"
                                        src={`http://localhost:4941/api/v1/users/${supporter.supporterId}/image`}
                                    />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', color: theme.colors.primary }}>
                                    <div style={{ fontSize: theme.typography.ParagraphMedium.fontSize }}>
                                        <span>
                                            {supporter.supporterFirstName} {supporter.supporterLastName}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: theme.typography.ParagraphXSmall.fontSize, fontWeight: theme.typography.ParagraphXSmall.fontWeight}}>
                                        {supporter.message}
                                    </div>
                                    <div style={{ fontSize: theme.typography.ParagraphXSmall.fontSize, fontWeight: theme.typography.ParagraphXSmall.fontWeight}}>
                                        {tier.title} - {new Date(supporter.timestamp).getDate()} {new Date(supporter.timestamp).toLocaleString('default', { month: 'short' })} {new Date(supporter.timestamp).getFullYear()}
                                    </div>
                                </div>
                            </div>
                        </ListItemLabel>
                    </ListItem>
                    ))}
                </ul>
            </div>
        </Block>
    )
}


