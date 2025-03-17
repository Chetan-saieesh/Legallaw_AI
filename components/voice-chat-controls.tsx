"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface VoiceChatControlsProps {
  onSpeechResult: (text: string) => void
  textToSpeak?: string
  language?: string
}

export function VoiceChatControls({ onSpeechResult, textToSpeak, language = "en-US" }: VoiceChatControlsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceLanguage, setVoiceLanguage] = useState(language)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser")
      return
    }

    // Get available voices for speech synthesis
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)

      // Set a default voice if available
      if (voices.length > 0 && !selectedVoice) {
        // Try to find a voice that matches the current language
        const matchingVoice = voices.find((voice) => voice.lang.startsWith(voiceLanguage.split("-")[0]))
        setSelectedVoice(matchingVoice?.name || voices[0].name)
      }
    }

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices
    }

    updateVoices()
  }, [voiceLanguage, selectedVoice])

  // Handle language change
  useEffect(() => {
    setVoiceLanguage(language)
  }, [language])

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Start speech recognition
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.error("Speech recognition not supported")
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = voiceLanguage
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onSpeechResult(transcript)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  // Stop speech recognition
  const stopListening = () => {
    setIsListening(false)
    // The recognition.onend event will handle cleanup
  }

  // Speak text using speech synthesis
  const speakText = () => {
    if (!textToSpeak) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)

    // Set the language
    utterance.lang = voiceLanguage

    // Set the selected voice if available
    if (selectedVoice) {
      const voice = availableVoices.find((v) => v.name === selectedVoice)
      if (voice) utterance.voice = voice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error", event)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  // Language options
  const languageOptions = [
    { value: "en-US", label: "English (US)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "es-ES", label: "Spanish" },
    { value: "fr-FR", label: "French" },
    { value: "de-DE", label: "German" },
    { value: "hi-IN", label: "Hindi" },
    { value: "te-IN", label: "Telugu" },
    { value: "ta-IN", label: "Tamil" },
    { value: "ar-SA", label: "Arabic" },
    { value: "zh-CN", label: "Chinese (Simplified)" },
    { value: "ja-JP", label: "Japanese" },
    { value: "ko-KR", label: "Korean" },
  ]

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium text-lg mb-2">Voice Controls</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voice-language">Voice Language</Label>
          <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
            <SelectTrigger id="voice-language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {availableVoices.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="voice-selection">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger id="voice-selection">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {availableVoices
                  .filter((voice) => voice.lang.startsWith(voiceLanguage.split("-")[0]))
                  .map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "outline"}
          className={`flex-1 ${isListening ? "" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Voice Input
            </>
          )}
        </Button>

        {textToSpeak && (
          <Button
            onClick={speakText}
            variant={isSpeaking ? "destructive" : "outline"}
            className={`flex-1 ${isSpeaking ? "" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="mr-2 h-4 w-4" />
                Stop Speaking
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Read Response
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

