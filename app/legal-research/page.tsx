"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, BookOpen } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { searchLegalPrecedents } from "@/lib/ai-service"
import { EditableDocument } from "@/components/editable-document"

export default function LegalResearchPage() {
  const [researchQuery, setResearchQuery] = useState("")
  const [jurisdiction, setJurisdiction] = useState("india")
  const [state, setState] = useState("")
  const [timeframe, setTimeframe] = useState("all")
  const [researchResults, setResearchResults] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!researchQuery.trim()) {
      toast({
        title: "Missing query",
        description: "Please enter a research query.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    try {
      // Format jurisdiction for the API call
      const jurisdictionText = getJurisdictionName(jurisdiction, state)
      const timeframeText = getTimeframeText(timeframe)

      // Call the AI service to search for legal precedents
      const results = await searchLegalPrecedents(researchQuery, jurisdictionText, timeframeText)

      setResearchResults(results)

      toast({
        title: "Research complete",
        description: "Legal precedents have been found for your query.",
      })
    } catch (error) {
      console.error("Error researching precedents:", error)
      toast({
        title: "Error researching precedents",
        description: "There was an error processing your query. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const getJurisdictionName = (jurisdiction: string, state: string): string => {
    switch (jurisdiction) {
      case "us-federal":
        return "United States (Federal)"
      case "us-state":
        return `United States (${state})`
      case "eu":
        return "European Union"
      case "uk":
        return "United Kingdom"
      case "canada":
        return "Canada"
      case "australia":
        return "Australia"
      case "international":
        return "International Law"
      case "india":
        return `India (${state})`
      default:
        return jurisdiction
    }
  }

  const getTimeframeText = (timeframe: string): string => {
    switch (timeframe) {
      case "all":
        return "All Time"
      case "5":
        return "Last 5 Years"
      case "10":
        return "Last 10 Years"
      case "20":
        return "Last 20 Years"
      default:
        return timeframe
    }
  }

  const downloadResults = (content: string) => {
    if (!content) return

    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "legal_research.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔎 Legal Research Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Research Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="researchQuery">Legal Issue or Question</Label>
                <Textarea
                  id="researchQuery"
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  placeholder="Describe the legal issue you want to research..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger id="timeframe">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="5">Last 5 Years</SelectItem>
                    <SelectItem value="10">Last 10 Years</SelectItem>
                    <SelectItem value="20">Last 20 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full mt-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>Searching Legal Precedents...</>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Legal Precedents
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Popular Research Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Contract breach remedies",
                  "Employment discrimination standards",
                  "Intellectual property infringement",
                  "Corporate liability limitations",
                  "Data privacy compliance requirements",
                ].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    className="justify-start hover:bg-gray-50"
                    onClick={() => setResearchQuery(topic)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {researchResults ? (
            <EditableDocument
              title="Research Results"
              content={researchResults}
              onDownload={downloadResults}
              filename="legal_research.txt"
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Research Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-4" />
                  <p>Enter a query and search to see legal precedents here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

