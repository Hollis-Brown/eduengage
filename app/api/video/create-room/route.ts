import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { roomName, privacy = "public", maxParticipants = 10 } = await request.json()

    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName || `eduengage-${Date.now()}`,
        privacy,
        properties: {
          max_participants: maxParticipants,
          enable_chat: true,
          enable_screenshare: true,
          enable_recording: "cloud",
          start_video_off: false,
          start_audio_off: false,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Daily.co API error: ${response.status}`)
    }

    const room = await response.json()

    return NextResponse.json({
      roomUrl: room.url,
      roomName: room.name,
      config: room.config,
    })
  } catch (error) {
    console.error("Daily.co API error:", error)
    return NextResponse.json({ error: "Failed to create video room" }, { status: 500 })
  }
}
