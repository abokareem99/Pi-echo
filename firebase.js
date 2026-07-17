// استيراد الدوال الأساسية من مكتبات Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

// بيانات الاتصال الخاصة بمشروعك (Echopi)
const firebaseConfig = {
  apiKey: "AIzaSyCyDmlRaqGY2C-PfKAKxL8GoYgg1qKiqDY",
  authDomain: "echopi-1a87c.firebaseapp.com",
  projectId: "echopi-1a87c",
  storageBucket: "echopi-1a87c.firebasestorage.app",
  messagingSenderId: "93575678453",
  appId: "1:93575678453:web:95891b9d64a4abade5b8bc"
};

// 1. تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);

// 2. تهيئة الخدمات وتصديرها للاستخدام في تطبيقك
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
