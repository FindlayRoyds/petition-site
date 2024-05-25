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
import {usePersistentStore} from "../store"
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE as MODAL_SIZE} from "baseui/modal";
import {KIND as BUTTON_KIND} from "baseui/button/constants";
import { Textarea } from "baseui/textarea";


interface SupportTierListProps {
    tier: SupportTier;
    level: number;
    petition: PetitionAdvanced;
}

export default function SupportTierList({ tier, level, petition }: SupportTierListProps) {
    const [css, theme] = useStyletron()
    const [supporters, setSupporters] = useState<Supporter[]>([])
    const navigate = useNavigate()

    const tierBorderColors = ["hsl(51, 100%, 50%);", "hsl(0, 0%, 75%);", "hsl(36, 36%, 52%)"]
    const tierBackgroundColorsLight = ["hsl(51, 100%, 93%);", "hsl(0, 0%, 97%);", "hsl(36, 36%, 93%)"]
    const tierBackgroundColorsDark = ["hsl(51, 100%, 15%);", "hsl(0, 0%, 15%);", "hsl(36, 36%, 15%)"]
    const supportButtonTypes = [KIND.primary, KIND.secondary, KIND.secondary]
    const user = usePersistentStore(state => state.user)
    const supportersInTier = supporters.filter(supporter => supporter.supportTierId === tier.supportTierId);

    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
    const [supportMessage, setSupportMessage] = useState("")
    const [isSupporting, setIsSupporting] = useState(user == null? false : supportersInTier.some(supporter => supporter.supporterId === user.userId))
    const [userOwnsPetition, setUserOwnsPetition] = useState(user == null? false : user.userId == petition.ownerId)


    const getSupporters = () => {
        let apiRequest = `http://localhost:4941/api/v1/petitions/${petition.petitionId}/supporters`
        axios.get(apiRequest)
            .then((response) => {
                setSupporters(response.data)
            }, (error) => {
                console.log("error :(")
            })
    }

    const openSupport = () => {
        if (user == null) {

        } else {
            if (!isSupporting && !userOwnsPetition) {
                setSupportMessage("")
                setIsSupportModalOpen(true)
            }
        }
    }

    const support = () => {
        if (user != null) {
            let apiRequest = `http://localhost:4941/api/v1/petitions/${petition.petitionId}/supporters`
            let body: { supportTierId: number; message?: string } = {
                supportTierId: tier.supportTierId
            };
            if (supportMessage != "") {
                body.message = supportMessage;
            }
            axios.post(apiRequest, body, {
                headers: {
                    'X-Authorization': user.token
                }
            }).then((response) => {
                getSupporters()
                setIsSupportModalOpen(false)
            }, (error) => {
                // const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
                // setErrorMessage(errorMessage);
            })
        }
    }

    useEffect(() => {
        getSupporters()
        setIsSupporting(user == null? false : supporters.some(supporter => supporter.supporterId === user.userId))
    }, [petition, tier])

    useEffect(() => {
        setIsSupporting(user == null? false : supportersInTier.some(supporter => supporter.supporterId === user.userId))
        setUserOwnsPetition(user == null? false : user.userId == petition.ownerId)
    }, [supporters, user])
    
    return (
        <>
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
                    <Button kind={supportButtonTypes[level - 1]} className={css({ width: "100%" })} onClick={() => openSupport()} disabled={isSupporting}>
                        {!isSupporting?
                            userOwnsPetition?
                                "Cannot support your own petition" :
                                `Support for ${ tier.cost == 0? "free" : "$" + tier.cost}` :
                            "Already supporting"
                        }
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

            <Modal
                onClose={() => setIsSupportModalOpen(false)}
                isOpen={isSupportModalOpen}
                animate
                autoFocus
                size={MODAL_SIZE.default}
                role={ROLE.dialog}
            >
                <ModalHeader>Support {petition.title}</ModalHeader>
                <ModalBody>
                    Support this petition at the "{tier.title}" tier. Other users will be able to see that you have supported the petition.<br/><br/>
                    <Textarea
                        value={supportMessage}
                        onChange={(e: any) => setSupportMessage(e.target.value)}
                        placeholder="You can leave an optional message here"
                        clearOnEscape
                    />
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={BUTTON_KIND.secondary} onClick={() => { setIsSupportModalOpen(false) }}>
                        Cancel
                    </ModalButton>
                    <ModalButton onClick={() => { support() }}>
                        Support for { tier.cost == 0? "free" : "$" + tier.cost}
                    </ModalButton>
                </ModalFooter>
            </Modal>
        </>
    )
}


