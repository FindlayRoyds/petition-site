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
import { Input } from 'baseui/input';
import { Notification, KIND as NOTIFICATION_KIND} from "baseui/notification";


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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [cost, setCost] = React.useState("");

    const [errorMessage, setErrorMessage] = useState("")


    const getSupporters = () => {
        let apiRequest = `http://localhost:4941/api/v1/petitions/${petition.petitionId}/supporters`
        axios.get(apiRequest)
            .then((response) => {
                setSupporters(response.data)
            }, () => {
            })
    }

    const openSupport = () => {
        if (user == null) {
            navigate("/login")
        } else {
            if (!isSupporting && !userOwnsPetition) {
                setSupportMessage("")
                setIsSupportModalOpen(true)
            }
        }
    }

    const openEditModal = () => {
        setTitle(tier.title)
        setDescription(tier.description)
        setCost(tier.cost.toString())
        setIsEditModalOpen(true)
    }

    const deleteTier = () => {
        axios.delete(`http://localhost:4941/api/v1/petitions/${petition.petitionId}/supportTiers/${tier.supportTierId}`, {
            headers: {
                'X-Authorization': user.token
            }
        }).then((response) => {
            window.location.reload();
        }, (error) => {
            const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
            setErrorMessage(errorMessage);
        })
    }

    const submit = () => {
        let changes: { title?: string, description?: string, cost?: string } = {};
        if (title != tier.title) {
            changes.title = title;
        }
        if (description != tier.description) {
            changes.description = description;
        }
        if (cost != tier.cost.toString()) {
            changes.cost = cost;
        }

        axios.patch(`http://localhost:4941/api/v1/petitions/${petition.petitionId}/supportTiers/${tier.supportTierId}`, changes, {
            headers: {
                'X-Authorization': user.token
            }
        }).then((response) => {
            
            window.location.reload();
        }, (error) => {
            const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
            setErrorMessage(errorMessage);
        })
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
                    {userOwnsPetition?
                    <div style={{ display: "flex", flexDirection: "column", rowGap: "12px" }}>
                        <Button className={css({ width: "100%" })} onClick={() => {openEditModal()}} disabled={supportersInTier.length > 0}>
                            Edit support tier
                        </Button>
                        <Button kind={BUTTON_KIND.tertiary} className={css({ width: "100%" })} onClick={() => { deleteTier() }} disabled={petition.supportTiers.length <= 1 || supportersInTier.length > 0}>
                            Delete support tier
                        </Button>
                    </div> :
                    <Button kind={supportButtonTypes[level - 1]} className={css({ width: "100%" })} onClick={() => openSupport()} disabled={isSupporting}>
                        {!isSupporting?
                            `Support for ${ tier.cost == 0? "free" : "$" + tier.cost}` :
                            "Already supporting"
                        }
                    </Button>
                    }
                    
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

            <Modal
                onClose={() => setIsEditModalOpen(false)}
                isOpen={isEditModalOpen}
                animate
                autoFocus
                size={MODAL_SIZE.default}
                role={ROLE.dialog}
            >
                <ModalHeader>Edit "{tier.title}"</ModalHeader>
                <ModalBody>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", rowGap: "24px", width: "100%" }}>
                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Title
                        </div>
                        <Input
                            value={title}
                            onChange={(event) => setTitle(event.currentTarget.value)}
                            placeholder="Enter a title for the support tier"
                        />

                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Description
                        </div>
                        <Textarea
                            value={description}
                            onChange={(event) => setDescription(event.currentTarget.value)}
                            placeholder="Enter a description for the support tier"
                        />

                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Cost
                        </div>
                        <Input
                            value={cost}
                            onChange={(event) => {
                                // let num = parseFloat(event.currentTarget.value)
                                // console.log(num)
                                // if (!isNaN(num) || event.currentTarget.value === "") {
                                //     setCost(isNaN(num)? "" : num.toString())
                                // }
                                setCost(event.currentTarget.value)
                            }}
                            placeholder="Enter a cost in dollars for the support tier"
                        />

                        {errorMessage && (
                            <Notification kind={NOTIFICATION_KIND.negative} closeable
                                overrides={{
                                    Body: { style: { width: "90%" } },
                                }}
                                onClose={() => {
                                    setErrorMessage("")
                                }}
                            >
                                {errorMessage}
                            </Notification>
                    )}  
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={BUTTON_KIND.secondary} onClick={() => { setIsEditModalOpen(false) }}>
                        Cancel
                    </ModalButton>
                    <ModalButton onClick={() => { submit() }}>
                        Apply changes
                    </ModalButton>
                </ModalFooter>
            </Modal>
        </>
    )
}


