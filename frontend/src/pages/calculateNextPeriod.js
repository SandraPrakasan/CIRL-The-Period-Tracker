import {
  getFirestore,
  doc,
  getDocs,
  collection,
  query,
  orderBy,
  setDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

const db = getFirestore();
const auth = getAuth();

const calculateNextPeriodDate = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated!");
      return;
    }

    const userEmail = user.email;
    const userDocRef = doc(db, "users", userEmail);
    const periodDataRef = collection(userDocRef, "periodData");
    const periodQuery = query(periodDataRef, orderBy("startDate", "desc"));

    // Fetch all period entries
    const periodSnapshot = await getDocs(periodQuery);
    if (periodSnapshot.empty) {
      console.error("No period data found!");
      return;
    }

    let totalCycleLength = 0;
    let count = 0;
    let latestPeriod = null;

    periodSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.cycleLength) {
        totalCycleLength += data.cycleLength;
        count++;
      }
      if (!latestPeriod) latestPeriod = data; // Get the most recent entry
    });

    if (!latestPeriod || count === 0) {
      console.error("Incomplete period data!");
      return;
    }

    // Calculate the average cycle length
    const avgCycleLength = Math.round(totalCycleLength / count);
    console.log("Calculated Average Cycle Length:", avgCycleLength);

    await setDoc(userDocRef, { avgCycleLength: avgCycleLength }, { merge: true });

    // Convert Firestore Timestamp to JavaScript Date
    const startDateObj = latestPeriod.startDate.toDate
      ? latestPeriod.startDate.toDate()
      : new Date(latestPeriod.startDate);
    console.log("Start Date of Last Period:", startDateObj);

    // Calculate next period date using the average cycle length
    const nextPeriodDate = new Date(startDateObj);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
    console.log("Next Period Date:", nextPeriodDate);

    // Convert to Firestore Timestamp
    const nextPeriodTimestamp = Timestamp.fromDate(nextPeriodDate);
    console.log("Next Period Timestamp:", nextPeriodTimestamp);

    // Update user document with next period date
    await setDoc(userDocRef, { nextPeriod: nextPeriodTimestamp }, { merge: true });

    console.log("✅ Next period date added successfully:", nextPeriodTimestamp);
    return startDateObj;
  } catch (error) {
    console.error("❌ Error calculating next period date:", error);
  }
};

export default calculateNextPeriodDate;
