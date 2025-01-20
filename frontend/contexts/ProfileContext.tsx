import { AuthServices } from '@/services/authentication/authservices';
import { createContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import jwtDecode from "jwt-decode";

type ProfileContextProps = {
    authorized: boolean;
    profile: any;
    violationData: any;
    login: (data: any) => void;
    register: (data: any) => void;
    logout: () => void;
    isLoading: boolean;
};

export const ProfileContext = createContext<ProfileContextProps>({
    authorized: false,
    profile: {},
    violationData: null,
    login: () => { },
    register: () => { },
    logout: () => { },
    isLoading: true,
});

const PUBLIC_ROUTES = ['/login', '/register', '/'];
const ADMIN_ROUTES = ['/admin'];
const USER_ROUTES = ['/map', '/reviews', '/profile'];

export const ProfileProvider = ({ children }: any) => {
    const [authorized, setAuthorized] = useState(false);
    const [profile, setProfile] = useState({});
    const [violationData, setViolationData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        getUserProfile();
    }, []);

    useEffect(() => {
        const handleRouteProtection = async () => {
            const currentPath = router.pathname;
            const profile = localStorage.getItem('profile');
            
            // Don't process anything while initial authentication check is happening
            if (isLoading) return;

            // If user is logged in and tries to access index page, redirect to map
            if (profile && currentPath === '/') {
                router.push('/map');
                return;
            }

            // If user is not logged in and tries to access protected route
            if (!profile && !PUBLIC_ROUTES.includes(currentPath)) {
                router.push('/login');
                return;
            }

            // If user is logged in, handle route access based on user type
            if (profile) {
                const decodedData = jwtDecode(profile) as any;
                const userType = decodedData?.type;

                if (userType === 'admin' && !ADMIN_ROUTES.includes(currentPath) && !PUBLIC_ROUTES.includes(currentPath)) {
                    router.push('/admin');
                    return;
                }

                if (userType === 'normal' && !USER_ROUTES.includes(currentPath) && !PUBLIC_ROUTES.includes(currentPath)) {
                    router.push('/map');
                    return;
                }
            }
        };

        handleRouteProtection();
    }, [router.pathname, isLoading]);

    const getUserProfile = () => {
        setIsLoading(true);
        const profile: any = localStorage.getItem('profile');
        let decodedData = {} as any;
        
        if (!profile) {
            setAuthorized(false);
            setIsLoading(false);
            return;
        }

        try {
            decodedData = jwtDecode(profile);
            if (decodedData && decodedData.email) {
                setProfile({
                    email: decodedData.email,
                    name: decodedData.name,
                    user_type: decodedData.user_type,
                });
                setAuthorized(true);
            } else {
                setAuthorized(false);
                setProfile({});
                console.error("Invalid token data");
            }
        } catch (error: any) {
            console.error("Invalid token data");
            setAuthorized(false);
            setProfile({});
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await AuthServices.callApiLogin(data);
            if (response?.data?.access) {
                const decodedData = jwtDecode(response.data.access) as any;
                setProfile({
                    email: decodedData?.email,
                    name: decodedData?.name,
                    user_type: decodedData?.type,
                });
                setAuthorized(true);
                localStorage.setItem('profile', response.data.access);

                if (decodedData?.type === 'normal') {
                    router.push('/map');
                } else {
                    router.push('/admin');
                }
            } else {
                setAuthorized(false);
            }
        } catch (error: any) {
            if (error?.response?.status === 400) {
                notifications.show({
                    title: 'Error',
                    message: 'Email sau parola incorecte',
                    color: 'red',
                    withBorder: true,
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.red[6],
                            borderColor: theme.colors.red[6],
                            '&::before': { backgroundColor: theme.white },
                        },
                        title: { color: theme.white },
                        description: { color: theme.white },
                        closeButton: {
                            color: theme.white,
                            '&:hover': { backgroundColor: theme.colors.blue[7] },
                        },
                    }),
                });
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await AuthServices.callApiRegister(data);
            if (response?.data) {
                router.push('/login');
            } else {
                setAuthorized(false);
            }
        } catch (error: any) {
            if (error?.response?.status === 400) {
                notifications.show({
                    title: 'Error',
                    message: error?.response?.data,
                    color: 'red',
                    withBorder: true,
                    styles: (theme) => ({
                        root: {
                            backgroundColor: theme.colors.red[6],
                            borderColor: theme.colors.red[6],
                            '&::before': { backgroundColor: theme.white },
                        },
                        title: { color: theme.white },
                        description: { color: theme.white },
                        closeButton: {
                            color: theme.white,
                            '&:hover': { backgroundColor: theme.colors.blue[7] },
                        },
                    }),
                });
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setAuthorized(false);
        setProfile({});
        localStorage.removeItem('profile');
        Cookies.remove('refreshToken');
        router.push('/');
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }
    
    return (
        <ProfileContext.Provider value={{ 
            authorized, 
            profile, 
            login, 
            register, 
            logout, 
            violationData, 
            isLoading 
        }}>
            {children}
        </ProfileContext.Provider>
    );
};