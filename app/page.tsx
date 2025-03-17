import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, FileText, MessageSquare, Search, Shield, FileSignature } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">⚖️ AI Legal Assistant</h1>
        <p className="text-lg text-muted-foreground">Your Intelligent Legal Partner</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-sm transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Analysis
            </CardTitle>
            <CardDescription>Upload and analyze legal documents</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Upload contracts, agreements, or other legal documents for AI-powered analysis. Get key insights and
              summaries.
            </p>
            <Link href="/document-analysis" className="mt-auto">
              <Button className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Legal Chatbot
            </CardTitle>
            <CardDescription>Get answers to your legal questions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Ask questions about contracts, compliance, regulations, and get AI-powered responses from our legal
              assistant.
            </p>
            <Link href="/legal-chatbot" className="mt-auto">
              <Button className="w-full bg-green-100 text-green-700 hover:bg-green-200">
                Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <CardDescription>Identify potential risks in your contracts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Get a detailed risk assessment of your legal documents. Identify high-risk clauses and compliance issues.
            </p>
            <Link href="/risk-assessment" className="mt-auto">
              <Button className="w-full bg-purple-100 text-purple-700 hover:bg-purple-200">
                Assess Risks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Document Generator
            </CardTitle>
            <CardDescription>Create customized legal documents</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Generate professional legal documents like NDAs, contracts, and agreements based on your requirements.
            </p>
            <Link href="/document-generator" className="mt-auto">
              <Button className="w-full bg-pink-100 text-pink-700 hover:bg-pink-200">
                Generate Documents <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Legal Research
            </CardTitle>
            <CardDescription>Find relevant precedents and case law</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Research legal precedents, case law, and regulatory information to strengthen your legal position.
            </p>
            <Link href="/legal-research" className="mt-auto">
              <Button className="w-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                Start Research <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 AI Legal Assistant | Developed By Dhanush Kumar Guvvala .
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Disclaimer: This tool provides information for general purposes only and is not a substitute for professional
          legal advice.
        </p>
      </div>
    </div>
  )
}

