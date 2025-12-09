"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const PENDING_USERS = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "user",
    addedDate: "2025-12-01",
    addedBy: "manager@ebyte.edu",
  },
  {
    id: 2,
    name: "Mike Davis",
    email: "mike@example.com",
    role: "user",
    addedDate: "2025-11-25",
    addedBy: "manager@ebyte.edu",
  },
  {
    id: 3,
    name: "Lisa Chen",
    email: "lisa@example.com",
    role: "management",
    addedDate: "2025-11-20",
    addedBy: "admin@ebyte.edu",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@example.com",
    role: "user",
    addedDate: "2025-11-18",
    addedBy: "manager@ebyte.edu",
  },
]

export default function ValidateUsersPage() {
  const [users, setUsers] = useState(PENDING_USERS)
  const [actionLog, setActionLog] = useState<any[]>([])

  const handleApprove = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setActionLog([{ action: "approved", user: user.name, time: new Date().toLocaleTimeString() }, ...actionLog])
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  const handleReject = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setActionLog([{ action: "rejected", user: user.name, time: new Date().toLocaleTimeString() }, ...actionLog])
      setUsers(users.filter((u) => u.id !== userId))
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
              {/* Pending Users */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Pending Requests ({users.length})</h2>
                  {users.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending validations.</p>
                  ) : (
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                              {user.role}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-3">
                            Added {user.addedDate} by {user.addedBy}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReject(user.id)}>
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Action Log */}
              <Card className="p-6 h-fit">
                <h3 className="font-bold mb-4">Action Log</h3>
                {actionLog.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No actions taken yet</p>
                ) : (
                  <div className="space-y-2">
                    {actionLog.map((log, i) => (
                      <div key={i} className="text-xs">
                        <p className="font-medium capitalize">
                          {log.action} {log.user}
                        </p>
                        <p className="text-muted-foreground">{log.time}</p>
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
