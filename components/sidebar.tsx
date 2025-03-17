"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, MessageSquare, Search, Shield, FileSignature, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LanguageSelector } from "./language-selector"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Document Analysis",
    href: "/document-analysis",
    icon: FileText,
  },
  {
    name: "Legal Chatbot",
    href: "/legal-chatbot",
    icon: MessageSquare,
  },
  {
    name: "Risk Assessment",
    href: "/risk-assessment",
    icon: Shield,
  },
  {
    name: "Document Generator",
    href: "/document-generator",
    icon: FileSignature,
  },
  {
    name: "Legal Research",
    href: "/legal-research",
    icon: Search,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-card p-4 border-r-primary/10 dark:border-r-primary/20">
      <div className="flex items-center justify-center mb-8 pt-4">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-primary">⚖️ AI Legal Assistant</h1>
          <p className="text-xs text-muted-foreground">Your Intelligent Legal Partner</p>
        </div>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-all hover:scale-105",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4 space-y-4">
        <LanguageSelector />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2025 AI Legal Assistant</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

