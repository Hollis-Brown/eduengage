import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface WorkflowStep {
  id: string
  type: "trigger" | "action" | "condition"
  title: string
  description: string
  config: Record<string, any>
}

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function createWorkflow(workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">) {
  const docRef = await addDoc(collection(db, "workflows"), {
    ...workflow,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return docRef.id
}

export async function getWorkflows(): Promise<Workflow[]> {
  const snapshot = await getDocs(collection(db, "workflows"))
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Workflow[]
}

export async function updateWorkflow(id: string, updates: Partial<Workflow>) {
  await updateDoc(doc(db, "workflows", id), {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteWorkflow(id: string) {
  await deleteDoc(doc(db, "workflows", id))
}

export async function executeWorkflow(workflowId: string, triggerData: any) {
  // This would contain the actual workflow execution logic
  console.log(`Executing workflow ${workflowId} with data:`, triggerData)

  // For now, just log the execution
  // In a real implementation, you'd process each step based on its type
}
