import React, { ReactNode, useEffect, useState } from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button, KIND } from "baseui/button";
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
import {usePersistentStore} from "../store"
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE as MODAL_SIZE} from "baseui/modal";
import { Notification, KIND as NOTIFICATION_KIND} from "baseui/notification";
import { Input } from 'baseui/input';



export default function AccountPage() {
    const [css, theme] = useStyletron()
    const user = usePersistentStore(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(user == null)
    const [errorMessage, setErrorMessage] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [imageVersion, setImageVersion] = useState(0);
    const setUser = usePersistentStore(state => state.setUser)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [hasImage, setHasImage] = useState(false);

    const navigate = useNavigate()

    const startEditing = () => {
        setIsEditing(true)
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setEmail(user.email)
        setCurrentPassword("")
        setPassword("")
    }

    const submit = () => {
        let changes: { firstName?: string, lastName?: string, email?: string, password?: string, currentPassword?: string } = {};
        if (firstName !== user.firstName) {
            changes.firstName = firstName;
        }
        if (lastName !== user.lastName) {
            changes.lastName = lastName;
        }
        if (email !== user.email) {
            changes.email = email;
        }
        if (password !== "") {
            changes.password = password;
        }
        if (currentPassword !== "") {
            changes.currentPassword = currentPassword;
        }

        axios.patch(`http://localhost:4941/api/v1/users/${user.userId}`, changes, {
            headers: {
                'X-Authorization': user.token
            }
        }).then((response) => {
            setUser(
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    userId: user.userId,
                    token: user.token
                }
            )
            window.location.reload();
        }, (error) => {
            const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
            setErrorMessage(errorMessage);
        })
    }

    const removeImage = () => {
        axios.delete(`http://localhost:4941/api/v1/users/${user.userId}/image`, {
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

    useEffect(() => {
        setIsModalOpen(user == null)
    }, [user])

    useEffect(() => {
        axios.get(`http://localhost:4941/api/v1/users/${user.userId}/image`, {}).then((response) => {
            setHasImage(true)
        }, (error) => {
            setHasImage(false)
        })
    }, [])

    return (
        <div>
            {user != null &&
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "24px", marginBottom: "48px" }}>
                    <Block style={{ borderRadius: "12px", outline: `${theme.borders.border400.borderColor} solid 1px`, padding: "24px", maxWidth: "600px", width: "100%" }}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", rowGap: "24px", width: "100%" }}>
                            {!isEditing && (
                                <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", rowGap: "24px", width: "100%" }}>
                                    <Avatar
                                        name={`${user.firstName} ${user.lastName}`}
                                        size="400px"
                                        src={`http://localhost:4941/api/v1/users/${user.userId}/image?version=${imageVersion}`}
                                    />

                                    <div className={css({ width: "100%", fontSize: theme.typography.HeadingMedium.fontSize, fontWeight: theme.typography.HeadingMedium.fontWeight, paddingLeft: "32px", paddingTop: "24px" })}>
                                        {`${user.firstName} ${user.lastName}`}
                                    </div>

                                    <div className={css({ width: "100%", fontSize: theme.typography.ParagraphMedium.fontSize, fontWeight: theme.typography.ParagraphMedium.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "0" })}>
                                        email: {user.email}
                                    </div>

                                    <Button onClick={() => {startEditing()}}>
                                        Edit account
                                    </Button>
                                </div>
                            )}

                            {isEditing && (
                                <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", rowGap: "24px", width: "100%" }}>
                                    <Avatar
                                        name={`${user.firstName} ${user.lastName}`}
                                        size="400px"
                                        src={`http://localhost:4941/api/v1/users/${user.userId}/image`}
                                    />
                                    <div style={{ display: "flex", columnGap: "12px" }}>
                                        {hasImage && (
                                            <Button kind={KIND.secondary} onClick={() => removeImage()}>
                                                Remove image
                                            </Button>
                                        )}
                                        
                                        <Button kind={KIND.secondary} onClick={() => {navigate("/upload-avatar")}}>
                                            Upload new image
                                        </Button>
                                    </div>

                                    <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "16px", paddingTop: "24px"})}>
                                        Name
                                    </div>
                                    <div style={{ display: "flex", columnGap: "16px", width: "100%" }}>
                                        <Input
                                            value={firstName}
                                            onChange={(event) => setFirstName(event.currentTarget.value)}
                                            placeholder="Enter your first name"
                                        />
                                        <Input
                                            value={lastName}
                                            onChange={(event) => setLastName(event.currentTarget.value)}
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                    <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "16px", paddingTop: "24px"})}>
                                        Email
                                    </div>
                                    <Input
                                        value={email}
                                        onChange={(event) => setEmail(event.currentTarget.value)}
                                        placeholder="Enter a valid email address"
                                    />
                                    <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "16px", paddingTop: "24px"})}>
                                        Current Password
                                    </div>
                                    <Input
                                        value={currentPassword}
                                        onChange={(event) => setCurrentPassword(event.currentTarget.value)}
                                        placeholder="Enter your current password"
                                        type="password"
                                    />
                                    <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "16px", paddingTop: "24px"})}>
                                        New Password
                                    </div>
                                    <Input
                                        value={password}
                                        onChange={(event) => setPassword(event.currentTarget.value)}
                                        placeholder="Enter your new password"
                                        type="password"
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

                                    <div style={{ display: "flex", columnGap: "12px" }}>
                                        <Button kind={KIND.secondary} onClick={() => {setIsEditing(false)}}>
                                            Cancel
                                        </Button>
                                        <Button onClick={() => {submit()}}>
                                            Submit changes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Block>
                </div>
            }
        
            <Modal
                // onClose={() => setIsModalOpen(false)}
                closeable={false}
                isOpen={isModalOpen}
                animate
                autoFocus
                size={MODAL_SIZE.default}
                role={ROLE.dialog}
            >
                <ModalHeader>Looks like you aren't logged in!</ModalHeader>
                <ModalBody>
                    To view your account information you need to be logged in. If you don't have an account, you can create one by clicking the login button below.
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={KIND.secondary} onClick={() => {navigate("/")}}>
                        Home
                    </ModalButton>
                    <ModalButton onClick={() => { navigate("/login") }}>
                        Log in
                    </ModalButton>
                </ModalFooter>
            </Modal>
        </div>
    )
}
