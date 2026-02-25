import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        const favRef = collection(db, 'users', user.uid, 'favorites');
        const unsubscribe = onSnapshot(favRef, (snapshot) => {
            const favs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFavorites(favs);
            setLoading(false);
        }, (error) => {
            console.error('Favorites sync error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleFavorite = async (meal) => {
        if (!user) return;

        const favDocRef = doc(db, 'users', user.uid, 'favorites', String(meal.id));
        const exists = favorites.some(f => f.id === String(meal.id));

        try {
            if (exists) {
                await deleteDoc(favDocRef);
            } else {
                await setDoc(favDocRef, {
                    name: meal.name,
                    category: meal.category,
                    ingredients: meal.ingredients,
                    recipe: meal.recipe,
                    addedAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
        }
    };

    const isFavorite = (mealId) => {
        return favorites.some(f => f.id === String(mealId));
    };

    return { favorites, loading, toggleFavorite, isFavorite };
}
