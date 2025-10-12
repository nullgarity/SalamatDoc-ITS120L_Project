import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// CREATE
export async function createDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
}

// READ ALL
export async function getAllDocuments(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// READ ONE
export async function getDocumentById(collectionName, id) {
  const ref = doc(db, collectionName, id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

// READ BY QUERY
export async function getDocumentsByField(collectionName, field, value) {
  const q = query(collection(db, collectionName), where(field, "==", value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// UPDATE
export async function updateDocument(collectionName, id, data) {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, data);
}

// DELETE
export async function deleteDocument(collectionName, id) {
  const ref = doc(db, collectionName, id);
  await deleteDoc(ref);
}
