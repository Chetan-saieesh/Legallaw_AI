"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat-interface"
import { useToast } from "@/components/ui/use-toast"
import { getChatResponse } from "@/lib/ai-service"
import { VoiceChatControls } from "@/components/voice-chat-controls"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LegalChatbotPage() {
  const { toast } = useToast()
  const [currentMessage, setCurrentMessage] = useState("")
  const [lastResponse, setLastResponse] = useState("")
  const [language, setLanguage] = useState("en-US")

  const handleChatMessage = async (message: string): Promise<string> => {
    try {
      // Call the AI service to get a chat response
      const response = await getChatResponse(message)
      setLastResponse(response)
      return response
    } catch (error) {
      console.error("Error getting chat response:", error)
      return "I'm sorry, I encountered an error processing your request. Please try again."
    }
  }

  const handleVoiceInput = (text: string) => {
    setCurrentMessage(text)
    // You could automatically send the message here if desired
    toast({
      title: "Voice input received",
      description: text,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">💬 Legal Chatbot</h1>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ask Legal Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatInterface
              onSendMessage={handleChatMessage}
              initialInputValue={currentMessage}
              onInputChange={setCurrentMessage}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <VoiceChatControls onSpeechResult={handleVoiceInput} textToSpeak={lastResponse} language={language} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="en-US" onValueChange={setLanguage}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="en-US">English</TabsTrigger>
                  <TabsTrigger value="te-IN">Telugu</TabsTrigger>
                </TabsList>
                <TabsContent value="en-US">
                  <p className="text-sm text-muted-foreground mt-2">Voice input and output will use English (US).</p>
                </TabsContent>
                <TabsContent value="te-IN">
                  <p className="text-sm text-muted-foreground mt-2">Voice input and output will use Telugu.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Contract interpretation",
                "Privacy policies",
                "Employment law",
                "Intellectual property",
                "Business regulations",
                "Real estate law",
              ].map((topic) => (
                <Card key={topic} className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4" onClick={() => setCurrentMessage(topic)}>
                    <p>{topic}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground p-4 border rounded-lg">
          <p className="font-medium">Disclaimer:</p>
          <p>
            This AI assistant provides general legal information for educational purposes only. It is not a substitute
            for professional legal advice. Always consult with a qualified attorney for advice specific to your
            situation.
          </p>
        </div>
      </div>
    </div>
  )
}

