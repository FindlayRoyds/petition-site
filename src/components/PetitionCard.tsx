import React, { ReactNode } from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button } from "baseui/button";
import { Petition } from "../types"; // Import the Petition interface
import { Skeleton } from 'baseui/skeleton';
import { Block } from "baseui/block";
import { AspectRatioBox, AspectRatioBoxBody } from "baseui/aspect-ratio-box";


interface PetitionCardProps {
    petition: Petition;
}

export default function PetitionCard({ petition }: PetitionCardProps) {
    const [css, theme] = useStyletron()
    const date = new Date(petition.creationDate);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    const [isImageLoaded, setImageLoaded] = React.useState(false);
    const image = new Image();
    image.src = `http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`;
    image.onload = () => setImageLoaded(true);

    // <Card
    //     overrides={{
    //         Contents: {
    //             style: ({ $theme }) => ({
    //                 flex: 1,
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //             })
    //         },
    //         Root: {
    //             style: ({ $theme }) => ({
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //             })
    //         },
    //         Body: {
    //             style: ({ $theme }) => ({
    //                 marginBottom: 0, display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 0
    //             })
    //           }
    //       }}
    //         headerImage={isImageLoaded ? image.src : <Skeleton height="200px" width="100%" animation />}
    //         title={petition.title}
    //     >
    //         <StyledBody $style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 0 }}>
    //             <div>
                    
    //             </div>
    //             <div style={{ marginTop: 'auto' }}>
    //                 Created: {formattedDate}
    //                 <Button overrides={{ BaseButton: { style: { width: "100%", marginTop: "16px" } } }}>
    //                     Support for { petition.supportingCost == 0? "free" : "$" + petition.supportingCost }
    //                 </Button>
    //             </div>
    //         </StyledBody>
    //     </Card>

    return (
        <Block overrides={{
            Block: {
                style: {
                    border: `2px ${theme.borders.border400.borderStyle} ${theme.borders.border400.borderColor}`,
                    borderRadius: theme.borders.radius500,
                },
            },
        }}>
            <div className={css({height: "100%", display: 'flex', flexDirection: 'column'})}>
                <div className={css({padding: "8px"})}>
                    <AspectRatioBox>
                        <AspectRatioBoxBody>
                            {isImageLoaded?
                                <img src={image.src} className={css({width: "100%", height: "100%", borderRadius: theme.borders.radius300})}/>
                                : <Skeleton height="100%" width="100%" animation overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({
                                        borderRadius: theme.borders.radius300
                                    })
                                    }
                                }}>
                                </Skeleton>}
                        </AspectRatioBoxBody>
                    </AspectRatioBox>
                </div>
                <div className={css({padding: "24px", paddingTop: "12px", flex: 1, display: 'flex', flexDirection: 'column'})}>
                    <div className={css({fontSize:theme.typography.HeadingSmall.fontSize, fontWeight:theme.typography.HeadingSmall.fontWeight, marginBottom: "12px"})}>
                        {petition.title}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                        Created: {formattedDate}
                        <Button overrides={{ BaseButton: { style: { width: "100%", marginTop: "16px" } } }}>
                            Support for { petition.supportingCost == 0? "free" : "$" + petition.supportingCost }
                        </Button>
                    </div>
                </div>
            </div>
        </Block>
    );
}


