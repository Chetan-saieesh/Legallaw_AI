"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, Bot, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  initialMessages?: Message[]
  documentContext?: string
  onSendMessage: (message: string) => Promise<string>
  initialInputValue?: string
  onInputChange?: (value: string) => void
}

export function ChatInterface({
  initialMessages = [],
  documentContext,
  onSendMessage,
  initialInputValue = "",
  onInputChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState(initialInputValue)
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Update input when initialInputValue changes
  useEffect(() => {
    setInput(initialInputValue)
  }, [initialInputValue])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    // Notify parent component of input change if callback provided
    if (onInputChange) {
      onInputChange("")
    }

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setIsLoading(true)
    try {
      // Get response from AI
      const response = await onSendMessage(userMessage)

      // Add AI response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast({
      title: "Chat cleared",
      description: "All messages have been removed from the chat.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Notify parent component of input change if callback provided
    if (onInputChange) {
      onInputChange(e.target.value)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {documentContext && (
        <Card className="mb-4 bg-gray-50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Document Context</h3>
            <p className="text-sm text-muted-foreground">
              {documentContext.length > 200 ? `${documentContext.substring(0, 200)}...` : documentContext}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chat</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          disabled={messages.length === 0}
          className="bg-pink-100 text-pink-700 hover:bg-pink-200"
        >
          <Trash className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      <Card className="flex-1 mb-4">
        <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">How can I help you today?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ask me any legal questions or about the document you've uploaded.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className={message.role === "user" ? "ml-2" : "mr-2"}>
                      <AvatarFallback>
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex flex-row">
                    <Avatar className="mr-2">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-gray-100">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </Card>

      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 min-h-[80px] resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="h-10 bg-green-100 text-green-700 hover:bg-green-200"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  )
}

