import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom'
import Header from './Header'
import {useStyletron} from "baseui"

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header></Header>
      <main>
        <Outlet /> {/* This is where the child routes will render */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;