import { Outlet } from 'react-router-dom'
import Header from './Header'
import {useStyletron} from "baseui"

const MainLayout = () => {
    return (
        <div>
            <Header></Header>
            <main>
                <Outlet /> {/* This is where the child routes will render */}
            </main>
        </div>
    )
}

export default MainLayout