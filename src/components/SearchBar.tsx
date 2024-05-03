import * as React from "react";
import {Search, Show} from "baseui/icon";
import { Input } from "baseui/input";
import {Button, KIND, SHAPE, SIZE} from "baseui/button";
import {useStyletron} from "baseui";

export default function SearchBar() {
    const [css, theme] = useStyletron()
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className={css({width: isFocused ? '700px' : '300px', transition: 'width 0.3s'})}>
            <Input
                onFocus={handleFocus}
                onBlur={handleBlur}
                endEnhancer={
                    <button className={css({backgroundColor: "transparent", border: "0px solid black"})} onClick={() => {console.log("search pressed")}}>
                        <Search size={24} $color={theme.colors.primary}/>
                    </button>
                }
                placeholder={isFocused ? "" : "Search petitions"}

            />
        </div>
    );
}