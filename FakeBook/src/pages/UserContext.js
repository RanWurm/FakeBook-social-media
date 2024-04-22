import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to use the context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     // Check for user data in local storage when app loads
    //     const userData = localStorage.getItem('user');
    //     if (userData) {
    //         setUser(JSON.parse(userData));
    //     }
    // }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
        setUser(userData); // Update the user state
    };

    const logout = () => {
        localStorage.removeItem('user'); // Remove user data from local storage
        setUser(null); // Reset the user state
    };

    // The context value that will be supplied to any descendants of this component.
    const contextValue = {
        user,
        login,
        logout
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
