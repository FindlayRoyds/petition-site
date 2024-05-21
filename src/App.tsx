import React from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import PetitionCard from './components/PetitionCard'
import PetitionPage from './components/PetitionPage'
import PetitionCardList from './components/PetitionCardList'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/search" element={<MainLayout><PetitionCardList/></MainLayout>}/>
                <Route path="/petition/:id" element={<MainLayout><PetitionPage/></MainLayout>}/>
                <Route path="/user/:id" element={<MainLayout>user</MainLayout>}/>
                <Route path="*" element={<MainLayout>404 not found</MainLayout>}/>
            </Routes>
        </Router>
    )
}

export default App