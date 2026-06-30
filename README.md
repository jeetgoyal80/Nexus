# Nexus AI – No-Code AI Chatbot Builder with Developer SDK

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)
![Express](https://img.shields.io/badge/Framework-Express-000000)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)
![FastAPI](https://img.shields.io/badge/RAG-FastAPI-009688)
![Qdrant](https://img.shields.io/badge/Vector%20DB-Qdrant-DC244C)
![Groq](https://img.shields.io/badge/LLM-Groq-F55036)

**Build, Customize, Deploy, and Embed AI Chatbots — Without Writing AI Infrastructure**

</div>

---

# 🚀 Overview

**Nexus AI** is a production-ready AI SaaS platform that enables users to create, customize, deploy, and embed intelligent AI chatbots without building or managing AI infrastructure.

Instead of creating separate applications for every chatbot, Nexus AI treats each chatbot as a configurable runtime entity. Every bot stores its own:

- Personality
- Behavior
- Instructions
- Appearance
- Knowledge Base
- Runtime Provider
- Deployment Configuration

At runtime, Nexus AI dynamically constructs prompts, retrieves relevant knowledge using Retrieval-Augmented Generation (RAG), interacts with Large Language Models (LLMs), stores conversation history, and delivers intelligent responses through web applications or embeddable SDKs.

---

# ✨ Key Features

## 🤖 AI Chatbot Builder

- Create unlimited AI chatbots
- Configure chatbot personality
- Define role and behavior
- Customize tone
- Custom instructions
- Output formatting
- Welcome messages

---

## 🎨 Appearance Builder

Design chatbot UI without coding.

Supports:

- Multiple themes
- Brand colors
- Avatar customization
- Welcome screen
- Floating widget
- Embedded chatbot
- Fullscreen chatbot
- Responsive layouts

---

## 📚 Knowledge Base (RAG)

Upload your own documents and let the chatbot answer based on your content.

Supported formats:

- PDF
- DOCX
- TXT
- CSV
- HTML
- Excel

Knowledge pipeline:

```
Upload Document
        │
        ▼
Cloudinary Storage
        │
        ▼
BullMQ Queue
        │
        ▼
Python FastAPI
        │
        ▼
Extract Text
        │
        ▼
Chunk Documents
        │
        ▼
Generate Embeddings
        │
        ▼
Store in Qdrant
        │
        ▼
Semantic Retrieval
        │
        ▼
LLM Context
```

---

## 💬 Intelligent Chat Runtime

Runtime automatically:

- Retrieves chatbot configuration
- Retrieves relevant knowledge
- Builds dynamic prompts
- Selects runtime provider
- Calls Groq LLM
- Stores conversations
- Returns grounded responses

---

## 🔐 Authentication

- JWT Authentication
- Refresh Tokens
- Secure HttpOnly Cookies
- Google OAuth
- Protected Routes
- Role-based Authorization

---

## 🌐 Public Deployment

Deploy chatbots instantly.

Supports:

- Public chatbot pages
- Shareable URLs
- Public API Keys
- Website embedding
- SDK Integration

---

## 📦 React Developer SDK

Embed Nexus AI chatbots into any React application.

Supports:

- Widget Mode
- Embedded Mode
- Fullscreen Mode

Example:

```tsx
<ChatBot
    botId="YOUR_BOT_ID"
    publicKey="PUBLIC_KEY"
    mode="widget"
/>
```

---

# 🏗️ System Architecture

```
                    User
                      │
                      ▼
          React Dashboard / SDK
                      │
                      ▼
              Express Backend
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 MongoDB          Cloudinary        Redis
      │                                │
      │                                ▼
      │                         BullMQ Queue
      │                                │
      │                                ▼
      │                      FastAPI RAG Service
      │                                │
      │                         Qdrant Vector DB
      │                                │
      └────────────────────────────────┘
                      │
                      ▼
                  Groq LLM
```

---

# 🧠 How It Works

### 1. User Creates Bot

↓

Stores chatbot configuration in MongoDB

↓

Behavior

↓

Appearance

↓

Runtime

↓

Deployment Settings

---

### 2. User Uploads Documents

↓

Cloudinary

↓

BullMQ Queue

↓

FastAPI

↓

Extract Text

↓

Chunking

↓

Embeddings

↓

Qdrant

---

### 3. User Sends Message

↓

Load Bot

↓

Retrieve Chat History

↓

Retrieve Context from Qdrant

↓

Build Prompt

↓

Groq LLM

↓

Generate Response

↓

Store Conversation

↓

Return Response

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- TanStack Router
- TanStack Query
- Redux Toolkit
- Redux Persist
- Radix UI
- Shadcn UI

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Zod
- JWT
- Bcrypt
- Cookie Parser
- Helmet
- Morgan

---

## AI & RAG

- FastAPI
- Groq LLM
- FastEmbed
- Qdrant
- PyPDF
- Python DOCX
- BeautifulSoup
- Pandas

---

## Queue & Infrastructure

- BullMQ
- Redis / Upstash Redis
- Cloudinary
- Docker
- Docker Compose

---

# 📂 Project Structure

```
Nexus-AI
│
├── frontend/
│   ├── src/
│   ├── routes/
│   ├── features/
│   ├── components/
│   ├── shared/
│   └── app/
│
├── backend/
│   ├── src/
│   │   ├── app/
│   │   ├── config/
│   │   ├── modules/
│   │   ├── infrastructure/
│   │   ├── providers/
│   │   └── shared/
│
├── rag-service/
│
├── packages/
│   └── react-sdk/
│
├── docker/
│
└── docs/
```

---

# 🔄 Application Flow

```
User
 │
 ▼
Frontend
 │
 ▼
API Request
 │
 ▼
Authentication
 │
 ▼
Validation
 │
 ▼
Controller
 │
 ▼
Service
 │
 ▼
Repository
 │
 ▼
MongoDB
 │
 ▼
RAG Service
 │
 ▼
Groq
 │
 ▼
Response
 │
 ▼
Frontend
```

---

# 🔒 Security

- JWT Authentication
- Refresh Token Rotation
- HttpOnly Cookies
- Password Hashing (bcrypt)
- Owner-based Authorization
- Protected APIs
- API Rate Limiting
- Zod Validation
- Secure Environment Variables
- Helmet Security Headers
- Encrypted API Keys (BYOK)

---

# ⚡ Performance Optimizations

- React Query Caching
- Redux Persist
- Async Background Processing
- BullMQ Workers
- Vector Search
- Chunk-based Retrieval
- Modular Architecture
- Repository Pattern
- Service Layer
- Provider Abstraction

---

# 📚 Major Modules

## Authentication

- Login
- Signup
- Google OAuth
- JWT
- Refresh Tokens

---

## Bot Management

- Create Bot
- Edit Bot
- Deploy Bot
- Public Sharing
- Runtime Configuration

---

## Knowledge Base

- Upload Documents
- Processing Status
- Chunking
- Embeddings
- Retrieval

---

## Runtime

- Hosted Runtime
- Bring Your Own API Key (BYOK)
- Usage Monitoring

---

## Public SDK

- React SDK
- Public Chat API
- Widget Mode
- Embedded Mode
- Fullscreen Mode

---

# 💡 Design Principles

- Modular Architecture
- Domain-Driven Design (DDD)
- Repository Pattern
- Service Layer Pattern
- Provider Abstraction
- Separation of Concerns
- Clean Architecture Principles
- Scalable AI Infrastructure

---

# 🌟 Highlights

- Production-style SaaS Architecture
- Multi-Tenant Chatbot Platform
- Retrieval-Augmented Generation (RAG)
- Asynchronous Document Processing
- Dynamic Prompt Engineering
- Runtime Provider Abstraction
- AI Knowledge Base
- Developer SDK
- Secure Authentication
- Cloud-Native Infrastructure

---

# 🚀 Future Enhancements

- Multi-LLM Support (OpenAI, Anthropic, Gemini)
- Voice Conversations
- OCR-based Document Processing
- Hybrid Search
- Reranking Pipeline
- Multi-language Support
- Analytics Dashboard
- Team Collaboration
- Billing & Subscription Plans
- Plugin Marketplace
- Webhooks
- API Management

---

# 👨‍💻 Author

**Jeet Goyal**

- B.Tech, Electrical Engineering, MANIT Bhopal
- MERN Stack Developer
- AI & Full-Stack Enthusiast

GitHub: https://github.com/jeetgoyal80

LinkedIn: https://www.linkedin.com/in/jeet-goyal-95bb21285

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

**Built with ❤️ using React, Node.js, FastAPI, MongoDB, Qdrant, Groq, and modern AI infrastructure.**

</div>
