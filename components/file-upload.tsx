"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FileUploadProps {
  onFileProcessed: (text: string) => void
  acceptedFileTypes?: string
  maxSizeMB?: number
}

export function FileUpload({
  onFileProcessed,
  acceptedFileTypes = ".pdf,.png,.jpg,.jpeg,.txt",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const processFile = async (file: File) => {
    if (!file) return

    // Check file size
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      })
      return
    }

    // Check file type
    const fileType = file.type
    const fileExtension = `.${file.name.split(".").pop()}`
    const acceptedTypes = acceptedFileTypes.split(",")

    if (!acceptedTypes.some((type) => type === fileExtension || (fileType && type.includes(fileType.split("/")[1])))) {
      toast({
        title: "Invalid file type",
        description: `Accepted file types: ${acceptedFileTypes}`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, you would send this to your API endpoint
      // For now, we'll simulate processing different file types
      let extractedText = ""

      if (fileType.includes("pdf")) {
        // Simulate PDF processing
        extractedText = await simulatePdfProcessing(file)
      } else if (fileType.includes("image")) {
        // Simulate image OCR
        extractedText = await simulateImageOcr(file)
      } else {
        // Assume it's a text file
        extractedText = await file.text()
      }

      onFileProcessed(extractedText)

      toast({
        title: "File processed successfully",
        description: "The text has been extracted from your document.",
      })
    } catch (error) {
      console.error("Error processing file:", error)
      toast({
        title: "Error processing file",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // These functions simulate processing that would normally happen on the server
  const simulatePdfProcessing = async (file: File): Promise<string> => {
    // In a real app, this would be done on the server with a PDF processing library
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Simulated PDF text extraction from ${file.name}.\n\nThis is placeholder text that would normally be extracted from your PDF using a library like pdf-parse or a service like Google Document AI. In a production environment, this would contain the actual text content of your document.`,
        )
      }, 2000)
    })
  }

  const simulateImageOcr = async (file: File): Promise<string> => {
    // In a real app, this would be done on the server with an OCR library
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Simulated OCR text extraction from ${file.name}.\n\nThis is placeholder text that would normally be extracted from your image using OCR technology like Tesseract or a cloud service like Google Vision API. In a production environment, this would contain the actual text content recognized in your image.`,
        )
      }, 2000)
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  return (
    <Card
      className={cn(
        "border-2 border-dashed p-4 transition-colors",
        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
      )}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />

        <div className="mb-4 mt-2">
          <h3 className="font-semibold text-lg">Upload a document</h3>
          <p className="text-sm text-muted-foreground mt-1">Drag and drop or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports {acceptedFileTypes} (Max {maxSizeMB}MB)
          </p>
        </div>

        <Input
          id="file-upload"
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleChange}
          disabled={isUploading}
        />

        <Button
          asChild
          variant="secondary"
          disabled={isUploading}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Select File"
            )}
          </label>
        </Button>
      </CardContent>
    </Card>
  )
}

// Helper function to conditionally join class names
import { cn } from "@/lib/utils"

