"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const MOCK_RESULTS = [
  {
    id: 1,
    quizTitle: "JavaScript Fundamentals Quiz",
    course: "The Complete JavaScript Course",
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    timeTaken: 18,
    date: "2025-12-02",
    strengths: ["Variables & Scope", "Data Types", "Functions"],
    weaknesses: ["Closures", "Async Programming"],
    recommendations: "Review closure concepts and practice more on async/await patterns.",
    aiAnalysis:
      "Your performance shows strong fundamentals. Focus on advanced concepts like closures and async programming to improve further.",
  },
  {
    id: 2,
    quizTitle: "Python Data Analysis",
    course: "Python for Data Science",
    score: 92,
    totalQuestions: 12,
    correctAnswers: 11,
    timeTaken: 22,
    date: "2025-11-28",
    strengths: ["Pandas", "NumPy Arrays", "Data Cleaning"],
    weaknesses: ["Matplotlib Styling"],
    recommendations: "Excellent work! Consider exploring advanced visualization techniques.",
    aiAnalysis:
      "Outstanding performance! You have mastered data analysis fundamentals and are ready for advanced topics.",
  },
]

function ResultsContent() {
  const [selectedResult, setSelectedResult] = useState<(typeof MOCK_RESULTS)[0] | null>(MOCK_RESULTS[0])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">AI Results & Analysis</h1>
            <p className="text-muted-foreground">
              View your quiz results with AI-powered insights and recommendations.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Results List */}
            <div className="lg:col-span-2 space-y-4">
              {MOCK_RESULTS.map((result) => (
                <Card
                  key={result.id}
                  className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedResult?.id === result.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{result.quizTitle}</h3>
                      <p className="text-sm text-muted-foreground">{result.course}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{result.score}%</div>
                      <p className="text-xs text-muted-foreground">{result.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      ✓ {result.correctAnswers}/{result.totalQuestions} Correct
                    </span>
                    <span>⏱️ {result.timeTaken} mins</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Result Details */}
            {selectedResult && (
              <div className="lg:col-span-1 space-y-4">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Score Breakdown</h2>
                  <div className="mb-4">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-primary mb-2">{selectedResult.score}%</div>
                      <p className="text-muted-foreground">
                        {selectedResult.correctAnswers} of {selectedResult.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Full Report
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-3">Strengths</h3>
                  <div className="space-y-2">
                    {selectedResult.strengths.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-3">Areas to Improve</h3>
                  <div className="space-y-2">
                    {selectedResult.weaknesses.map((w, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-red-600">!</span>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Full Report */}
          {selectedResult && (
            <Card className="mt-6 p-6">
              <h2 className="text-2xl font-bold mb-4">Detailed AI Analysis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Performance Metrics</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-bold">{selectedResult.score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions Correct</span>
                      <span className="font-bold">
                        {selectedResult.correctAnswers}/{selectedResult.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Taken</span>
                      <span className="font-bold">{selectedResult.timeTaken} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completion Date</span>
                      <span className="font-bold">{selectedResult.date}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">AI Recommendations</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedResult.recommendations}</p>
                  <div className="p-3 bg-primary/10 rounded text-sm">
                    <p className="font-semibold text-primary mb-1">Summary</p>
                    <p>{selectedResult.aiAnalysis}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ResultsPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <ResultsContent />
    </ProtectedRoute>
  )
}
