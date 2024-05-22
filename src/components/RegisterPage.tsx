import React, { ReactNode, useState } from 'react';
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
import SupportTierList from './SupportTierList';
import PetitionCard from './PetitionCard';
import { Input } from 'baseui/input';


export default function RegisterPage() {
    const [css, theme] = useStyletron()
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className={css({ background: "linear-gradient(0deg, rgba(0,40,126,1) 0%, rgba(19,137,200,1) 100%)", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" })}>
            <Block className={css({ display: "flex", flexDirection: "column", maxWidth: "450px", justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto", width: "100%", backgroundColor: "white", borderRadius: "24px", padding: "24px" })}>
                <div className={css({width: "100%", fontSize: theme.typography.HeadingMedium.fontSize, fontWeight: theme.typography.HeadingMedium.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "24px"})}>
                    Impro.vement starts here
                </div>

                <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "24px"})}>
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
                <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "24px"})}>
                    Email
                </div>
                <Input
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    placeholder="Enter a valid email address"
                />
                <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "24px"})}>
                    Password
                </div>
                <Input
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    placeholder="Enter your new password"
                    type="password"
                />

                <Button style={{ marginTop: "48px", width: "60%" }}>
                    Register
                </Button>

                <StyledDivider $size={SIZE.section} className={css({ width: "100%", marginTop: "24px"})} />

                <div className={css({width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingTop: "24px", textAlign: "center"})}>
                    Already have an account?
                </div>
                <Button style={{ marginTop: "18px", width: "50%" }} kind={KIND.secondary}>
                    Login
                </Button>
                
            </Block>
        </div>
    )
}
