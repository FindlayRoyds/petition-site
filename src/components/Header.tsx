import * as React from "react"
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { Avatar } from "baseui/avatar";
import {usePersistentStore} from "../store"
import axios from "axios";
import {Button, KIND} from "baseui/button";
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

    const logout = () => {
        console.log(user)
        setUser(null)
        axios.post("http://localhost:4941/api/v1/users/logout").then((response) => {
            console.log(response)
        }, (error) => {
            console.error(error)
        })
    }

    useEffect(() => {
        if (user != null) {
            console.log("user: " + user == null)
            console.log(user.length == 0)
            // type of user
            console.log(typeof user)
        }
    })

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
                                    {label: "Logout"},
                                    {label: "Item Three"},
                                    {label: "Item Four"}
                                ]}
                                onItemSelect={({item}) => {
                                    if (item.label === "View Profile") {
                                        navigate("/profile");
                                    } else if (item.label === "Logout") {
                                        logout()
                                    }
                                }}
                            />
                        }
                    >
                        <div onClick={() => setIsOpen(!isOpen)}>
                            <Avatar
                                name={`${user.firstName} ${user.lastName}`}
                                size="scale1000"
                                src={`http://localhost:4941/api/v1/users/${user.userId}/image`}
                            />
                        </div>
                    </StatefulPopover>
                }
                {user == null &&
                    <Button onClick={() => {navigate("/login")}} kind={KIND.tertiary}
                        overrides={{
                            BaseButton: {
                                style: ({ $theme }) => ({
                                    boxShadow: `inset 0px 0px 0px 2px ${$theme.borders.border500.borderColor}`,
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