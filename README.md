# 🏥 Medical AI Assistant with RAG & Geospatial Intelligence

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An intelligent medical AI assistant powered by **Retrieval-Augmented Generation (RAG)** and **Context-Aware Generation (CAG)** that provides instant first aid guidance, medical information, and connects users with nearby healthcare professionals in Tunisia. Combines conversational AI with real-time geospatial mapping to deliver contextual medical assistance when you need it most.

---

## ✨ Features

### 🧠 AI-Powered Medical Intelligence
- 🤖 **RAG-Enhanced Conversational AI** - Context-aware medical assistant that retrieves relevant medical knowledge to answer your health questions
- 🆘 **First Aid Guidance** - Instant emergency response instructions and step-by-step medical procedures
- 💊 **Medical Information Retrieval** - Evidence-based health information, symptom analysis, and treatment recommendations
- 🔍 **Context-Aware Generation (CAG)** - Personalized responses based on your location, symptoms, and medical history

### 🗺️ Geospatial Intelligence
- 📍 **Smart Doctor Discovery** - AI-powered recommendations for nearby healthcare professionals based on your needs
- 🗺️ **Interactive Medical Map** - Real-time visualization of 4,320+ doctors across 24 governorates in Tunisia
- 📊 **Analytics Dashboard** - Comprehensive insights into specialty distribution and regional healthcare density
- 🎯 **Specialty Filtering** - Search across 48 medical specialties with intelligent matching

### 💡 User Experience
- 💬 **Natural Language Interface** - Chat naturally about your medical concerns in plain language
- 📱 **Responsive Design** - Seamless experience on desktop, tablet, and mobile devices
- ⚡ **Real-Time Streaming** - Instant AI responses with streaming text generation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ghassenSW/medical-ai-assistant.git
cd medical-ai-assistant

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
medical-ai-assistant/
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, SplitScreenLayout
│   │   └── ui/              # Button, Card, Input (reusable components)
│   ├── features/
│   │   ├── chat/            # ChatWindow, ChatInput, MessageBubble, useChatStream
│   │   ├── map/             # MapView with Leaflet integration
│   │   └── dashboard/       # SpecialtyChart, DensityHeatmap
│   ├── lib/
│   │   ├── types.ts         # TypeScript interfaces (Doctor, Message, etc.)
│   │   ├── mockData.ts      # Sample data for development
│   │   └── utils.ts         # Utility functions
│   ├── store/
│   │   └── useAppStore.ts   # Zustand state management
│   ├── pages/
│   │   ├── Home.tsx         # Main chat + map interface
│   │   └── Dashboard.tsx    # Analytics and insights
│   ├── App.tsx              # Main application router
│   └── main.tsx             # Application entry point
├── data/
│   └── cleaned_doctor_profiles_info2.csv  # 4,320 doctor records
├── notebooks/
│   └── visualisation.ipynb  # Data analysis and visualization
└── public/                  # Static assets
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18.3.1, TypeScript 5.2.2 |
| **Build Tool** | Vite 5.4.21 |
| **Styling** | Tailwind CSS 3.4 |
| **State Management** | Zustand 4.5.7 |
| **Routing** | React Router DOM 6.30.2 |
| **Maps** | Leaflet 1.9.4, React-Leaflet 4.2.1 |
| **Charts** | Recharts 2.15.4 |
| **Icons** | Lucide React 0.469.0 |
| **AI/RAG** | Ready for integration (OpenAI, Gemini, Claude, LangChain) |

---

## 🎯 Usage

### 🆘 Emergency & First Aid
- **Ask Medical Questions**: "What should I do for a severe burn?" or "How to perform CPR?"
- **Get Instant Guidance**: Receive step-by-step first aid instructions powered by RAG
- **Emergency Contact**: Automatically find nearest emergency services and specialists

### 💬 Conversational Medical Assistant
- **Symptom Analysis**: "I have a headache and fever, what could it be?"
- **Treatment Information**: "What are the side effects of aspirin?"
- **Healthcare Navigation**: "Find me a dentist nearby" or "I need a cardiologist in Tunis"
- **Medical Advice**: Context-aware responses based on retrieved medical knowledge

### 🗺️ Geospatial Features
- **View AI Recommendations on Map**: Suggested doctors appear as markers with detailed profiles
- **Interactive Exploration**: Click markers to view specialty, address, phone, and location
- **Location-Based Search**: Automatic proximity-based doctor recommendations

### 📊 Healthcare Analytics Dashboard
- **Specialty Distribution**: Visualize the 48+ medical specialties across Tunisia
- **Regional Healthcare Density**: Understand doctor availability by governorate
- **Data-Driven Insights**: Make informed healthcare decisions with comprehensive statistics

---

## 📊 Data Overview

- **4,320** verified doctor profiles
- **48** medical specialties covered
- **24** governorates across Tunisia
- **Fields**: Name, Specialty, Address, Phone, GPS Coordinates, Governorate

### Top Specialties
1. Dentist (450 doctors)
2. Gynécologie (320 doctors)
3. Dermatologie (280 doctors)
4. Pédiatrie (265 doctors)
5. Ophtalmologie (240 doctors)

