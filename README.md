<div align="center">
  <img src="https://raw.githubusercontent.com/dhirajharane/startup-idea-validator/main/app/icon.png" alt="StartupInspector Logo" width="120">
  <h1 align="center">StartUpInspector</h1>
  <p align="center">
    <strong>Validate your next big idea with the power of AI.</strong>
  </p>
  <p align="center">
    <a href="#key-features"><strong>Key Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#screenshots"><strong>Screenshots</strong></a>
  </p>
  <br>
</div>

**StartUpInspector** is a cutting-edge, AI-powered platform designed to provide entrepreneurs and innovators with comprehensive, data-driven feedback on their startup ideas. In just seconds, transform a simple concept into a detailed report, complete with SWOT analysis, market trends, competitor insights, and a calculated success score.

---

## 🚀 Live Demo

Experience the power of StartUpInspector firsthand.

**[http://startup-idea-validator-omega.vercel.app/]**

## ✨ Key Features

- **🤖 AI-Powered Analysis:** Leverages advanced language models to provide a deep and insightful analysis of your startup idea.
- **📊 Comprehensive Reports:** Generates a full report that includes:
  - **SWOT Analysis:** Strengths, Weaknesses, Opportunities, and Threats.
  - **📈 Market Trends:** Real-time insights into the current market landscape.
  - **👥 Competitor Analysis:** A detailed look at the competitive environment.
  - **💰 Monetization Strategies:** Actionable ideas for generating revenue.
  - **💡 Actionable Insights:** Concrete steps to improve and refine your idea.
  - **📋 Pitch Deck Outline:** A structured outline to help you create a compelling pitch deck.
  - **💯 Success Score:** A unique score to quickly gauge the potential of your idea.
- **🔐 Secure Authentication:** Robust user authentication system with email/password and OTP-based login.
- **🖥️ Intuitive Dashboard:** A sleek and modern dashboard to manage your analyses, view your history, and track your credits.
- **📄 PDF Export:** Download your detailed reports as a professional PDF.
- **⭐ Save Reports:** Bookmark and save your most promising reports for future reference.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI/LLM:** [LangChain.js](https://js.langchain.com/) with [Groq](https://groq.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **PDF Generation:** [Puppeteer](https://pptr.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18.17.0 or later)
- MongoDB account and connection string
- API keys for Groq and SerpAPI

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/dhirajharane/startup-idea-validator.git](https://github.com/dhirajharane/startup-idea-validator.git)
    cd startup-idea-validator
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following variables:

    ```env
    # MongoDB
    MONGODB_URI=your_mongodb_connection_string

    # NextAuth
    AUTH_SECRET=your_auth_secret
    AUTH_URL=http://localhost:3000

    # LangChain & Groq
    GROQ_API_KEY=your_groq_api_key
    GROQ_MODEL_NAME=llama-3.1-8b-instant

    # SerpAPI for web scraping
    SERP_API_KEY=your_serpapi_key

    # Email (for OTP)
    EMAIL_SERVER_HOST=your_email_server_host
    EMAIL_SERVER_PORT=your_email_server_port
    EMAIL_SERVER_USER=your_email_server_user
    EMAIL_SERVER_PASSWORD=your_email_server_password
    EMAIL_FROM=your_email_from_address
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
             |

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

Dhiraj Harane - dhirajharane@gmail.com

Project Link: [https://github.com/dhirajharane/startup-idea-validator](https://github.com/dhirajharane/startup-idea-validator)
