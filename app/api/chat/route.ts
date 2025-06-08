import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-4"),
      messages,
      system: `You are an educational AI assistant helping students learn. Be encouraging, clear, and provide helpful explanations. The user's ID is ${userId}.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Error processing chat", { status: 500 })
  }
}
