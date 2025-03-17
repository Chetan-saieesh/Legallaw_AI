"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, Edit, Save, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EditableDocumentProps {
  title: string
  content: string
  onDownload: (content: string) => void
  filename?: string
}

export function EditableDocument({ title, content, onDownload, filename = "document.txt" }: EditableDocumentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const editorRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Update edited content when the original content changes
  useEffect(() => {
    setEditedContent(content)
  }, [content])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editorRef.current) {
      // Get the content from the contentEditable div
      const newContent = editorRef.current.innerText
      setEditedContent(newContent)
      setIsEditing(false)

      toast({
        title: "Changes saved",
        description: "Your edits have been applied to the document.",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent)
    toast({
      title: "Copied to clipboard",
      description: "Document content has been copied to your clipboard.",
    })
  }

  const handleDownload = () => {
    onDownload(editedContent)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <div className="flex space-x-2">
            {isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="bg-green-100 text-green-700 hover:bg-green-200"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="bg-pink-100 text-pink-700 hover:bg-pink-200"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div
            ref={editorRef}
            contentEditable
            className="prose max-w-none p-4 border rounded-md min-h-[400px] focus:outline-none focus:ring-2 focus:ring-primary"
            dangerouslySetInnerHTML={{ __html: editedContent.replace(/\n/g, "<br>") }}
          />
        ) : (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: editedContent.replace(/\n/g, "<br>") }} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

