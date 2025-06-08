export async function POST(req: Request) {
  try {
    const { roomName } = await req.json()

    // Create Daily.co room
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: `${roomName}-${Date.now()}`,
        privacy: "public",
        properties: {
          max_participants: 10,
          enable_chat: true,
          enable_screenshare: true,
        },
      }),
    })

    if (!response.ok) {
      // Fallback for demo - return a mock room URL
      return Response.json({
        roomUrl: `https://demo.daily.co/${roomName}-${Date.now()}`,
        roomName: roomName,
      })
    }

    const room = await response.json()

    return Response.json({
      roomUrl: room.url,
      roomName: room.name,
    })
  } catch (error) {
    console.error("Error creating video room:", error)

    // Fallback for demo
    const { roomName } = await req.json()
    return Response.json({
      roomUrl: `https://demo.daily.co/${roomName}-${Date.now()}`,
      roomName: roomName,
    })
  }
}
