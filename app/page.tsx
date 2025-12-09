import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Learn Smarter with <span className="text-primary">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Master your courses with AI-powered assessments, intelligent quizzes, and personalized learning paths.
              Courses hosted on Udemy + Assessments on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/request-access">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Request Access
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose eByte?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Quizzes",
                  description:
                    "Intelligent assessments that adapt to your learning pace and provide personalized feedback.",
                  icon: "🤖",
                },
                {
                  title: "Interactive Exercises",
                  description: "Practice with multiple-choice, fill-in-the-blank, matching, and true/false exercises.",
                  icon: "✏️",
                },
                {
                  title: "Real-Time Analytics",
                  description:
                    "Track your progress with detailed insights into strengths, weaknesses, and recommended modules.",
                  icon: "📊",
                },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: "1", title: "Enroll", desc: "Choose courses from Udemy" },
                { step: "2", title: "Learn", desc: "Follow course materials" },
                { step: "3", title: "Practice", desc: "Complete exercises and quizzes" },
                { step: "4", title: "Improve", desc: "Get AI-driven recommendations" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-primary/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students using eByte Education to achieve their goals.
            </p>
            <Link href="/request-access">
              <Button size="lg">Request Access Today</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
