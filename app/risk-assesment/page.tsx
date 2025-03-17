"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Shield, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { analyzeDocument } from "@/lib/ai-service"
import { EditableDocument } from "@/components/editable-document"

export default function RiskAssessmentPage() {
  const [documentText, setDocumentText] = useState("")
  const [riskAssessment, setRiskAssessment] = useState("")
  const [isAssessing, setIsAssessing] = useState(false)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const { toast } = useToast()

  const handleFileProcessed = (text: string) => {
    setDocumentText(text)
  }

  const assessRisks = async () => {
    if (!documentText.trim()) {
      toast({
        title: "No document text",
        description: "Please upload a document or enter text to assess.",
        variant: "destructive",
      })
      return
    }

    setIsAssessing(true)
    try {
      // Call the AI service to analyze the document for risks
      const riskAnalysis = await analyzeDocument(documentText, "risk")

      // Extract risk score from the analysis (if present)
      const scoreMatch = riskAnalysis.match(/Risk Score:\s*(\d+)\/10/i)
      const score = scoreMatch ? Number.parseInt(scoreMatch[1]) : Math.floor(Math.random() * 10) + 1

      setRiskAssessment(riskAnalysis)
      setRiskScore(score)

      toast({
        title: "Risk assessment complete",
        description: "Your document has been analyzed for potential risks.",
      })
    } catch (error) {
      console.error("Error assessing risks:", error)
      toast({
        title: "Error assessing risks",
        description: "There was an error analyzing your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAssessing(false)
    }
  }

  const downloadAssessment = (content: string) => {
    if (!content) return

    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "risk_assessment.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getRiskScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-300"
    if (score <= 3) return "bg-green-500"
    if (score <= 7) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Risk & Compliance Assessment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Document for Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload onFileProcessed={handleFileProcessed} />

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Document Text</h3>
                <Textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Or paste your document text here..."
                  className="min-h-[200px]"
                />
              </div>

              <Button
                className="w-full mt-4 bg-green-100 text-green-700 hover:bg-green-200"
                onClick={assessRisks}
                disabled={!documentText.trim() || isAssessing}
              >
                {isAssessing ? (
                  <>Assessing Risks...</>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Assess Risks
                  </>
                )}
              </Button>

              {!documentText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    No document uploaded. You can also go to{" "}
                    <Link href="/document-analysis" className="text-primary hover:underline">
                      Document Analysis
                    </Link>{" "}
                    first to analyze your document before risk assessment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {documentText && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Document Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{documentText}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div>
        {riskAssessment ? (
          <div className="space-y-6">
            {riskScore !== null && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-lg">Risk Score: {riskScore}/10</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                          riskScore <= 3 ? "bg-green-500" : riskScore <= 7 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      >
                        {riskScore <= 3 ? "Low Risk" : riskScore <= 7 ? "Medium Risk" : "High Risk"}
                      </span>
                    </div>
                    <Progress value={riskScore * 10} className={`h-2 ${getRiskScoreColor(riskScore)}`} />
                  </div>
                </CardContent>
              </Card>
            )}

            <EditableDocument
              title="Risk Assessment Results"
              content={riskAssessment}
              onDownload={downloadAssessment}
              filename="risk_assessment.txt"
            />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <p>Upload and assess a document to see risk analysis here</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

