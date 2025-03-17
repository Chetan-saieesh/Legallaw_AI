"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ar", label: "Arabic" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
]

export function LanguageSelector() {
  const [language, setLanguage] = useState("en")
  const router = useRouter()

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    // In a real app, you might want to store this in localStorage or a cookie
    // and then refresh the page or update the UI accordingly
    localStorage.setItem("preferredLanguage", value)
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="language">Language</Label>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger id="language">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

