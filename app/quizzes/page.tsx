"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const MOCK_QUIZZES = [
  {
    id: 1,
    title: "JavaScript Fundamentals Quiz",
    course: "The Complete JavaScript Course",
    questions: 10,
    duration: 20,
    level: "Beginner",
    score: 85,
    status: "completed",
    date: "2025-12-02",
  },
  {
    id: 2,
    title: "React Hooks & State Management",
    course: "React - The Complete Guide",
    questions: 15,
    duration: 30,
    level: "Intermediate",
    score: null,
    status: "not-started",
    date: null,
  },
  {
    id: 3,
    title: "Python Data Analysis",
    course: "Python for Data Science",
    questions: 12,
    duration: 25,
    level: "Intermediate",
    score: 92,
    status: "completed",
    date: "2025-11-28",
  },
  {
    id: 4,
    title: "Advanced JavaScript Patterns",
    course: "The Complete JavaScript Course",
    questions: 20,
    duration: 40,
    level: "Advanced",
    score: null,
    status: "not-started",
    date: null,
  },
]

function QuizzesContent() {
  const [selectedQuiz, setSelectedQuiz] = useState<(typeof MOCK_QUIZZES)[0] | null>(null)
  const [startQuiz, setStartQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const handleStartQuiz = () => {
    setStartQuiz(true)
    setCurrentQuestion(0)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Quizzes & Assessments</h1>
            <p className="text-muted-foreground">Test your knowledge and get AI-powered insights.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quiz List */}
            <div className="lg:col-span-2 space-y-4">
              {MOCK_QUIZZES.map((quiz) => (
                <Card
                  key={quiz.id}
                  className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedQuiz?.id === quiz.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedQuiz(quiz)
                    setStartQuiz(false)
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{quiz.course}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        quiz.level === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : quiz.level === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {quiz.level}
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span>📝 {quiz.questions} questions</span>
                    <span>⏱️ {quiz.duration} minutes</span>
                  </div>

                  {quiz.status === "completed" && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Latest Score</p>
                        <p className="text-2xl font-bold text-primary">{quiz.score}%</p>
                        <p className="text-xs text-muted-foreground">{quiz.date}</p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Quiz Details */}
            <div>
              {selectedQuiz ? (
                <Card className="p-6 sticky top-20">
                  <h2 className="text-lg font-bold mb-4">{selectedQuiz.title}</h2>

                  <div className="space-y-3 mb-6 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">COURSE</p>
                      <p>{selectedQuiz.course}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">DETAILS</p>
                      <p>
                        {selectedQuiz.questions} Questions • {selectedQuiz.duration} Minutes
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">LEVEL</p>
                      <p>{selectedQuiz.level}</p>
                    </div>
                    {selectedQuiz.score && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">YOUR SCORE</p>
                        <p className="text-lg font-bold text-primary">{selectedQuiz.score}%</p>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" onClick={handleStartQuiz}>
                    {selectedQuiz.status === "completed" ? "Retake Quiz" : "Start Quiz"}
                  </Button>
                </Card>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">Select a quiz to view details</Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function QuizzesPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <QuizzesContent />
    </ProtectedRoute>
  )
}
