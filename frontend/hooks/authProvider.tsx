import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorage';
import * as UserService from '@/service/user.service';
import { Login } from '@/models/event';

interface AuthContextProp {
    signIn: (username: string, password: string) => Promise<Login | any>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextProp>({} as AuthContextProp);


export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: (username: string, password: string) => {
                    return new Promise((resolve, reject) => {
                        console.log(username);
                        if (username != undefined && password != undefined) {
                            UserService.login(username, password).then(response => {
                                setSession(response.data.token);
                                resolve(response);
                            }).catch(error => {
                                reject(error);
                            });
                        }
                        else {
                            reject(new Error('Username or password is undefined'));
                        }
                    })
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}