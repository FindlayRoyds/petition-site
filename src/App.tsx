import React from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import PetitionCard from './components/PetitionCard'
import PetitionCardList from './components/PetitionCardList'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/test" element={<MainLayout><PetitionCardList/></MainLayout>}/>
                <Route path="*" element={<MainLayout/>}/>
            </Routes>
        </Router>
    )
}

export default App