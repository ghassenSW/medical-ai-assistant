# Medical AI Geospatial Assistant

A modern React application for finding and visualizing medical professionals across Tunisia using AI-powered chat and interactive maps.

![Medical AI Assistant](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.21-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- 🤖 **AI Chat Assistant**: Interactive chat interface with streaming responses to help find doctors
- 🗺️ **Interactive Map**: Leaflet-based geospatial visualization of doctor locations across Tunisia
- 📊 **Analytics Dashboard**: Comprehensive data visualization with charts showing:
  - Top medical specialties distribution
  - Doctor density by governorate
  - Real-time statistics
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- ⚡ **Fast & Performant**: Built with Vite for lightning-fast development and production builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/ghassenSW/medical-ai-assistant.git
cd medical-ai-assistant
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
medical-ai-assistant/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Button, Card, Input)
│   │   └── layout/          # Layout components (Navbar, SplitScreenLayout)
│   ├── features/
│   │   ├── chat/            # Chat interface with streaming simulation
│   │   ├── map/             # Leaflet map integration
│   │   └── dashboard/       # Analytics and charts
│   ├── lib/                 # Utilities, types, and mock data
│   ├── store/               # Zustand state management
│   ├── pages/               # Route pages (Home, Dashboard)
│   └── App.tsx              # Main app component
├── data/                    # Medical data (CSV files)
├── notebooks/               # Jupyter notebooks for data analysis
├── public/                  # Static assets
└── package.json
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Build Tool** | Vite 5.4 |
| **Language** | TypeScript 5.2 |
| **Framework** | React 18.3 |
| **Styling** | Tailwind CSS 3.4 |
| **Icons** | Lucide React |
| **State Management** | Zustand 4.5 |
| **Maps** | React-Leaflet 4.2 + Leaflet 1.9 |
| **Charts** | Recharts 2.15 |
| **Routing** | React Router DOM 6.30 |

## 💡 Usage

### Home Page (Chat + Map)

1. Start a conversation with the AI assistant
2. Ask about doctors: *"Find me a dentist in Tunis"*
3. Watch the streaming response (simulated typing effect)
4. See recommended doctors appear on the map
5. Click markers for detailed doctor information

### Dashboard Page

View comprehensive analytics:
- **Total doctors**: 4,320 across Tunisia
- **Medical specialties**: 48 different fields
- **Geographic coverage**: 24 governorates
- Visual charts showing distribution and density

## 📊 Data

The application uses real medical data from Tunisia including:
- **4,320+ doctor profiles** with specialties
- Geographic coordinates for accurate mapping
- Contact information and addresses
- Regional distribution across all governorates

**Data Location**: `/data/cleaned_doctor_profiles_info2.csv`

See the [Data README](./data/README.md) for detailed information about the dataset.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Components

#### Chat Stream Hook (`src/features/chat/useChatStream.ts`)
Simulates AI streaming responses with realistic typing effect:
- 20ms character delay for natural conversation feel
- Automatically triggers doctor recommendations after response
- Manages streaming state through Zustand store

```typescript
const { sendMessage, streamingMessage } = useChatStream();

// Sends message and simulates streaming AI response
await sendMessage("Find me a dentist in Tunis");
```

#### Map View (`src/features/map/MapView.tsx`)
Interactive Leaflet map with doctor markers:
- Custom OpenStreetMap markers for each doctor
- Popup details showing name, specialty, address, phone
- Centered on Tunis, Tunisia (36.8°N, 10.2°E)
- Fully responsive and mobile-friendly

#### Zustand Store (`src/store/useAppStore.ts`)
Centralized application state:
```typescript
{
  userLocation: { lat: 36.8065, lng: 10.1815 },  // Default: Tunis
  recommendedDoctors: Doctor[],                  // Array of doctor objects
  selectedDoctor: Doctor | null,                 // Currently selected
  messages: Message[],                           // Chat history
  isStreaming: boolean                           // Streaming status
}
```

## 🎨 Customization

### Adding Real Doctors

Edit `src/lib/mockData.ts` to add more doctors:

```typescript
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '7',
    name: 'Dr. Your Name',
    specialty: 'Cardiologist',
    lat: 36.8065,
    lng: 10.1815,
    phone: '+216 71 123 456',
    address: '123 Avenue Habib Bourguiba, Tunis',
    governorate: 'Tunis'
  },
  // ... add more
];
```

### Customizing AI Responses

Update streaming messages in `src/features/chat/useChatStream.ts`:

```typescript
const responses = [
  "Your custom message here...",
  "\n\nAnother part of the response...",
];
```

### Styling with Tailwind

The project uses Tailwind CSS with a custom color palette defined in `tailwind.config.js`. Modify the theme to match your brand:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your color scale */ },
    },
  },
}
```

## 🚧 Roadmap

### Phase 1 - Core Features (Completed ✅)
- [x] AI chat interface with streaming
- [x] Interactive map with doctor markers
- [x] Analytics dashboard with charts
- [x] Responsive design
- [x] Mock data integration

### Phase 2 - Backend Integration (Planned)
- [ ] Connect to real AI backend (OpenAI/Gemini)
- [ ] Implement doctor search API
- [ ] Real-time data fetching
- [ ] Database integration

### Phase 3 - Advanced Features (Future)
- [ ] User authentication & profiles
- [ ] Appointment booking system
- [ ] Doctor ratings and reviews
- [ ] Multi-language support (Arabic, French, English)
- [ ] SMS/Email notifications
- [ ] Payment integration

### Phase 4 - Mobile & Expansion
- [ ] React Native mobile app
- [ ] Progressive Web App (PWA)
- [ ] Advanced filtering (specialty, location, availability)
- [ ] Real-time doctor availability status
- [ ] Telemedicine integration

## 📱 Screenshots

### Home Page
Split-screen layout with AI chat assistant and interactive map

### Dashboard
Comprehensive analytics showing medical data visualizations

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

**Ghassen**
- GitHub: [@ghassenSW](https://github.com/ghassenSW)

## 🙏 Acknowledgments

- Medical data sourced from Tunisia healthcare directory
- Map tiles provided by OpenStreetMap contributors
- Icons from Lucide Icons library
- UI/UX inspiration from modern healthcare applications
- Built with React and the amazing open-source community

## 📮 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/ghassenSW/medical-ai-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ghassenSW/medical-ai-assistant/discussions)
- **Email**: Open an issue for contact

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ for better healthcare accessibility in Tunisia**

*Making it easier for patients to find the right medical professional*
