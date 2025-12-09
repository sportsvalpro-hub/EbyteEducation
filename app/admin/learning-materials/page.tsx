"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function LearningMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    type: "pdf",
    url: "",
  })

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault()
    const newMaterial = {
      id: Date.now(),
      ...formData,
      added: new Date().toLocaleDateString(),
    }
    setMaterials([newMaterial, ...materials])
    setFormData({ title: "", course: "", type: "pdf", url: "" })
    setShowForm(false)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Learning Materials</h1>
                <p className="text-muted-foreground">Upload and manage course materials, PDFs, and notes.</p>
              </div>
              <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add Material"}</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form */}
              {showForm && (
                <Card className="p-6 lg:col-span-1">
                  <h2 className="text-xl font-bold mb-4">Add Material</h2>
                  <form onSubmit={handleAddMaterial} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Material Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., JavaScript Guide"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Course</label>
                      <Input
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        placeholder="e.g., The Complete JavaScript"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-md"
                      >
                        <option value="pdf">PDF</option>
                        <option value="notes">Notes</option>
                        <option value="video">Video</option>
                        <option value="slides">Slides</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">URL/File</label>
                      <Input
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Add Material
                    </Button>
                  </form>
                </Card>
              )}

              {/* Materials List */}
              <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Learning Materials</h2>
                  {materials.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No materials added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <div key={material.id} className="p-4 border border-border rounded-lg hover:bg-muted/50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{material.title}</h3>
                              <p className="text-sm text-muted-foreground">{material.course}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                                  {material.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">Added {material.added}</div>
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
