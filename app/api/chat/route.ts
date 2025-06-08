import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-4"),
      messages,
      system:
        "You are an educational AI assistant helping students learn. Be encouraging, clear, and provide helpful explanations.",
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Error processing chat", { status: 500 })
  }
}
