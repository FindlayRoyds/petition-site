import React from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import PetitionCard from './components/PetitionCard'
import PetitionPage from './pages/PetitionPage'
import PetitionCardList from './components/PetitionCardList'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UploadAvatarPage from "./pages/UploadAvatarPage";
import CreatePetitionPage from './pages/CreatePetitionPage'
import AccountPage from './pages/AccountPage'
import MyPetitions from './pages/MyPetitions'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/petitions" element={<MainLayout><PetitionCardList/></MainLayout>}/>
                <Route path="/petitions/search" element={<MainLayout><PetitionCardList/></MainLayout>}/>
                <Route path="/" element={<MainLayout>No home page yet</MainLayout>}/>
                <Route path="/petition/:id" element={<MainLayout><PetitionPage/></MainLayout>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/upload-avatar" element={<UploadAvatarPage/>}/>
                <Route path="/create-petition" element={<MainLayout><CreatePetitionPage/></MainLayout>}/>
                <Route path="/account" element={<MainLayout><AccountPage/></MainLayout>}/>
                <Route path="/my-petitions" element={<MainLayout><MyPetitions/></MainLayout>}/>
                <Route path="*" element={<MainLayout>404 not found</MainLayout>}/>
            </Routes>
        </Router>
    )
}

export default App