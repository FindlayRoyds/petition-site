import React from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainLayout from "./components/MainLayout"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/users/:id" element={<MainLayout/>}/>
                <Route path="*" element={<MainLayout/>}/>
            </Routes>
        </Router>
    )
}

export default App