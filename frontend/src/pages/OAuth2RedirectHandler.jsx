import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const { completeOAuthLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');

        if (token) {
            completeOAuthLogin(token).then(result => {
                if (result.success) {
                    navigate('/analytics', { replace: true });
                } else {
                    navigate('/login', { replace: true, state: { error: result.message } });
                }
            });
        } else {
            navigate('/login', { replace: true, state: { error: 'Authentication failed' } });
        }
    }, [location, navigate, completeOAuthLogin]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Completing login...</h2>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we redirect you.</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
