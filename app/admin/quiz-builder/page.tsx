"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, FileQuestion } from "lucide-react"

export default function QuizBuilderPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    questions: "10",
    level: "beginner",
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes")
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data)
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    }
  }

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          questions: formData.questions,
          level: formData.level,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create quiz")
      }

      setQuizzes([data, ...quizzes])
      setFormData({ title: "", category: "", questions: "10", level: "beginner" })
      setShowForm(false)
    } catch (error) {
      console.error("Error creating quiz:", error)
      setError(error instanceof Error ? error.message : "Failed to create quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" })
      if (response.ok) {
        setQuizzes(quizzes.filter((q) => q.id !== quizId))
      }
    } catch (error) {
      console.error("Error deleting quiz:", error)
    }
  }

  const getDifficultyDisplay = (difficulty: string) => {
    const map: Record<string, string> = {
      easy: "Beginner",
      medium: "Intermediate",
      hard: "Advanced",
    }
    return map[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-muted"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Quiz Builder</h1>
                <p className="text-muted-foreground">Create and manage quizzes for your courses.</p>
              </div>
              <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Create Quiz"}</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form */}
              {showForm && (
                <Card className="p-6 lg:col-span-1">
                  <h2 className="text-xl font-bold mb-4">New Quiz</h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleCreateQuiz} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quiz Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., JavaScript Basics"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., JavaScript, Python, React"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                      <Input
                        type="number"
                        value={formData.questions}
                        onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                        placeholder="e.g., 30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Quiz"}
                    </Button>
                  </form>
                </Card>
              )}

              {/* Quizzes List */}
              <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Created Quizzes</h2>
                  {quizzes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No quizzes created yet. Create your first quiz to get started.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {quizzes.map((quiz) => (
                        <div key={quiz.id} className="p-4 border border-border rounded-lg hover:bg-muted/50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{quiz.title}</h3>
                              <p className="text-sm text-muted-foreground">{quiz.category || "No category"}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {quiz.duration_minutes || 30} mins
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(quiz.difficulty)}`}>
                                  {getDifficultyDisplay(quiz.difficulty)}
                                </span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  <FileQuestion className="w-3 h-3 inline mr-1" />
                                  {quiz.quiz_questions?.length || 0} questions
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/admin/quiz-builder/${quiz.id}`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-1" /> Edit Questions
                                </Button>
                              </Link>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}
