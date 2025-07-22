import { db, auth } from "./firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

// Function to get the current authenticated user's email
function getCurrentUserEmail() {
  const user = auth.currentUser;
  return user ? user.email : null;
}

// Function to add a new user to Firestore after signup
export async function addUserToFirestore() {
  const userEmail = getCurrentUserEmail();
  if (!userEmail) {
    console.error("No authenticated user found");
    return;
  }
  const userRef = doc(db, "user", userEmail);
  await setDoc(userRef, {
    email: userEmail,
    dob: null,
    bloodGroup: "",
  });
  console.log("User added successfully");
}

// Function to get user details
export async function getUser() {
  const userEmail = getCurrentUserEmail();
  if (!userEmail) return null;
  const userRef = doc(db, "user", userEmail);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

// Function to add a period entry
export async function addPeriodEntry(startDate, endDate, cycleLength, symptoms, mood) {
  const userEmail = getCurrentUserEmail();
  if (!userEmail) {
    console.error("No authenticated user found");
    return;
  }
  const periodRef = doc(db, "user", userEmail, "periodData", startDate);
  await setDoc(periodRef, {
    startDate,
    endDate,
    cycleLength,
    symptoms,
    mood,
  });
  console.log("Period entry added successfully");
}

// Function to get period entries
export async function getPeriodEntries() {
  const userEmail = getCurrentUserEmail();
  if (!userEmail) return [];
  const periodRef = collection(db, "user", userEmail, "periodData");
  const snapshot = await getDocs(periodRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
