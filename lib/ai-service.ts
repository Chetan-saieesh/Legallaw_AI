// AI service implementation using Google's Generative AI (Gemini)
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI("AIzaSyDq1NDV9R4QkoDTyVOog5NPJ9EzpbGppZ0")
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export async function analyzeDocument(text: string, type: "general" | "risk" = "general") {
  try {
    let prompt = ""

    if (type === "general") {
      prompt = `You are an expert legal AI assistant. Analyze the following legal document:

      ${text}

      Provide a comprehensive analysis including:
      1. Document type and purpose
      2. Key parties involved
      3. Main clauses and their implications
      4. Summary of rights and obligations
      5. Important dates and deadlines

      genrate the responce without any bold or special characters, 
      use characters only supported by normal notepad .
      Format your response in a well-structured manner with markdown headings.
      Use simple characters that are supported by normal text editors like notepad.
      Avoid special characters, smart quotes, em-dashes, or any other characters that might not display correctly in basic text editors.`
    } else {
      prompt = `You are an expert legal AI assistant. Conduct a thorough risk assessment of the following legal document:

      ${text}

      Provide:
      1. Identification of high-risk clauses (with clause number/reference)
      2. Missing important clauses or protections
      3. Ambiguous or vague language that could create legal uncertainties
      4. Compliance issues with common regulations
      5. Overall risk score (1-10, where 10 is highest risk)
      6. Specific recommendations to mitigate identified risks

      genrate the responce without any bold or special characters, 
      use characters only supported by normal notepad .
      Format your response in a well-structured manner with markdown headings.
      Use simple characters that are supported by normal text editors like notepad.
      Avoid special characters, smart quotes, em-dashes, or any other characters that might not display correctly in basic text editors.`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error analyzing document:", error)
    throw new Error("Failed to analyze document. Please try again later.")
  }
}

export async function getChatResponse(message: string, history: Array<{ role: string; content: string }> = []) {
  try {
    // Format the chat history for context
    const formattedHistory = history.map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`).join("\n")

    const prompt = `You are an expert legal AI assistant specialized in contract law, compliance, and regulations.

    ${formattedHistory ? `Previous conversation:\n${formattedHistory}\n\n` : ""}
    
    User query: ${message}

    Provide a helpful, accurate response about the legal query. If you're unsure, state clearly what you don't know.
    If the question is about specific jurisdiction laws that you're not confident about, indicate that limitation.
    provide information based on indian constitution only.

    genrate the responce without any bold or special characters, 
    use characters only supported by normal notepad .
    Use simple characters that are supported by normal text editors like notepad.
    Avoid special characters, smart quotes, em-dashes, or any other characters that might not display correctly in basic text editors.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error getting chat response:", error)
    throw new Error("Failed to get a response. Please try again later.")
  }
}

export async function generateLegalDocument(type: string, parameters: Record<string, string>) {
  try {
    const prompt = `You are an expert legal document generator. Create a professional ${type} with the following parameters:

    ${Object.entries(parameters)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")}

    The document should:
    1. Follow standard legal formatting and structure
    2. Include all necessary clauses for this type of agreement
    3. Be compliant with common legal requirements
    4. Use clear, precise legal language
    5. Include proper signature blocks and date fields

    genrate the responce without any bold or special characters, 
    use characters only supported by normal notepad .
    Format your response in a well-structured manner with markdown headings.
    Use simple characters that are supported by normal text editors like notepad.
    Avoid special characters, smart quotes, em-dashes, or any other characters that might not display correctly in basic text editors.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating document:", error)
    throw new Error("Failed to generate document. Please try again later.")
  }
}

export async function searchLegalPrecedents(query: string, jurisdiction: string, timeframe: string) {
  try {
    const prompt = `You are an expert legal research assistant. The user is looking for legal precedents and case law related to:

    "${query}"
    
    Jurisdiction: ${jurisdiction}
    Timeframe: ${timeframe}

    Provide:
    1. Most relevant case names and citations (at least 3-5 if available)
    2. Brief summary of each case's ruling and significance
    3. How these precedents might apply to similar situations
    4. Any conflicting rulings or jurisdictional differences
    provide information based on indian constitution only.

    generate responce without any bold or special characters,
    use characters only supported by normal notepad.
    Format your response in a well-structured manner with markdown.
    Use simple characters that are supported by normal text editors like notepad.
    Avoid special characters, smart quotes, em-dashes, or any other characters that might not display correctly in basic text editors.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error searching precedents:", error)
    throw new Error("Failed to search precedents. Please try again later.")
  }
}

