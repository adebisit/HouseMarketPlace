import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyAlHT-zTIND-Jp5Qz3aeeHwBUdYVOtd-8s",
  authDomain: "house-marketplace-app-97a52.firebaseapp.com",
  projectId: "house-marketplace-app-97a52",
  storageBucket: "house-marketplace-app-97a52.appspot.com",
  messagingSenderId: "364541294158",
  appId: "1:364541294158:web:2b85117cea2b01fb29751f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)