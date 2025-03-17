"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateLegalDocument } from "@/lib/ai-service"
import { EditableDocument } from "@/components/editable-document"

export default function DocumentGeneratorPage() {
  const [documentType, setDocumentType] = useState("nda")
  const [customRequirements, setCustomRequirements] = useState("")
  const [generatedDocument, setGeneratedDocument] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    // NDA fields
    disclosingParty: "",
    receivingParty: "",
    purpose: "",
    duration: "2",
    governingLaw: "",

    // Employment Contract fields
    employer: "",
    employee: "",
    position: "",
    startDate: "",
    salary: "50000",
    benefits: "",

    // Service Agreement fields
    serviceProvider: "",
    client: "",
    services: "",
    paymentTerms: "",
    startDate2: "",
    endDate: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateDocument = async () => {
    // Validate form based on document type
    if (documentType === "nda" && (!formData.disclosingParty || !formData.receivingParty)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    } else if (documentType === "employment" && (!formData.employer || !formData.employee || !formData.position)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    } else if (documentType === "service" && (!formData.serviceProvider || !formData.client || !formData.services)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    } else if (documentType === "custom" && !customRequirements.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe your document requirements.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Prepare parameters based on document type
      let documentTypeLabel = ""
      let parameters: Record<string, string> = {}

      if (documentType === "nda") {
        documentTypeLabel = "Non-Disclosure Agreement"
        parameters = {
          disclosingParty: formData.disclosingParty,
          receivingParty: formData.receivingParty,
          purpose: formData.purpose,
          duration: formData.duration + " years",
          governingLaw: formData.governingLaw,
        }
      } else if (documentType === "employment") {
        documentTypeLabel = "Employment Contract"
        parameters = {
          employer: formData.employer,
          employee: formData.employee,
          position: formData.position,
          startDate: formData.startDate,
          salary: "$" + formData.salary,
          benefits: formData.benefits,
        }
      } else if (documentType === "service") {
        documentTypeLabel = "Service Agreement"
        parameters = {
          serviceProvider: formData.serviceProvider,
          client: formData.client,
          services: formData.services,
          paymentTerms: formData.paymentTerms,
          startDate: formData.startDate2,
          endDate: formData.endDate,
        }
      } else if (documentType === "custom") {
        documentTypeLabel = "Custom Document"
        parameters = {
          requirements: customRequirements,
        }
      }

      // Call the AI service to generate the document
      const document = await generateLegalDocument(documentTypeLabel, parameters)
      setGeneratedDocument(document)

      toast({
        title: "Document generated",
        description: "Your legal document has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating document:", error)
      toast({
        title: "Error generating document",
        description: "There was an error generating your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadDocument = (content: string) => {
    if (!content) return

    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${documentType}_document.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📝 Document Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Document Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={documentType} onValueChange={setDocumentType}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="nda">NDA</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="service">Service</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>

                <TabsContent value="nda" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="disclosingParty">Disclosing Party</Label>
                    <Input
                      id="disclosingParty"
                      name="disclosingParty"
                      value={formData.disclosingParty}
                      onChange={handleInputChange}
                      placeholder="Company or individual disclosing information"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receivingParty">Receiving Party</Label>
                    <Input
                      id="receivingParty"
                      name="receivingParty"
                      value={formData.receivingParty}
                      onChange={handleInputChange}
                      placeholder="Company or individual receiving information"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Disclosure</Label>
                    <Textarea
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      placeholder="Describe why confidential information is being shared"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (years)</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 5, 10].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year} {year === 1 ? "year" : "years"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="governingLaw">Governing Law</Label>
                    <Input
                      id="governingLaw"
                      name="governingLaw"
                      value={formData.governingLaw}
                      onChange={handleInputChange}
                      placeholder="State or country whose laws govern this agreement"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="employment" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer">Employer Name</Label>
                    <Input
                      id="employer"
                      name="employer"
                      value={formData.employer}
                      onChange={handleInputChange}
                      placeholder="Company or individual hiring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee Name</Label>
                    <Input
                      id="employee"
                      name="employee"
                      value={formData.employee}
                      onChange={handleInputChange}
                      placeholder="Person being hired"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Job Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Title or role"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Annual Salary ($)</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea
                      id="benefits"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      placeholder="Health insurance, retirement, vacation, etc."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="service" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceProvider">Service Provider</Label>
                    <Input
                      id="serviceProvider"
                      name="serviceProvider"
                      value={formData.serviceProvider}
                      onChange={handleInputChange}
                      placeholder="Company or individual providing services"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      placeholder="Company or individual receiving services"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="services">Services Description</Label>
                    <Textarea
                      id="services"
                      name="services"
                      value={formData.services}
                      onChange={handleInputChange}
                      placeholder="Detailed description of services to be provided"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Textarea
                      id="paymentTerms"
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleInputChange}
                      placeholder="Amount, schedule, method of payment"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate2">Start Date</Label>
                      <Input
                        id="startDate2"
                        name="startDate2"
                        type="date"
                        value={formData.startDate2}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="customRequirements">Document Requirements</Label>
                    <Textarea
                      id="customRequirements"
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      placeholder="Describe your document requirements in detail..."
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Tips for Custom Documents</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Specify the type of document you need (agreement, policy, etc.)</li>
                      <li>Include all parties involved and their roles</li>
                      <li>Describe the purpose and scope of the document</li>
                      <li>Mention any specific clauses or provisions you want included</li>
                      <li>Note any jurisdiction-specific requirements</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                className="w-full mt-6 bg-purple-100 text-purple-700 hover:bg-purple-200"
                onClick={generateDocument}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating Document...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          {generatedDocument ? (
            <EditableDocument
              title="Generated Document"
              content={generatedDocument}
              onDownload={downloadDocument}
              filename={`${documentType}_document.txt`}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Generated Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4" />
                  <p>Fill out the form and generate a document to see it here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

