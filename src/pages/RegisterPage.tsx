import React, {ReactNode, useEffect, useState} from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button, KIND as BUTTON_KIND, SHAPE, SIZE as BUTTON_SIZE } from "baseui/button";
import { Petition, Category } from "../types"; // Import the Petition interface
import { Skeleton } from 'baseui/skeleton';
import { Block } from "baseui/block";
import { AspectRatioBox, AspectRatioBoxBody } from "baseui/aspect-ratio-box";
import { Avatar } from "baseui/avatar";
import { useNavigate } from 'react-router-dom'
import { Badge, COLOR } from "baseui/badge";
import { useParams } from 'react-router-dom';
import { PetitionAdvanced } from '../types';
import { StyledDivider, SIZE as DIVIDER_SIZE } from "baseui/divider";
import axios from 'axios';
import SupportTierList from '../components/SupportTierList';
import PetitionCard from '../components/PetitionCard';
import { Input } from 'baseui/input';
import { FormControl } from "baseui/form-control";
import { Notification, KIND as NOTIFICATION_KIND} from "baseui/notification";
import { ReactElement } from 'react';
import {usePersistentStore} from "../store";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    SIZE,
    ROLE
} from "baseui/modal";

export default function RegisterPage(): ReactElement {
    const [css, theme] = useStyletron()
    const navigate = useNavigate()

    // const setToken = usePersistentStore(state => state.setToken)
    // const setUserId = usePersistentStore(state => state.setUserId)
    const setUser = usePersistentStore(state => state.setUser)
    const setTheme = usePersistentStore(state => state.setTheme)
    const user = usePersistentStore(state => state.user)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(user != null)

    const getAndSetUser = (userId: number, token: string) => {
        let apiRequest = `http://localhost:4941/api/v1/users/${userId}`
        axios.get(apiRequest, {
            headers: {
                'X-Authorization': token
            }
        }).then((response) => {
            let newUser = response.data
            newUser.userId = userId
            newUser.token = token
            setUser(response.data)
            navigate("/")
        }, (error) => {
            const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
            setErrorMessage(errorMessage);
        })
    }

    const logout = () => {
        console.log(user)
        setUser(null)
        axios.post("http://localhost:4941/api/v1/users/logout").then((response) => {
            console.log(response)
        }, (error) => {
            console.error(error)
        })
    }

    const register = (): void => {
        let registerRequest = `http://localhost:4941/api/v1/users/register`
        axios.post(registerRequest, {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password
        }).then((response) => {
            let loginRequest = `http://localhost:4941/api/v1/users/login`
            axios.post(loginRequest, {
                email: email,
                password: password
            }).then((response) => {
                getAndSetUser(response.data.userId, response.data.token)
            }, (error) => {
                const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
                setErrorMessage(errorMessage);
            })
        }, (error) => {
            const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
            setErrorMessage(errorMessage);
        })
    }

    useEffect(() => {
        setTheme(LightTheme)
    })

    useEffect(() => {
        setIsModalOpen(user != null)
    }, user)

    return (
        <div className={css({ background: "linear-gradient(0deg, rgba(0,40,150,1) 0%, rgba(19,137,200,1) 100%)", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" })}>
            <Block className={css({ display: "flex", flexDirection: "column", maxWidth: "450px", justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto", width: "100%", backgroundColor: "white", borderRadius: "24px", padding: "24px" })}>
                <div className={css({width: "100%", fontSize: theme.typography.HeadingMedium.fontSize, fontWeight: theme.typography.HeadingMedium.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "24px"})}>
                    Impro.vement starts here
                </div>

                <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "16px", paddingTop: "24px"})}>
                    Name
                </div>
                <div style={{ display: "flex", columnGap: "16px" }}>
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
                    Password
                </div>
                <Input
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    placeholder="Enter your new password"
                    type="password"
                />

                <Button style={{ marginTop: "48px", width: "60%" }} onClick={() => {register()}}>
                    Register
                </Button>

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

                <StyledDivider $size={DIVIDER_SIZE.section} className={css({ width: "100%", marginTop: "24px"})} />

                <div className={css({width: "100%", fontSize: theme.typography.ParagraphMedium.fontSize, fontWeight: theme.typography.ParagraphXSmall.fontWeight, paddingTop: "0px", textAlign: "center"})}>
                    <Button style={{ marginTop: "18px", marginLeft: "16px", marginRight: "16px", width: "80px" }} kind={BUTTON_KIND.secondary} size={BUTTON_SIZE.compact} shape={SHAPE.pill}
                        onClick={() => {navigate("/login")}}
                    >
                        Login
                    </Button>
                    or
                    <Button style={{ marginTop: "18px", marginLeft: "16px", width: "160px" }} kind={BUTTON_KIND.secondary} size={BUTTON_SIZE.compact} shape={SHAPE.pill}
                            onClick={() => {navigate("/")}}
                    >
                        Continue as guest
                    </Button>
                </div>
                
                
            </Block>

            <Modal
                // onClose={() => setIsModalOpen(false)}
                closeable={false}
                isOpen={isModalOpen}
                animate
                autoFocus
                size={SIZE.default}
                role={ROLE.dialog}
            >
                <ModalHeader>Looks like you're already logged in!</ModalHeader>
                <ModalBody>
                    To register a new account you must not already be logged in. You can either log out or go back to the home page.
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={BUTTON_KIND.secondary} onClick={() => {navigate("/")}}>
                        Home
                    </ModalButton>
                    <ModalButton onClick={() => {logout()}}>
                        Log out
                    </ModalButton>
                </ModalFooter>
            </Modal>
        </div>
    )
}
