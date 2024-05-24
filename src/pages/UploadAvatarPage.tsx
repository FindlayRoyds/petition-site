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


export default function UploadAvatarPage(): ReactElement {
    const [css, theme] = useStyletron()
    const navigate = useNavigate()
    const setUser = usePersistentStore(state => state.setUser)
    const setTheme = usePersistentStore(state => state.setTheme)
    const user = usePersistentStore(state => state.user)

    const [errorMessage, setErrorMessage] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleUpload = async () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = async function() {
                const arrayBuffer = this.result;
                let apiRequest = `http://localhost:4941/api/v1/users/${user.userId}/image`
                axios.put(apiRequest, arrayBuffer, {
                    headers: {
                        'Content-Type': selectedFile.type,
                        'X-Authorization': user.token
                    }
                }).then((response) => {
                    navigate("/")
                }, (error) => {
                    const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
                    setErrorMessage(errorMessage);
                })
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    useEffect(() => {
        setTheme(LightTheme)
    })

    return (
        <div className={css({ background: "linear-gradient(0deg, rgba(0,40,150,1) 0%, rgba(19,137,200,1) 100%)", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" })}>
            <Block className={css({ display: "flex", flexDirection: "column", maxWidth: "450px", justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto", width: "100%", backgroundColor: "white", borderRadius: "24px", padding: "24px" })}>
                <div className={css({ width: "100%", fontSize: theme.typography.HeadingMedium.fontSize, fontWeight: theme.typography.HeadingMedium.fontWeight, paddingBottom: "48px", paddingLeft: "32px", paddingTop: "24px" })}>
                    Set a Profile Picture
                </div>

                {previewUrl == null?
                    <FileUploader
                        overrides={{
                            FileDragAndDrop: {
                                style: ({ $theme }) => ({
                                    width: "412px"
                                })
                            }
                        }}
                        onDrop={(acceptedFiles, rejectedFiles) => {
                            const file = acceptedFiles[0];
                            setSelectedFile(file);
                            setPreviewUrl(URL.createObjectURL(file));
                        }}
                    /> :
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Avatar src={previewUrl} size={"300px"}/>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", columnGap: "12px" }}>
                            <Button style={{ marginTop: "24px", width: "50%" }} onClick={() => {setPreviewUrl(null)}} kind={KIND.secondary}>
                                Remove
                            </Button>
                            <Button style={{ marginTop: "24px", width: "50%" }} onClick={handleUpload}>
                                Upload
                            </Button>
                        </div>
                    </div>
                }

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

                <div className={css({ width: "100%", fontSize: theme.typography.ParagraphMedium.fontSize, fontWeight: theme.typography.ParagraphXSmall.fontWeight, paddingTop: "0px", textAlign: "center" })}>
                    or
                    <Button style={{ marginTop: "18px", marginLeft: "16px", width: "130px" }} kind={KIND.secondary} size={BUTTON_SIZE.compact} shape={SHAPE.pill}
                            onClick={() => {navigate("/")}}
                    >
                        Skip this step
                    </Button>
                </div>
            </Block>
        </div>
    )
}
