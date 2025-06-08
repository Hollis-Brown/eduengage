import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    const systemPrompt = `You are an intelligent AI learning assistant for EduEngage, an advanced educational platform. You help students with:

1. Academic questions across all subjects (math, science, literature, history, etc.)
2. Study planning and learning strategies
3. Homework assistance and explanations
4. Creating practice problems and quizzes
5. Breaking down complex concepts into understandable parts

Context about the student: ${context || "General student"}

Be helpful, encouraging, and educational. Provide step-by-step explanations when solving problems. If you don't know something, admit it and suggest resources. Keep responses concise but thorough.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({
      response,
      suggestions: generateSuggestions(messages[messages.length - 1]?.content || ""),
    })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}

function generateSuggestions(lastMessage: string): string[] {
  const message = lastMessage.toLowerCase()

  if (message.includes("math") || message.includes("calculus") || message.includes("algebra")) {
    return [
      "Show me step-by-step solutions",
      "Create practice problems",
      "Explain the concept visually",
      "What are common mistakes?",
    ]
  } else if (message.includes("science") || message.includes("physics") || message.includes("chemistry")) {
    return [
      "Explain with real-world examples",
      "Show me the formula",
      "Create a lab experiment",
      "What are the applications?",
    ]
  } else if (message.includes("write") || message.includes("essay") || message.includes("paper")) {
    return ["Help me outline this", "Check my grammar", "Improve my argument", "Find better sources"]
  } else {
    return ["Explain this concept", "Give me examples", "Create a quiz", "What should I study next?"]
  }
}
