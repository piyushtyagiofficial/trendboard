import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseAvailable } from '../firebase/config';

export class FirestoreService {
  constructor() {
    this.newsCollection = 'news';
    this.listeners = new Map();
  }

  async saveArticles(articles) {
    if (!isFirebaseAvailable || !db) {
      console.log('Firebase not available, skipping save to Firestore');
      return;
    }

    const batch = [];
    
    for (const article of articles) {
      const id = String(article.id);
      const docRef = doc(db, this.newsCollection, id);
      batch.push(
        setDoc(docRef, {
          ...article,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true })
      );
    }

    try {
      await Promise.all(batch);
      console.log(`Saved ${articles.length} articles to Firestore`);
    } catch (error) {
      console.error('Error saving articles:', error);
    }
  }

  async getArticles(limitCount = 50) {
    if (!isFirebaseAvailable || !db) {
      console.log('Firebase not available, returning empty array');
      return [];
    }

    try {
      const q = query(
        collection(db, this.newsCollection),
        orderBy('datetime', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const articles = [];
      
      querySnapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...doc.data() });
      });
      
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  subscribeToArticles(callback, limitCount = 50) {
    if (!isFirebaseAvailable || !db) {
      console.log('Firebase not available, cannot subscribe to articles');
      callback([]);
      return () => {}; // Return empty unsubscribe function
    }

    const q = query(
      collection(db, this.newsCollection),
      orderBy('datetime', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const articles = [];
      querySnapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...doc.data() });
      });
      callback(articles);
    }, (error) => {
      console.error('Firestore subscription error:', error);
      callback([]);
    });

    return unsubscribe;
  }

  async searchArticles(searchTerm, category = null) {
    if (!isFirebaseAvailable || !db) {
      console.log('Firebase not available, returning empty search results');
      return [];
    }

    try {
      let q = query(collection(db, this.newsCollection));
      
      if (category && category !== 'all') {
        q = query(q, where('category', '==', category));
      }
      
      q = query(q, orderBy('datetime', 'desc'), limit(100));
      
      const querySnapshot = await getDocs(q);
      const articles = [];
      
      querySnapshot.forEach((doc) => {
        const article = { id: doc.id, ...doc.data() };
        
        // Client-side filtering for search term
        if (!searchTerm || 
            article.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.source?.toLowerCase().includes(searchTerm.toLowerCase())) {
          articles.push(article);
        }
      });
      
      return articles;
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  }
}

export const firestoreService = new FirestoreService();