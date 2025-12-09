"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

const MOCK_COURSES = [
  {
    id: 1,
    title: "The Complete JavaScript Course 2025",
    category: "Programming",
    progress: 65,
    instructor: "Jonas Schmedtmann",
    students: 2500,
    rating: 4.8,
    udemy_link: "https://udemy.com/javascript",
    description: "Master JavaScript from basics to advanced concepts.",
  },
  {
    id: 2,
    title: "Python for Data Science",
    category: "Data Science",
    progress: 45,
    instructor: "Andrew Ng",
    students: 1800,
    rating: 4.9,
    udemy_link: "https://udemy.com/python-ds",
    description: "Learn Python for data analysis and machine learning.",
  },
  {
    id: 3,
    title: "React - The Complete Guide 2025",
    category: "Web Development",
    progress: 80,
    instructor: "Maximilian Schwarzmüller",
    students: 3000,
    rating: 4.8,
    udemy_link: "https://udemy.com/react",
    description: "Build modern web applications with React.",
  },
  {
    id: 4,
    title: "Machine Learning A-Z",
    category: "AI/ML",
    progress: 30,
    instructor: "Kirill Eremenko",
    students: 2200,
    rating: 4.7,
    udemy_link: "https://udemy.com/ml-az",
    description: "Comprehensive machine learning course with real projects.",
  },
  {
    id: 5,
    title: "Web Design for Beginners",
    category: "Design",
    progress: 55,
    instructor: "Brad Schiff",
    students: 1500,
    rating: 4.6,
    udemy_link: "https://udemy.com/web-design",
    description: "Learn modern web design principles and tools.",
  },
]

function CoursesContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = [...new Set(MOCK_COURSES.map((c) => c.category))]

  const filtered = selectedCategory ? MOCK_COURSES.filter((c) => c.category === selectedCategory) : MOCK_COURSES

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">
              Continue learning with content from Udemy and complete assessments on eByte.
            </p>
          </div>

          {/* Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                <div className="p-6">
                  <div className="text-xs font-semibold text-primary mb-2 uppercase">{course.category}</div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{course.instructor}</span>
                    <span>⭐ {course.rating}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={course.udemy_link} className="flex-1">
                      <Button variant="outline" className="w-full text-xs bg-transparent">
                        Go to Udemy
                      </Button>
                    </Link>
                    <Link href="/exercises" className="flex-1">
                      <Button className="w-full text-xs">Exercises</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function CoursesPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <CoursesContent />
    </ProtectedRoute>
  )
}
