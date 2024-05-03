import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    return (
        <>
            <Header></Header>
            <main>
                <Outlet /> {/* This is where the child routes will render */}
            </main>
            <footer>
                {/* Your footer content */}
            </footer>
        </>
    );
};

export default Layout;