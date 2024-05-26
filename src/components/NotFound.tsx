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
import SupportTierList from '../components/SupportTierList';
import PetitionCard from '../components/PetitionCard';
import {usePersistentStore} from "../store"
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE as MODAL_SIZE} from "baseui/modal";
import { Select } from 'baseui/select';
import { Textarea } from 'baseui/textarea';
import { Input } from 'baseui/input';
import { Notification, KIND as NOTIFICATION_KIND} from "baseui/notification";


export default function PetitionPage() {
    const [css, theme] = useStyletron()

    const navigate = useNavigate()

    return (
        <div className={css({ maxWidth: "1200px", margin: "0 auto", padding: "16px", paddingTop: "48px", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "32px", color: theme.colors.primary })}>
            <HeadingLevel>
                <Heading>404 not found</Heading>
            </HeadingLevel>
        </div>
    )
}
