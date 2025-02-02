import { useSession } from '@/hooks/authProvider';
import { useEffect } from 'react';

export default function Logout() {
    const { signOut } = useSession();
    useEffect(() => {
        signOut();
    }, []);
}