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
import SupportTierList from '../components/SupportTierList';
import PetitionCard from '../components/PetitionCard';
import { Input } from 'baseui/input';
import { FormControl } from "baseui/form-control";
import { Notification, KIND as NOTIFICATION_KIND} from "baseui/notification";
import { ReactElement } from 'react';
import {usePersistentStore} from "../store"
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";
import {KIND as BUTTON_KIND} from "baseui/button/constants";
import { FileUploader } from "baseui/file-uploader";
import { Textarea } from 'baseui/textarea';
import { Select } from 'baseui/select';

type SupportTierCreatorProps = {
    index: number;
    onChange: (index: number, title: string, description: string, cost: string) => void;
}

export default function SupportTierCreator(props: SupportTierCreatorProps): ReactElement {
    const [css, theme] = useStyletron()
    const navigate = useNavigate()
    const setUser = usePersistentStore(state => state.setUser)
    const user = usePersistentStore(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(user == null)
    const [categories, setCategories] = React.useState<Category[]>([])

    const [errorMessage, setErrorMessage] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { index, onChange } = props;

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [cost, setCost] = React.useState("");

    useEffect(() => {
        onChange(index, title, description, cost);
    }, [title, description, cost]);

    return (
        <div style={{ width: "100%", boxSizing: "border-box" }}>
            <Block style={{ borderRadius: "12px", outline: `${theme.borders.border400.borderColor} solid 1px`, padding: "24px", width: "100%", boxSizing: "border-box" }}>
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
                </div>
            </Block>
        </div>
    )
}
