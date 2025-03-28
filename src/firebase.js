// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBZiJ-dV0x3L-NCFlKv6jSiK6KA-gBAmU",
  authDomain: "aivestor-762c2.firebaseapp.com",
  projectId: "aivestor-762c2",
  storageBucket: "aivestor-762c2.appspot.com",
  messagingSenderId: "283773161504",
  appId: "1:283773161504:web:547942b3ee80dd22442c45",
  measurementId: "G-Y8E32RS3W1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Export the necessary services
export { auth, db }; // Make sure db is exported here
