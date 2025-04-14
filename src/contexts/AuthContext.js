/* eslint-disable react/display-name */
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

const AuthContext = createContext();

const getBaseURL = () =>
    process.env.NODE_ENV === 'production'
        ? 'https://laravel-smmnesia.vercel.app/api/api'
        : 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            const userFromStorage = localStorage.getItem('user');

            if (userFromStorage) {
                try {
                    setUser(JSON.parse(userFromStorage));
                } catch (err) {
                    console.warn('Invalid user data in localStorage');
                    localStorage.removeItem('user');
                }
            }

            if (!token) return setLoading(false);

            try {
                const response = await fetch(`${getBaseURL()}/check-auth`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = await response.json();

                if (result.success) {
                    setUser(result.data.user);
                    console.log('✅ Auth check success:', result.data.user);
                } else {
                    console.warn('❌ Token invalid or expired:', result);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (error) {
                console.error('❌ Error checking auth:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${getBaseURL()}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const res = await response.json();
            const { success, message, data } = res;

            if (!response.ok || !success) {
                console.error('❌ Login failed:', res);
            }

            if (success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                console.log('✅ Login success:', data.user);
            }

            return { success, message };
        } catch (error) {
            console.error('❌ Login error (network/server):', error);
            return { success: false, message: 'An error occurred during login' };
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const response = await fetch(`${getBaseURL()}/logout`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const res = await response.json();
                if (!res.success) {
                    console.warn('⚠️ Logout request failed on server:', res.message);
                } else {
                    console.log('✅ Logout successful');
                }
            } catch (error) {
                console.error('❌ Logout request failed:', error);
            }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const withAuth = (Component) => {
    return (props) => {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                console.warn('🔒 User not authenticated, redirecting...');
                router.push('/auth/login');
            }
        }, [user, loading, router]);

        if (loading) {
            return (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <Loading className="loading-spinner loading-xl" />
                </div>
            );
        }

        return user ? <Component {...props} /> : null;
    };
};