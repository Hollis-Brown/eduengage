import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Message {
  id: string
  text: string
  userId: string
  userName: string
  timestamp: Timestamp
  roomId: string
}

export function sendMessage(roomId: string, text: string, userId: string, userName: string) {
  return addDoc(collection(db, "messages"), {
    text,
    userId,
    userName,
    roomId,
    timestamp: serverTimestamp(),
  })
}

export function subscribeToMessages(roomId: string, callback: (messages: Message[]) => void) {
  const q = query(collection(db, "messages"), where("roomId", "==", roomId), orderBy("timestamp", "asc"))

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[]
    callback(messages)
  })
}
