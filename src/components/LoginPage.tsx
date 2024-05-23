import React, {ReactNode, useEffect, useState} from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button, KIND, SHAPE, SIZE as BUTTON_SIZE } from "baseui/button";
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
import SupportTierList from './SupportTierList';
import PetitionCard from './PetitionCard';
import { Input } from 'baseui/input';
import { FormControl } from "baseui/form-control";
import { Notification, KIND as NOTIFICATION_KIND} from "baseui/notification";
import { ReactElement } from 'react';
import {usePersistentStore} from "../store"


export default function LoginPage(): ReactElement {
    const [css, theme] = useStyletron()
    const navigate = useNavigate()
    // const setToken = usePersistentStore(state => state.setToken)
    // const setUserId = usePersistentStore(state => state.setUserId)
    const setUser = usePersistentStore(state => state.setUser)
    const setTheme = usePersistentStore(state => state.setTheme)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")


    const getAndSetUser = (userId: number, token: string) => {
        let apiRequest = `http://localhost:4941/api/v1/users/${userId}`
        axios.get(apiRequest).then((response) => {
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

    const login = (): void => {
        let apiRequest = `http://localhost:4941/api/v1/users/login`
        axios.post(apiRequest, {
            email: email,
            password: password
        }).then((response) => {
            getAndSetUser(response.data.userId, response.data.token)
        }, (error) => {
            const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
            setErrorMessage(errorMessage);
        })
    }

    useEffect(() => {
        setTheme(LightTheme)
    })

    return (
        <div className={css({ background: "linear-gradient(0deg, rgba(0,40,150,1) 0%, rgba(19,137,200,1) 100%)", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" })}>
            <Block className={css({ display: "flex", flexDirection: "column", maxWidth: "450px", justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto", width: "100%", backgroundColor: "white", borderRadius: "24px", padding: "24px" })}>
                <div className={css({ width: "100%", fontSize: theme.typography.HeadingMedium.fontSize, fontWeight: theme.typography.HeadingMedium.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "24px" })}>
                    Welcome back!
                </div>

                <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "16px", paddingTop: "24px" })}>
                    Email
                </div>
                <Input
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    placeholder="Enter your email address"
                />
                <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "16px", paddingTop: "24px" })}>
                    Password
                </div>
                <Input
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    placeholder="Enter your password"
                    type="password"
                />

                <Button style={{ marginTop: "48px", width: "60%" }} onClick={() => { login() }}>
                    Login
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

                <StyledDivider $size={DIVIDER_SIZE.section} className={css({ width: "100%", marginTop: "24px" })} />

                <div className={css({ width: "100%", fontSize: theme.typography.ParagraphMedium.fontSize, fontWeight: theme.typography.ParagraphXSmall.fontWeight, paddingTop: "12px", textAlign: "center" })}>
                    Don't have an account?<br/>
                    <Button style={{ marginTop: "18px", marginLeft: "16px", marginRight: "16px", width: "80px" }} kind={KIND.secondary} size={BUTTON_SIZE.compact} shape={SHAPE.pill}
                            onClick={() => {navigate("/register")}}
                    >
                        Register
                    </Button>
                    or
                    <Button style={{ marginTop: "18px", marginLeft: "16px", width: "160px" }} kind={KIND.secondary} size={BUTTON_SIZE.compact} shape={SHAPE.pill}
                            onClick={() => {navigate("/")}}
                    >
                        Continue as guest
                    </Button>
                </div>


            </Block>
        </div>
    )
}
