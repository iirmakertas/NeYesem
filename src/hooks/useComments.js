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

// Helper to compress review images using HTML5 Canvas
const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Maintain aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

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
            let fileToUpload = imageFile;
            try {
                fileToUpload = await compressImage(imageFile);
            } catch (err) {
                console.warn('Image compression failed, uploading original:', err);
            }
            const fileName = `${Date.now()}_${fileToUpload.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const path = `comments/${mealId}/${user.uid}/${fileName}`;
            const imageRef = ref(storage, path);
            await uploadBytes(imageRef, fileToUpload);
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
