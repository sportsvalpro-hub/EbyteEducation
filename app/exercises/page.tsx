"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const EXERCISE_TYPES = [
  { id: "mcq", label: "Multiple Choice" },
  { id: "fill", label: "Fill in the Blank" },
  { id: "match", label: "Match the Following" },
  { id: "tf", label: "True/False" },
]

const MOCK_EXERCISES = [
  {
    id: 1,
    title: "JavaScript Data Types",
    type: "mcq",
    course: "The Complete JavaScript Course",
    difficulty: "Beginner",
    status: "completed",
  },
  {
    id: 2,
    title: "Variables and Scope",
    type: "fill",
    course: "The Complete JavaScript Course",
    difficulty: "Beginner",
    status: "in-progress",
  },
  {
    id: 3,
    title: "React Hooks Matching",
    type: "match",
    course: "React - The Complete Guide",
    difficulty: "Intermediate",
    status: "not-started",
  },
  {
    id: 4,
    title: "Python Fundamentals True/False",
    type: "tf",
    course: "Python for Data Science",
    difficulty: "Beginner",
    status: "completed",
  },
  {
    id: 5,
    title: "Array Methods Quiz",
    type: "mcq",
    course: "The Complete JavaScript Course",
    difficulty: "Intermediate",
    status: "not-started",
  },
]

function ExercisesContent() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<(typeof MOCK_EXERCISES)[0] | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const filtered = selectedType ? MOCK_EXERCISES.filter((e) => e.type === selectedType) : MOCK_EXERCISES

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Learning Exercises</h1>
            <p className="text-muted-foreground">Practice with various exercise types to strengthen your knowledge.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Exercise List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedType === null ? "default" : "outline"}
                  onClick={() => setSelectedType(null)}
                  size="sm"
                >
                  All
                </Button>
                {EXERCISE_TYPES.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    onClick={() => setSelectedType(type.id)}
                    size="sm"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                {filtered.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedExercise?.id === exercise.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{exercise.title}</h3>
                        <p className="text-sm text-muted-foreground">{exercise.course}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {EXERCISE_TYPES.find((t) => t.id === exercise.type)?.label}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              exercise.difficulty === "Beginner"
                                ? "bg-green-100 text-green-800"
                                : exercise.difficulty === "Intermediate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exercise.difficulty}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              exercise.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : exercise.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {exercise.status === "completed"
                              ? "✓ Completed"
                              : exercise.status === "in-progress"
                                ? "⏳ In Progress"
                                : "Not Started"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Exercise Details */}
            <div>
              {selectedExercise ? (
                <Card className="p-6 sticky top-20">
                  <h2 className="text-lg font-bold mb-4">{selectedExercise.title}</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">COURSE</p>
                      <p className="text-sm">{selectedExercise.course}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">TYPE</p>
                      <p className="text-sm">{EXERCISE_TYPES.find((t) => t.id === selectedExercise.type)?.label}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">DIFFICULTY</p>
                      <p className="text-sm">{selectedExercise.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">STATUS</p>
                      <p className="text-sm capitalize">{selectedExercise.status.replace("-", " ")}</p>
                    </div>
                  </div>

                  <Button className="w-full">
                    {selectedExercise.status === "completed"
                      ? "Review Exercise"
                      : selectedExercise.status === "in-progress"
                        ? "Continue"
                        : "Start Exercise"}
                  </Button>
                </Card>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">Select an exercise to get started</Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ExercisesPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <ExercisesContent />
    </ProtectedRoute>
  )
}
