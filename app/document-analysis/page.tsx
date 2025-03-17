"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { ChatInterface } from "@/components/chat-interface"
import { FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { analyzeDocument, getChatResponse } from "@/lib/ai-service"
import { EditableDocument } from "@/components/editable-document"

export default function DocumentAnalysisPage() {
  const [documentText, setDocumentText] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const handleFileProcessed = (text: string) => {
    setDocumentText(text)
  }

  const analyzeDocumentHandler = async () => {
    if (!documentText.trim()) {
      toast({
        title: "No document text",
        description: "Please upload a document or enter text to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      // Call the AI service to analyze the document
      const analysisResult = await analyzeDocument(documentText, "general")
      setAnalysis(analysisResult)

      toast({
        title: "Analysis complete",
        description: "Your document has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing document:", error)
      toast({
        title: "Error analyzing document",
        description: "There was an error analyzing your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleChatMessage = async (message: string): Promise<string> => {
    try {
      // Call the AI service to get a chat response
      return await getChatResponse(message, [
        {
          role: "system",
          content: `Context: The user has uploaded a document with the following text:\n${documentText.substring(0, 500)}...\n`,
        },
      ])
    } catch (error) {
      console.error("Error getting chat response:", error)
      return "I'm sorry, I encountered an error processing your request. Please try again."
    }
  }

  const downloadAnalysis = (content: string) => {
    if (!content) return

    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "document_analysis.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📄 Document Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
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
                className="w-full mt-4 bg-sky-100 text-sky-700 hover:bg-sky-200"
                onClick={analyzeDocumentHandler}
                disabled={!documentText.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>Analyzing Document...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Document
                  </>
                )}
              </Button>
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

      <div className="mb-6">
        <Tabs defaultValue="analysis">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            {analysis ? (
              <EditableDocument
                title="Document Analysis"
                content={analysis}
                onDownload={downloadAnalysis}
                filename="document_analysis.txt"
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Document Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <p>Upload and analyze a document to see results here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardContent className="pt-6">
                <ChatInterface documentContext={documentText} onSendMessage={handleChatMessage} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

