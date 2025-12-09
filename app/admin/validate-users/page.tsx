"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Check, X, Loader2 } from "lucide-react"

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
  status: string
}

export default function ValidateUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [actionLog, setActionLog] = useState<any[]>([])

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("/api/users?status=pending")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (userId: string, newStatus: "active" | "rejected", userName: string) => {
    setProcessingId(userId)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }), // We only update status, keeping existing role
      })

      if (response.ok) {
        // Remove from list
        setUsers(users.filter((u) => u.id !== userId))
        
        // Add to log
        const action = newStatus === "active" ? "approved" : "rejected"
        setActionLog([
          { 
            action, 
            user: userName, 
            time: new Date().toLocaleTimeString() 
          }, 
          ...actionLog
        ])
      }
    } catch (error) {
      console.error(`Error updating user status:`, error)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Validate Users</h1>
              <p className="text-muted-foreground">Review and approve pending user registrations.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Pending Users List */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Pending Requests</h2>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {users.length}
                    </span>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                      <p>No pending validations found.</p>
                      <p className="text-sm mt-1">New user requests will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {user.first_name} {user.last_name}
                                </h3>
                                <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                                  user.role === 'management' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Requested: {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex gap-2 self-start sm:self-center">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(user.id, "active", `${user.first_name} ${user.last_name}`)}
                                disabled={processingId === user.id}
                                className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                              >
                                {processingId === user.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-2" /> Approve
                                  </>
                                )}
                              </Button>
                              
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateStatus(user.id, "rejected", `${user.first_name} ${user.last_name}`)}
                                disabled={processingId === user.id}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                              >
                                <X className="w-4 h-4 mr-2" /> Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Action Log */}
              <Card className="p-6 h-fit sticky top-24">
                <h3 className="font-bold mb-4">Recent Actions</h3>
                {actionLog.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No actions taken in this session</p>
                ) : (
                  <div className="space-y-3">
                    {actionLog.map((log, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm pb-3 border-b border-border last:border-0">
                        <div className={`mt-1 w-2 h-2 rounded-full ${
                          log.action === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p>
                            <span className="font-medium capitalize">{log.action}</span>{" "}
                            access for <strong>{log.user}</strong>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </ProtectedRoute>
  )
}