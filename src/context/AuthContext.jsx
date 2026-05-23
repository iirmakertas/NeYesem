import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to auth state and Firestore user profile
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setUserData(null);
                setLoading(false);
            }
        });

        // Safety timeout to prevent getting stuck on loading screen
        const safetyTimeout = setTimeout(() => {
            setLoading(prev => {
                if (prev) {
                    console.warn('Auth loading timed out after 5s. Forcing UI to load.');
                    return false;
                }
                return prev;
            });
        }, 5000);

        return () => {
            unsubscribeAuth();
            clearTimeout(safetyTimeout);
        };
    }, []);

    // Listen to Firestore user document when user changes
    useEffect(() => {
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
                setLoading(false);
            } else {
                // Self-healing: If user profile document is missing, create it
                try {
                    // 1. Look up if they have a reserved username in /usernames
                    const usernamesRef = collection(db, 'usernames');
                    const q = query(usernamesRef, where('uid', '==', user.uid));
                    const usernameSnap = await getDocs(q);
                    
                    let finalUsername = user.email.split('@')[0];
                    if (!usernameSnap.empty) {
                        finalUsername = usernameSnap.docs[0].id;
                    }

                    // 2. Create the user document
                    const newProfile = {
                        username: finalUsername.toLowerCase(),
                        displayName: finalUsername,
                        email: user.email,
                        createdAt: new Date().toISOString(),
                        uid: user.uid
                    };
                    await setDoc(userDocRef, newProfile);
                    setUserData(newProfile);
                } catch (err) {
                    console.error("Self-healing user document creation failed:", err);
                    setUserData(null);
                }
                setLoading(false);
            }
        }, (error) => {
            console.error('User profile listener error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Check if a username is already taken
    const checkUsernameAvailable = async (username) => {
        const docRef = doc(db, 'usernames', username.toLowerCase());
        const docSnap = await getDoc(docRef);
        return !docSnap.exists();
    };

    const signUp = async (email, password, username) => {
        // Check username uniqueness first
        const isAvailable = await checkUsernameAvailable(username);
        if (!isAvailable) {
            throw { code: 'auth/username-taken', message: 'Bu kullanıcı adı zaten kullanılıyor.' };
        }

        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
            username: username.toLowerCase(),
            displayName: username,
            email: email,
            createdAt: new Date().toISOString(),
            uid: result.user.uid
        });

        // Reserve the username in the usernames collection
        await setDoc(doc(db, 'usernames', username.toLowerCase()), {
            uid: result.user.uid
        });

        await sendEmailVerification(result.user);
        return result;
    };

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result;
    };

    const logout = async () => {
        await signOut(auth);
    };

    const resendVerification = async () => {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    };

    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    const value = {
        user,
        userData,
        setUserData,
        loading,
        signUp,
        login,
        logout,
        resendVerification,
        resetPassword,
        checkUsernameAvailable
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
