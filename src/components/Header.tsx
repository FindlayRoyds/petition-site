import * as React from "react"
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { Avatar } from "baseui/avatar";
import {usePersistentStore} from "../store"
import axios from "axios";
import {Button, KIND, SHAPE, SIZE} from "baseui/button";
import {useNavigate} from "react-router-dom";
import {PLACEMENT, Popover, StatefulPopover} from "baseui/popover";
import {Block} from "baseui/block";
import {Input} from "baseui/input";
import { StatefulMenu } from "baseui/menu";
import {useEffect} from "react";


export default () => {
    const [css, theme] = useStyletron()
    const user = usePersistentStore(state => state.user)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = React.useState(false);
    const setUser = usePersistentStore(state => state.setUser)
    const themeStore = usePersistentStore(state => state.theme)
    const setTheme = usePersistentStore(state => state.setTheme)

    const [imageSrc, setImageSrc] = React.useState("")

    const logout = () => {
        setUser(null)
        axios.post("http://localhost:4941/api/v1/users/logout", {}, {
            headers: {
                'X-Authorization': user.token // Add this line
            }
        }).then(() => {
            
        }, (error) => {
            console.error(error)
        })
    }

    const switchTheme = () => {
        if (themeStore.name == "dark-theme") {
            setTheme(LightTheme)
        } else {
            setTheme(DarkTheme)
        }
    }

    useEffect(() => {
        if (user != null) {
            setImageSrc(`http://localhost:4941/api/v1/users/${user.userId}/image?${Date.now()}`)
        }
    }, [user?.userId])

    return (
        <div className={css({
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            height: "65px",
            width: "100%",
            paddingLeft: "25px",
            paddingRight: "25px",
            boxSizing: "border-box",
            borderBottom: `${theme.borders.border300.borderWidth} ${theme.borders.border300.borderStyle} ${theme.borders.border300.borderColor}`,
        })}>
            <div className={css({
                marginRight: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px"
            })}>
                <Logo/>
                <Button kind={KIND.tertiary} style={{ fontSize: theme.typography.ParagraphMedium.fontSize, marginLeft: "24px" }} shape={SHAPE.pill}
                    onClick={() => {navigate("/petitions")}}
                >
                    View Petitions
                </Button>
                {user != null &&
                    <Button kind={KIND.tertiary} style={{ fontSize: theme.typography.ParagraphMedium.fontSize }} shape={SHAPE.pill}
                        onClick={() => {navigate("/create-petition")}}
                    >
                        Create Petition
                    </Button>
                }
            </div>
            <div className={css({margin: "auto"})}></div>
            <div className={css({
                marginLeft: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px"
            })}>
                <SearchBar/>
                {user != null &&
                    <StatefulPopover
                        placement={PLACEMENT.bottomRight}
                        content={
                            <StatefulMenu
                                items={[
                                    {label: "View Profile"},
                                    {label: "My Petitions"},
                                    {label: "Toggle Theme"},
                                    {label: "Logout"},
                                ]}
                                onItemSelect={({item}) => {
                                    if (item.label === "View Profile") {
                                        navigate("/account");
                                    } else if (item.label === "Logout") {
                                        logout()
                                    } else if (item.label === "Toggle Theme") {
                                        switchTheme()
                                    } else if (item.label === "My Petitions") {
                                        navigate("/my-petitions")
                                    }
                                }}
                                overrides={{
                                    ListItem: {
                                        style: ({ $theme }) => ({
                                            fontSize: $theme.typography.ParagraphMedium.fontSize,
                                            padding: "16px"
                                        }),
                                    },
                                }}
                            />
                        }
                    >
                        <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
                            <Avatar
                                name={`${user.firstName} ${user.lastName}`}
                                size="scale1000"
                                src={imageSrc}
                            />
                        </div>
                    </StatefulPopover>
                }
                {user == null &&
                    <Button onClick={() => {navigate("/login")}} kind={KIND.tertiary}
                        overrides={{
                            BaseButton: {
                                style: ({ $theme }) => ({
                                    boxShadow: `inset 0px 0px 0px 2px ${$theme.colors.primary}`,
                                })
                            }
                        }}
                    >
                        Login
                    </Button>
                }
                {user == null &&
                    <Button onClick={() => {navigate("/register")}}>
                        Register
                    </Button>
                }
            </div>
        </div>
    )
}