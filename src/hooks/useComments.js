import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    serverTimestamp,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

/**
 * NOTE: For this hook to work correctly with ordering, 
 * a composite index must be created in Firebase Console:
 * Collection: comments
 * Fields: mealId (Ascending), createdAt (Descending)
 */
export function useComments(mealId) {
    const { user, userData } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!mealId) {
            setComments([]);
            setLoading(false);
            return;
        }

        const commentsRef = collection(db, 'comments');
        const q = query(
            commentsRef,
            where('mealId', '==', String(mealId))
        );

        let unsubscribe = () => {};
        try {
            unsubscribe = onSnapshot(q, (snapshot) => {
                try {
                    const commentList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })).sort((a, b) => {
                        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || 0;
                        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || 0;
                        return dateB - dateA;
                    });
                    setComments(commentList || []);
                    setLoading(false);
                } catch (err) {
                    console.error('Error parsing comments:', err);
                    setLoading(false);
                }
            }, (error) => {
                console.error('Comments listener error:', error);
                setLoading(false);
            });
        } catch (err) {
            console.error('onSnapshot setup error:', err);
            setLoading(false);
        }

        return () => unsubscribe();
    }, [mealId]);

    const addComment = async (text, rating, imageFile = null) => {
        if (!user || !mealId) return;

        const displayName = userData?.displayName || user.email?.split('@')[0] || 'Anonim';
        let imageUrl = null;
        let imageStoragePath = null;

        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const path = `comments/${mealId}/${user.uid}/${fileName}`;
            const imageRef = ref(storage, path);
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
            imageStoragePath = path;
        }

        await addDoc(collection(db, 'comments'), {
            mealId: String(mealId),
            userId: user.uid,
            username: displayName,
            text: text.trim(),
            rating: rating,
            imageUrl: imageUrl,
            imageStoragePath: imageStoragePath,
            createdAt: serverTimestamp(),
        });
    };

    const deleteComment = async (commentId, imageStoragePath = null) => {
        if (!user) return;
        
        if (imageStoragePath) {
            try {
                const imageRef = ref(storage, imageStoragePath);
                await deleteObject(imageRef);
            } catch (err) {
                console.error('Error deleting comment image from storage:', err);
            }
        }
        
        await deleteDoc(doc(db, 'comments', commentId));
    };

    const averageRating = comments.length > 0
        ? (comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.filter(c => c.rating).length) || 0
        : 0;

    return { comments, loading, addComment, deleteComment, averageRating };
}
