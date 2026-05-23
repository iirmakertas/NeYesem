import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export function useMyRecipes() {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setRecipes([]);
            setLoading(false);
            return;
        }

        const recipesRef = collection(db, 'users', user.uid, 'myRecipes');
        const q = query(recipesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const userRecipes = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecipes(userRecipes);
                setLoading(false);
            } catch (err) {
                console.error('Error parsing user recipes:', err);
                setLoading(false);
            }
        }, (error) => {
            console.error('My recipes sync error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addRecipe = async (recipeData) => {
        if (!user) return;

        const recipesRef = collection(db, 'users', user.uid, 'myRecipes');
        await addDoc(recipesRef, {
            ...recipeData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: user.uid,
        });
    };

    const updateRecipe = async (recipeId, recipeData) => {
        if (!user) return;

        const recipeDocRef = doc(db, 'users', user.uid, 'myRecipes', recipeId);
        await updateDoc(recipeDocRef, {
            ...recipeData,
            updatedAt: serverTimestamp(),
        });

        // Also update the favorite copy if it exists
        try {
            const favDocRef = doc(db, 'users', user.uid, 'favorites', recipeId);
            await updateDoc(favDocRef, {
                name: recipeData.title,
                category: recipeData.category,
                ingredients: recipeData.ingredients,
                recipe: recipeData.recipe,
            });
        } catch (err) {
            // Ignore if the recipe wasn't favorited
        }
    };

    const deleteRecipe = async (recipeId) => {
        if (!user) return;

        const recipeDocRef = doc(db, 'users', user.uid, 'myRecipes', recipeId);
        await deleteDoc(recipeDocRef);

        // Also delete from favorites if it exists
        try {
            const favDocRef = doc(db, 'users', user.uid, 'favorites', recipeId);
            await deleteDoc(favDocRef);
        } catch (error) {
            console.error('Error deleting from favorites:', error);
        }
    };

    return { recipes, loading, addRecipe, updateRecipe, deleteRecipe };
}
