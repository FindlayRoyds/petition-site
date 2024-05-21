import React, { ReactNode, useState } from 'react';
import { Card, StyledBody, StyledAction } from "baseui/card";
import {DarkTheme, LightTheme, useStyletron} from "baseui"
import {Heading, HeadingLevel} from 'baseui/heading';
import { Button, KIND } from "baseui/button";
import { Petition, Category } from "../types";
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
import { SupportTier } from '../types';
import { ListItem, ListItemLabel } from "baseui/list";


interface SupportTierListProps {
    tier: SupportTier;
    level: number;
}

export default function SupportTierList({ tier, level }: SupportTierListProps) {
    const [css, theme] = useStyletron()

    const colors = ["gold", "silver", "rgb(176, 141, 87)"]
    const supportButtonTypes = [KIND.primary, KIND.secondary, KIND.secondary]

    return (
        <Block className={css({ maxWidth: "260px", width: "100%", marginTop: (level - 1) * 28 + "px", border: "4px solid " + colors[level - 1], borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", rowGap: "12px" })}>
            <div>
                <div className={css({
                        width: "100%",
                        paddingBottom: "12px",
                        fontSize: theme.typography.HeadingSmall.fontSize, 
                        fontWeight: theme.typography.HeadingSmall.fontWeight,
                        textAlign: "center"
                    })}
                >
                    {tier.title}
                </div>
                <div>
                    {tier.description}
                </div>
            </div>
            
            <div>
                <Button kind={supportButtonTypes[level - 1]}>
                    Support for { "$" + tier.cost}
                </Button>

                <StyledDivider $size={SIZE.section} className={css({ width: "100%"})} />
            </div>
        </Block>
    )
}


