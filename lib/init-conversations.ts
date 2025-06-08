import { MessagingService } from "./messaging-service"

export async function initializeDefaultConversations(userId: string, userName: string) {
  try {
    // Create AI Assistant conversation
    await MessagingService.createConversation(
      "AI Learning Assistant",
      "ai",
      [userId, "ai-assistant"],
      "/placeholder.svg?height=40&width=40",
    )

    // Send welcome message from AI
    const aiConvId = await MessagingService.createConversation("AI Learning Assistant", "ai", [userId, "ai-assistant"])

    await MessagingService.sendMessage(
      aiConvId,
      "ai-assistant",
      "AI Learning Assistant",
      `Hello ${userName}! I'm your AI learning assistant. I can help you with studies, answer questions, create learning plans, and much more. What would you like to explore today?`,
    )

    console.log("Default conversations initialized")
  } catch (error) {
    console.error("Error initializing conversations:", error)
  }
}
