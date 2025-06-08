import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "./firebase"

export interface AnalyticsData {
  totalStudents: number
  activeToday: number
  completionRate: number
  averageScore: number
  weeklyProgress: Array<{ day: string; students: number; completion: number }>
  topCourses: Array<{ name: string; students: number; completion: number }>
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    // Get total students
    const studentsSnapshot = await getDocs(collection(db, "users"))
    const totalStudents = studentsSnapshot.size

    // Get today's active users (simplified - you'd want to track actual activity)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeQuery = query(collection(db, "user_activity"), where("date", ">=", today))
    const activeSnapshot = await getDocs(activeQuery)
    const activeToday = activeSnapshot.size

    // Get completion data
    const completionsSnapshot = await getDocs(collection(db, "course_completions"))
    const completions = completionsSnapshot.docs.map((doc) => doc.data())

    const completionRate =
      completions.length > 0 ? (completions.filter((c) => c.completed).length / completions.length) * 100 : 0

    const averageScore =
      completions.length > 0 ? completions.reduce((sum, c) => sum + (c.score || 0), 0) / completions.length : 0

    // Generate weekly progress (last 7 days)
    const weeklyProgress = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

      // In a real app, you'd query actual daily data
      weeklyProgress.push({
        day: dayName,
        students: Math.floor(Math.random() * 50) + 20,
        completion: Math.floor(Math.random() * 30) + 70,
      })
    }

    // Get top courses
    const coursesSnapshot = await getDocs(query(collection(db, "courses"), orderBy("enrollments", "desc"), limit(5)))
    const topCourses = coursesSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        name: data.title,
        students: data.enrollments || 0,
        completion: data.completionRate || 0,
      }
    })

    return {
      totalStudents,
      activeToday,
      completionRate,
      averageScore,
      weeklyProgress,
      topCourses,
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    // Return fallback data
    return {
      totalStudents: 0,
      activeToday: 0,
      completionRate: 0,
      averageScore: 0,
      weeklyProgress: [],
      topCourses: [],
    }
  }
}
