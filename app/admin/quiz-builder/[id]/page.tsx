"use client"

import { useState, useEffect, use } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"

type QuestionType = "multiple_choice" | "fill_blank" | "matching" | "true_false"

interface Question {
  id?: string
  question_text: string
  question_type: QuestionType
  options: any
  correct_answer: string
  explanation?: string
  order_num?: number
}

interface Quiz {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration_minutes: number
  quiz_questions: Question[]
}

export default function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  const emptyQuestion: Question = {
    question_text: "",
    question_type: "multiple_choice",
    options: { choices: ["", "", "", ""] },
    correct_answer: "",
    explanation: "",
  }

  const [newQuestion, setNewQuestion] = useState<Question>(emptyQuestion)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuiz()
    }, 500)
    return () => clearTimeout(timer)
  }, [quizId])

  const fetchQuiz = async () => {
    console.log("[v0] Fetching quiz with ID:", quizId)
    try {
      const response = await fetch(`/api/quizzes/${quizId}`)
      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Quiz data received:", data?.title)
        setQuiz(data)
        setQuestions(data.quiz_questions || [])
        setError(null)
      } else {
        const errorData = await response.json()
        console.log("[v0] Error response:", errorData)
        setError(errorData.error || "Failed to load quiz")
      }
    } catch (err) {
      console.log("[v0] Fetch exception:", err)
      setError("Failed to load quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text || !newQuestion.correct_answer) {
      setError("Please fill in the question and correct answer")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add question")
      }

      setQuestions([...questions, data])
      setNewQuestion(emptyQuestion)
      setShowAddQuestion(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add question")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateQuestion = async (question: Question) => {
    if (!question.id) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/quizzes/${quizId}/questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update question")
      }

      const updatedQuestion = await response.json()
      setQuestions(questions.map((q) => (q.id === question.id ? updatedQuestion : q)))
      setEditingQuestion(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update question")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      const response = await fetch(`/api/quizzes/${quizId}/questions/${questionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== questionId))
      }
    } catch (err) {
      setError("Failed to delete question")
    }
  }

  const handleQuestionTypeChange = (type: QuestionType, isNew = true) => {
    let defaultOptions: any = null
    let defaultAnswer = ""

    switch (type) {
      case "multiple_choice":
        defaultOptions = { choices: ["", "", "", ""] }
        break
      case "fill_blank":
        defaultOptions = null
        break
      case "matching":
        defaultOptions = {
          pairs: [
            { left: "", right: "" },
            { left: "", right: "" },
          ],
        }
        break
      case "true_false":
        defaultOptions = null
        defaultAnswer = "true"
        break
    }

    if (isNew) {
      setNewQuestion({
        ...newQuestion,
        question_type: type,
        options: defaultOptions,
        correct_answer: defaultAnswer,
      })
    } else if (editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        question_type: type,
        options: defaultOptions,
        correct_answer: defaultAnswer,
      })
    }
  }

  const renderQuestionForm = (question: Question, isNew: boolean) => {
    const updateQuestion = (updates: Partial<Question>) => {
      if (isNew) {
        setNewQuestion({ ...newQuestion, ...updates })
      } else {
        setEditingQuestion({ ...editingQuestion!, ...updates })
      }
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Question Type</label>
          <select
            value={question.question_type}
            onChange={(e) => handleQuestionTypeChange(e.target.value as QuestionType, isNew)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="fill_blank">Fill in the Blank</option>
            <option value="matching">Match the Following</option>
            <option value="true_false">True / False</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Question Text</label>
          <Textarea
            value={question.question_text}
            onChange={(e) => updateQuestion({ question_text: e.target.value })}
            placeholder={
              question.question_type === "fill_blank"
                ? "Use ___ for the blank. e.g., The capital of France is ___"
                : "Enter your question here..."
            }
            rows={3}
          />
        </div>

        {/* Multiple Choice Options */}
        {question.question_type === "multiple_choice" && (
          <div>
            <label className="block text-sm font-medium mb-2">Answer Options</label>
            <div className="space-y-2">
              {(question.options?.choices || ["", "", "", ""]).map((choice: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={isNew ? "new-correct" : "edit-correct"}
                    checked={question.correct_answer === choice && choice !== ""}
                    onChange={() => updateQuestion({ correct_answer: choice })}
                    className="w-4 h-4"
                  />
                  <Input
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...(question.options?.choices || [])]
                      newChoices[index] = e.target.value
                      updateQuestion({ options: { choices: newChoices } })
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {(question.options?.choices?.length || 0) > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newChoices = question.options.choices.filter((_: any, i: number) => i !== index)
                        updateQuestion({ options: { choices: newChoices } })
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newChoices = [...(question.options?.choices || []), ""]
                  updateQuestion({ options: { choices: newChoices } })
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Option
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Select the radio button next to the correct answer</p>
          </div>
        )}

        {/* Fill in the Blank */}
        {question.question_type === "fill_blank" && (
          <div>
            <label className="block text-sm font-medium mb-2">Correct Answer</label>
            <Input
              value={question.correct_answer}
              onChange={(e) => updateQuestion({ correct_answer: e.target.value })}
              placeholder="Enter the correct answer for the blank"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This is the word or phrase that should fill the blank (___) in the question
            </p>
          </div>
        )}

        {/* Match the Following */}
        {question.question_type === "matching" && (
          <div>
            <label className="block text-sm font-medium mb-2">Matching Pairs</label>
            <div className="space-y-2">
              {(question.options?.pairs || [{ left: "", right: "" }]).map((pair: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={pair.left}
                    onChange={(e) => {
                      const newPairs = [...(question.options?.pairs || [])]
                      newPairs[index] = { ...newPairs[index], left: e.target.value }
                      updateQuestion({ options: { pairs: newPairs } })
                    }}
                    placeholder="Left item"
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">→</span>
                  <Input
                    value={pair.right}
                    onChange={(e) => {
                      const newPairs = [...(question.options?.pairs || [])]
                      newPairs[index] = { ...newPairs[index], right: e.target.value }
                      updateQuestion({ options: { pairs: newPairs } })
                    }}
                    placeholder="Right item"
                    className="flex-1"
                  />
                  {(question.options?.pairs?.length || 0) > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPairs = question.options.pairs.filter((_: any, i: number) => i !== index)
                        updateQuestion({ options: { pairs: newPairs } })
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPairs = [...(question.options?.pairs || []), { left: "", right: "" }]
                  updateQuestion({ options: { pairs: newPairs } })
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Pair
              </Button>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-2">Correct Answer Key</label>
              <Input
                value={question.correct_answer}
                onChange={(e) => updateQuestion({ correct_answer: e.target.value })}
                placeholder="e.g., 1-A,2-B,3-C or A,B,C,D"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the correct matching pattern (the order of right items)
              </p>
            </div>
          </div>
        )}

        {/* True/False */}
        {question.question_type === "true_false" && (
          <div>
            <label className="block text-sm font-medium mb-2">Correct Answer</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={isNew ? "new-tf" : "edit-tf"}
                  checked={question.correct_answer === "true"}
                  onChange={() => updateQuestion({ correct_answer: "true" })}
                  className="w-4 h-4"
                />
                <span>True</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={isNew ? "new-tf" : "edit-tf"}
                  checked={question.correct_answer === "false"}
                  onChange={() => updateQuestion({ correct_answer: "false" })}
                  className="w-4 h-4"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
          <Textarea
            value={question.explanation || ""}
            onChange={(e) => updateQuestion({ explanation: e.target.value })}
            placeholder="Explain why this answer is correct..."
            rows={2}
          />
        </div>
      </div>
    )
  }

  const getQuestionTypeLabel = (type: QuestionType) => {
    const labels: Record<QuestionType, string> = {
      multiple_choice: "Multiple Choice",
      fill_blank: "Fill in the Blank",
      matching: "Match the Following",
      true_false: "True / False",
    }
    return labels[type] || type
  }

  const getQuestionTypeColor = (type: QuestionType) => {
    const colors: Record<QuestionType, string> = {
      multiple_choice: "bg-blue-100 text-blue-800",
      fill_blank: "bg-purple-100 text-purple-800",
      matching: "bg-green-100 text-green-800",
      true_false: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-muted"
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <p>Loading quiz...</p>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    )
  }

  if (!quiz) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Quiz not found</h2>
              <p className="text-muted-foreground mb-4">
                {error || "The quiz you're looking for doesn't exist or you don't have permission to view it."}
              </p>
              <Button onClick={fetchQuiz} variant="outline" className="mr-2 bg-transparent">
                Try Again
              </Button>
              <Link href="/admin/quiz-builder">
                <Button>Back to Quiz Builder</Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/admin/quiz-builder"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Quiz Builder
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{quiz.title}</h1>
                <p className="text-muted-foreground mt-1">
                  {quiz.category} • {quiz.duration_minutes} minutes • {questions.length} questions
                </p>
              </div>
              <Button onClick={() => setShowAddQuestion(true)} disabled={showAddQuestion}>
                <Plus className="w-4 h-4 mr-2" /> Add Question
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
              <button onClick={() => setError(null)} className="ml-2 font-bold">
                ×
              </button>
            </div>
          )}

          {/* Add Question Form */}
          {showAddQuestion && (
            <Card className="p-6 mb-6 border-primary/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Question</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddQuestion(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {renderQuestionForm(newQuestion, true)}
              <div className="flex gap-2 mt-6">
                <Button onClick={handleAddQuestion} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Add Question"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddQuestion(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {questions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No questions added yet. Add your first question to get started!
                </p>
                {!showAddQuestion && (
                  <Button onClick={() => setShowAddQuestion(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add First Question
                  </Button>
                )}
              </Card>
            ) : (
              questions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  {editingQuestion?.id === question.id ? (
                    // Edit Mode
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Editing Question {index + 1}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {renderQuestionForm(editingQuestion, false)}
                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => handleUpdateQuestion(editingQuestion)} disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getQuestionTypeColor(question.question_type)}`}>
                            {getQuestionTypeLabel(question.question_type)}
                          </span>
                        </div>
                        <p className="font-medium">{question.question_text}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Answer: <span className="font-medium">{question.correct_answer}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingQuestion(question)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(question.id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  )
}
