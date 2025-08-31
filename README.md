# ⚖️ Legal Case Argument Generator

This project is a **Legal Case Argument Generator** that helps you prepare for legal cases by generating structured arguments, cross-question answers, and responses based on the issue you provide.  

With this tool, you can:  
- ✍️ Enter your case and legal issue.  
- 🤖 Generate arguments with possible cross-question answers.  
- 📑 Download the generated response as a PDF.  
- 📋 Copy the output to your clipboard for easy use.  

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository

git clone https://github.com/your-username/legal-case-argument-generator.git
cd legal-case-argument-generator

Initialize Node.js Project
npm init -y

Install Dependencies
npm install express @google/generative-ai cors dotenv

Configure Environment Variables
Create a .env file in the project root and add your API key:
GEMINI_API_KEY=your_api_key_here

Run the Server
node server.js
