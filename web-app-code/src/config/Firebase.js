import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNPZ-OM-Lw0I3Ww0xIbyXnRn8nF-iED-Y",
  authDomain: "yotta-website-336b0.firebaseapp.com",
  projectId: "yotta-website-336b0",
  storageBucket: "yotta-website-336b0.firebasestorage.app",
  messagingSenderId: "733775844753",
  appId: "1:733775844753:web:266bb17e3952c2032d7630"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
