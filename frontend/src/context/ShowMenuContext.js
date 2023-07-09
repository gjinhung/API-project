import { createContext, useContext, useState } from 'react';

export const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export default function MenuProvider({ children }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <MenuContext.Provider
            value={{
                showMenu,
                setShowMenu
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}
