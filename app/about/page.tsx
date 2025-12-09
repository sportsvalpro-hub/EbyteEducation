import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">About eByte Education</h1>

          <div className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                eByte Education is dedicated to making quality education accessible to everyone. We combine the best
                course content from Udemy with intelligent AI-powered assessments to create a comprehensive learning
                experience that adapts to each student's unique needs.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Access to premium Udemy courses on various topics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>AI-powered quizzes that adapt to your learning pace</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Interactive exercises with multiple practice types</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Detailed performance analytics and recommendations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>Personalized learning paths based on your goals</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <p className="text-muted-foreground mb-6">
                eByte Education is built by educators and technologists passionate about transforming how people learn.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {["Founder & CEO", "CTO", "Head of Learning"].map((role, i) => (
                  <div key={i} className="text-center p-4 border border-border rounded">
                    <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-3"></div>
                    <p className="font-semibold">Team Member</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