### Regional Distribution
- Tunis: 1,250 doctors (29%)
- Ariana: 680 doctors (16%)
- Sfax: 520 doctors (12%)
- Sousse: 380 doctors (9%)

---

## 🛠️ Development

### 🧩 Core Architecture

**RAG Pipeline** (Ready for Integration):
- **Retrieval Layer**: Vector database for medical knowledge base (embeddings + similarity search)
- **Generation Layer**: LLM integration for context-aware responses
- **Medical Knowledge Base**: First aid protocols, medical guidelines, treatment information

**Key Components**:
- **`useChatStream`**: Custom hook for AI streaming responses (ready for RAG/CAG integration)
- **`useAppStore`**: Zustand store managing conversation context, user location, and medical history
- **`MapView`**: Leaflet-based geospatial interface with real-time doctor visualization
- **`ChatWindow`**: Conversational UI with message history, streaming, and context retention
- **Analytics Components**: `SpecialtyChart` & `DensityHeatmap` for healthcare data visualization

### 🔌 Integrating RAG/CAG Backend

To connect your RAG-powered medical AI:

```typescript
// src/features/chat/useChatStream.ts
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    context: {
      location: userLocation,
      medicalHistory: conversationHistory,
      urgency: isEmergency
    }
  })
});

const reader = response.body?.getReader();
// Stream AI responses with medical knowledge retrieval
```

**Backend Integration Checklist**:
1. ✅ Vector database for medical knowledge (Pinecone, Weaviate, ChromaDB)
2. ✅ LLM API (OpenAI GPT-4, Google Gemini, Claude, or open-source models)
3. ✅ Medical knowledge corpus (first aid guides, clinical protocols, medical databases)
4. ✅ Embedding model for semantic search (OpenAI embeddings, Cohere, sentence-transformers)
5. ✅ Context-aware prompt engineering for medical safety and accuracy
6. ✅ Real-time doctor database connection for geospatial recommendations

---

## 🎨 Customization

### Modify Theme Colors

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',  // Change to your brand color
          600: '#2563eb',
        }
      }
    }
  }
}
```

### Add New Medical Specialties

```typescript
// src/lib/mockData.ts
export const SPECIALTY_STATS = [
  { specialty: 'Your Specialty', count: 100 },
  // ... add more
];
```

---

## 🗺️ Roadmap

### Phase 1: Core Foundation ✅
- [x] AI chat interface with streaming responses
- [x] Interactive geospatial map with 4,320+ doctors
- [x] Analytics dashboard with healthcare insights
- [x] Responsive UI with modern design system

### Phase 2: RAG/CAG Integration 🚧
- [ ] **RAG Pipeline**: Vector database + embedding model for medical knowledge retrieval
- [ ] **LLM Integration**: Connect GPT-4, Gemini, or Claude for conversational AI
- [ ] **Medical Knowledge Base**: Load first aid protocols, clinical guidelines, treatment databases
- [ ] **Context-Aware Generation**: User location, symptoms, medical history for personalized responses
- [ ] **Safety Filters**: Medical accuracy validation and emergency response detection

### Phase 3: Enhanced Intelligence 🔮
- [ ] **Symptom Checker**: AI-powered differential diagnosis suggestions
- [ ] **Drug Interaction Analysis**: Medication safety and contraindication warnings
- [ ] **Medical Image Analysis**: Integrate vision models for skin conditions, X-rays
- [ ] **Multi-language Support**: Arabic, French, English with medical terminology
- [ ] **Voice Interface**: Speech-to-text for hands-free emergency guidance

### Phase 4: Healthcare Ecosystem 🏥
- [ ] **User Authentication**: Secure medical history and personalized recommendations
- [ ] **Appointment Booking**: Direct integration with doctor schedules
- [ ] **Telemedicine**: Video consultations with recommended doctors
- [ ] **Electronic Health Records (EHR)**: Secure storage and retrieval
- [ ] **Doctor Reviews & Ratings**: Community-driven healthcare quality insights

### Phase 5: Production & Scale 📱
- [ ] **Backend Infrastructure**: Scalable API with caching and rate limiting
- [ ] **Real-time Updates**: WebSocket for live doctor availability
- [ ] **Progressive Web App (PWA)**: Offline-first with service workers
- [ ] **Mobile Apps**: React Native for iOS/Android
- [ ] **Deployment**: Production-ready on AWS/GCP with monitoring
- [ ] **Compliance**: HIPAA/GDPR compliance for medical data privacy

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ghassen**
- GitHub: [@ghassenSW](https://github.com/ghassenSW)

---

## 🙏 Acknowledgments

- Medical data sourced from Tunisia healthcare directory
- Built with modern React ecosystem and best practices
- Inspired by the need for accessible healthcare information

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/ghassenSW/medical-ai-assistant/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**⚠️ Medical Disclaimer**: This application is designed to provide general medical information and facilitate connections with healthcare professionals. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition. In case of emergency, call your local emergency services immediately.
