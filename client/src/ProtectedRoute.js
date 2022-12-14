import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from 'AuthContext';

const ProtectedRoute = () => {
	const auth = useContext(AuthContext);
	return auth.token ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
