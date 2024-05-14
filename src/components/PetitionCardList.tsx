import React, { useState } from 'react';
import PetitionCard from './PetitionCard';
import axios from 'axios';
import { Cell, Grid } from 'baseui/layout-grid';
import { Petition } from '../types'; // Import the Petition type
import { useStyletron } from "baseui";

export default function PetitionCardList() {
    const [css, theme] = useStyletron();

    const [petitions, setPetitions] = useState<Petition[]>([]);

    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions')
                .then((response) => {
                    setPetitions(response.data.petitions);
                }, (error) => {
                    console.log("error :(")
                })
        }
        getPetitions()
    }, [setPetitions])

    return (
        <div className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gridGap: theme.sizing.scale600,
            padding: theme.sizing.scale600,
            width: '100%',
            boxSizing: 'border-box', // Add this line
        })}>
            {petitions.map((petition: Petition, index: any) => (
                <PetitionCard petition={petition}/>
            ))}
        </div>
    );
}