import React, {ReactNode, useEffect, useState} from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button, KIND, SHAPE, SIZE as BUTTON_SIZE } from "baseui/button";
import { Petition, Category, SupportTier } from "../types"; // Import the Petition interface
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
import SupportTierCreator from '../components/SupportTierCreator';


type CategoryItem = {
    id: string;
    label: string
};


export default function CreatePetitionPage(): ReactElement {
    const [css, theme] = useStyletron()
    const navigate = useNavigate()
    const setUser = usePersistentStore(state => state.setUser)
    const user = usePersistentStore(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(user == null)
    const [categories, setCategories] = React.useState<Category[]>([])

    const [errorMessage, setErrorMessage] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedCategory, setSelectedCategory] = React.useState<CategoryItem>();
    const [supportTiers, setSupportTiers] = React.useState([{title: "test tier", description: "testest", cost: 13}]);

    const getCategories = () => {
        let apiRequest = "http://localhost:4941/api/v1/petitions/categories"
        axios.get(apiRequest)
        .then((response) => {
            const updatedData = response.data.map((item: { categoryId: any; name: any; }) => ({
                id: String(item.categoryId),
                label: item.name,
            }));
            setCategories(updatedData);
        }, (error) => {
            console.log("error :(")
        })
    }

    const handleSupportTierChange = (index: number, title: string, description: string, cost: string) => {
        setSupportTiers(prevTiers => {
            const newTiers = [...prevTiers];
            newTiers[index] = { title, description, cost: parseInt(cost) };
            return newTiers;
        });
    };

    const createPetition = () => {
        if (selectedFile) {
            let apiRequest = `http://localhost:4941/api/v1/petitions`
            axios.post(apiRequest, {
                title: title,
                description: description,
                categoryId: parseInt(selectedCategory?.id || ""),
                supportTiers: supportTiers,
            }, {
                headers: {
                    'X-Authorization': user.token // Add this line
                }
            }).then((response) => {
                const createdId = response.data.petitionId
                const reader = new FileReader();
                reader.onload = async function() {
                    const arrayBuffer = this.result;
                    // replace `petitionId` with the actual id of the petition
                    let apiRequest = `http://localhost:4941/api/v1/petitions/${createdId}/image`
                    axios.put(apiRequest, arrayBuffer, {
                        headers: {
                            'Content-Type': selectedFile.type,
                            'X-Authorization': user.token
                        }
                    }).then((response) => {
                        navigate(`/petition/${createdId}`)
                    }, (error) => {
                        const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
                        setErrorMessage(errorMessage);
                    })
                };
                reader.readAsArrayBuffer(selectedFile);
            }, (error) => {
                const errorMessage = error.response.statusText.replace("Bad Request: data/", "");
                setErrorMessage(errorMessage);
            })
        } else {
            setErrorMessage("Please select an image for the petition")
        }
    }

    useEffect(() => {
        setIsModalOpen(user == null)
    }, [user])

    useEffect(() => {
        getCategories()
    })

    return (
        <div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "24px", marginBottom: "48px" }}>
                <Block style={{ borderRadius: "12px", outline: `${theme.borders.border400.borderColor} solid 1px`, padding: "24px", maxWidth: "600px", width: "100%" }}>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", rowGap: "24px", width: "100%" }}>
                    <div className={css({ width: "100%", fontSize: theme.typography.HeadingMedium.fontSize, fontWeight: theme.typography.HeadingMedium.fontWeight, paddingBottom: "12px", paddingLeft: "32px", paddingTop: "24px" })}>
                        Create a petition
                    </div>
                        
                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Petition Image
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
                                <AspectRatioBox style={{ width: "400px"}}>
                                    <AspectRatioBoxBody>
                                        {previewUrl?
                                            <img
                                                src={previewUrl}
                                                className={css({width: "100%", height: "100%", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", borderTopLeftRadius: "14px", borderTopRightRadius: "14px"})}
                                            />
                                            : <Skeleton height="100%" width="100%" animation overrides={{
                                                Root: {
                                                style: ({ $theme }) => ({
                                                    borderRadius: "20px"
                                                })
                                                }
                                            }}>
                                            </Skeleton>
                                        }
                                    </AspectRatioBoxBody>
                                </AspectRatioBox>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", columnGap: "12px" }}>
                                    <Button style={{ marginTop: "24px", width: "50%" }} onClick={() => {setPreviewUrl(null)}} kind={KIND.secondary}>
                                        Remove image
                                    </Button>
                                </div>
                            </div>
                        }

                        <StyledDivider $size={DIVIDER_SIZE.section} className={css({ width: "100%", marginTop: "24px" })} />

                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Title
                        </div>
                        <Input
                            value={title}
                            onChange={(event) => setTitle(event.currentTarget.value)}
                            placeholder="Enter a title for the petition"
                        />

                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Description
                        </div>
                        <Textarea
                            value={description}
                            onChange={(event) => setDescription(event.currentTarget.value)}
                            placeholder="Enter a description for the petition"
                        />

                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Category
                        </div>
                        <Select
                            overrides={{
                                ControlContainer: {
                                style: ({ $theme }) => ({
                                    cursor: "pointer"
                                })
                                }
                            }}
                            options={categories.sort((a, b) => a.name?.localeCompare(b.name))}
                            value={selectedCategory == null ? [] : [selectedCategory]}
                            placeholder="Select a Category"
                            onChange={params => setSelectedCategory(params.value[0] as CategoryItem)}
                            searchable={false}
                            clearable={false}
                        />

                        <div className={css({ width: "100%", fontSize: theme.typography.HeadingXSmall.fontSize, fontWeight: theme.typography.ParagraphLarge.fontWeight, paddingBottom: "0", paddingLeft: "16px", paddingTop: "0" })}>
                            Support Tiers
                        </div>
                        <div style={{ width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", rowGap: "12px" }}>
                            {supportTiers.map((tier, index) => {
                                return (
                                    <SupportTierCreator
                                        key={index}
                                        index={index}
                                        onChange={handleSupportTierChange}
                                    />
                                )
                            })}
                        </div>
                        <div style={{ display: "flex", columnGap: "24px" }}>
                            <Button
                                disabled={supportTiers.length >= 3}
                                onClick={() => {
                                    setSupportTiers([...supportTiers, {title: "", description: "", cost: 0}])
                                }}
                            >
                                Add support tier
                            </Button>
                            <Button
                                disabled={supportTiers.length <= 1}
                                onClick={() => {
                                    setSupportTiers(supportTiers.slice(0, supportTiers.length - 1))
                                }}
                            >
                                Remove support tier
                            </Button>
                        </div>

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

                        <Button onClick={() => createPetition()}>
                            Create petition
                        </Button>
                    </div>
                </Block>
            </div>
            
            <Modal
                // onClose={() => setIsModalOpen(false)}
                closeable={false}
                isOpen={isModalOpen}
                animate
                autoFocus
                size={SIZE.default}
                role={ROLE.dialog}
            >
                <ModalHeader>Looks like you aren't logged in!</ModalHeader>
                <ModalBody>
                    To create a petition you must be logged in. You can either log in or go back to the home page.
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={BUTTON_KIND.secondary} onClick={() => {navigate("/")}}>
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
