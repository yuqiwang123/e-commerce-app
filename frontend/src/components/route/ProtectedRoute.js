import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';

const ProtectedRoute = ({isAdmin}) => {
    
    const { isAuthenticated, loading, user} = useSelector(state => state.auth)

    if(!loading) {
        return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
    }
    if(isAdmin === true) {
        return user.role === 'admin' ? <Outlet /> : <Navigate to="/" />
    }
}

export default ProtectedRoute
