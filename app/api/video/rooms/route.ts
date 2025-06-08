import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Daily.co API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      rooms: data.data || [],
    })
  } catch (error) {
    console.error("Daily.co API error:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}
