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

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: "text" | "file" | "image"
  timestamp: Timestamp
  status: "sent" | "delivered" | "read"
  fileName?: string
  fileSize?: string
  fileUrl?: string
}

export interface Conversation {
  id: string
  name: string
  type: "direct" | "group" | "ai"
  participants: string[]
  lastMessage?: string
  lastMessageTime?: Timestamp
  unreadCount: number
  avatar?: string
  isOnline?: boolean
}

export class MessagingService {
  // Send a message
  static async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    type: "text" | "file" | "image" = "text",
    fileData?: { fileName: string; fileSize: string; fileUrl: string },
  ): Promise<string> {
    try {
      const messageData: Omit<ChatMessage, "id"> = {
        conversationId,
        senderId,
        senderName,
        content,
        type,
        timestamp: serverTimestamp() as Timestamp,
        status: "sent",
        ...fileData,
      }

      const docRef = await addDoc(collection(db, "messages"), messageData)

      // Update conversation's last message
      await this.updateConversationLastMessage(conversationId, content)

      return docRef.id
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  // Listen to messages in a conversation
  static subscribeToMessages(conversationId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc"),
    )

    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = []
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as ChatMessage)
      })
      callback(messages)
    })
  }

  // Create a new conversation
  static async createConversation(
    name: string,
    type: "direct" | "group" | "ai",
    participants: string[],
    avatar?: string,
  ): Promise<string> {
    try {
      const conversationData: Omit<Conversation, "id"> = {
        name,
        type,
        participants,
        unreadCount: 0,
        avatar,
        lastMessageTime: serverTimestamp() as Timestamp,
      }

      const docRef = await addDoc(collection(db, "conversations"), conversationData)
      return docRef.id
    } catch (error) {
      console.error("Error creating conversation:", error)
      throw error
    }
  }

  // Listen to conversations for a user
  static subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void): () => void {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId),
      orderBy("lastMessageTime", "desc"),
    )

    return onSnapshot(q, (snapshot) => {
      const conversations: Conversation[] = []
      snapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data(),
        } as Conversation)
      })
      callback(conversations)
    })
  }

  // Update conversation's last message
  private static async updateConversationLastMessage(conversationId: string, lastMessage: string): Promise<void> {
    try {
      const conversationRef = collection(db, "conversations")
      await addDoc(conversationRef, {
        lastMessage,
        lastMessageTime: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating conversation:", error)
    }
  }
}
