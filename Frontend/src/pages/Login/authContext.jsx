import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('usuarioId');
        
        if (storedToken && storedUserId) {

            try {
                const decodedToken = jwtDecode(storedToken);

                if (decodedToken && Date.now() < decodedToken.exp * 1000) {
                    setIsAuthenticated(true);
                } else {
                    logout(); 
                }
            } catch (error) {
                logout(); 
            }
        }
    }, []);

    const login = (token, usuarioId) => {
        setIsAuthenticated(true);
        setUserId(usuarioId);
        localStorage.setItem('token', token); 
        localStorage.setItem('usuarioId', usuarioId);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId'); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
            {children}
        </AuthContext.Provider>
    );
};