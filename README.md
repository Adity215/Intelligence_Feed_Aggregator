# 🛡️ AI-Powered Threat Intelligence Feed Aggregator v2.0

A production-ready, enterprise-grade cybersecurity platform that collects threat intelligence feeds from multiple sources, extracts Indicators of Compromise (IOCs), and provides AI-powered analysis, trend detection, and threat prediction.

## ✨ New Features in v2.0

### 🎨 **Modern React Frontend**
- **TypeScript & React 18**: Modern, type-safe frontend development
- **Tailwind CSS**: Beautiful, responsive glassmorphism design
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Efficient data fetching and caching
- **Zustand**: Lightweight state management
- **Real-time Updates**: WebSocket integration for live data

### 🔒 **Production-Ready Backend**
- **Authentication & Authorization**: JWT-based user management
- **Database Integration**: MongoDB with Mongoose ODM
- **Caching Layer**: Redis for performance optimization
- **Security Features**: Helmet, rate limiting, input validation
- **Monitoring & Logging**: Winston logging, health checks
- **API Documentation**: Swagger/OpenAPI integration

### 🚀 **Enterprise Features**
- **Docker Deployment**: Complete containerized solution
- **Monitoring Stack**: Prometheus + Grafana integration
- **Backup System**: Automated database backups
- **Email Notifications**: Configurable alert system
- **Advanced Analytics**: Trend analysis and threat prediction
- **Multi-tenant Support**: Role-based access control

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Node.js API   │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         │              │   (Cache)       │              │
         │              └─────────────────┘              │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Prometheus    │    │   Grafana       │
│   (Proxy)       │    │   (Monitoring)  │    │   (Dashboard)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB (or use Docker)
- Redis (or use Docker)

### Option 1: Docker Deployment (Recommended)

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd Intelligence_Feed_Aggregator
   cp backend/env.example backend/.env
   # Edit .env with your configuration
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs
   - Grafana: http://localhost:3001 (admin/admin)

### Option 2: Local Development

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB and Redis (or use Docker)
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   docker run -d -p 6379:6379 --name redis redis:7.2-alpine
   ```

## 📊 Dashboard Features

### **Real-time Monitoring**
- Live threat feed updates
- IOC extraction and analysis
- Threat severity assessment
- Real-time notifications

### **Advanced Analytics**
- Threat trend analysis
- Geographic threat mapping
- Source attribution tracking
- Predictive threat modeling

### **AI-Powered Insights**
- Automated threat summaries
- Trend identification
- Risk scoring algorithms
- Threat prediction models

### **Enterprise Management**
- User role management
- Custom feed integration
- Export capabilities
- Audit logging

## 🔧 Configuration

### Environment Variables

Key configuration options in `backend/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/threat-intelligence
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# API Keys
OPENAI_API_KEY=your-openai-api-key
VIRUSTOTAL_API_KEY=your-virustotal-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Adding Custom Threat Sources

Edit `backend/config/threatSources.js`:

```javascript
const customSources = [
  {
    name: 'Your Custom Feed',
    url: 'https://your-feed.com/rss',
    type: 'rss',
    enabled: true,
    priority: 'high'
  }
];
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Threat Intelligence
- `GET /api/feeds` - Get threat feeds
- `GET /api/iocs` - Get IOCs
- `GET /api/analytics/trends` - Get threat trends
- `POST /api/feeds/refresh` - Refresh feeds

### Management
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update settings
- `GET /api/export` - Export data
- `GET /api/health` - Health check

## 🛠️ Development

### Project Structure
```
Intelligence_Feed_Aggregator/
├── frontend/                 # React TypeScript app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # State management
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── backend/                 # Node.js API
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration files
├── monitoring/             # Prometheus & Grafana configs
├── nginx/                  # Reverse proxy configuration
└── docker-compose.yml      # Docker orchestration
```

### Available Scripts

**Root Level:**
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build frontend for production
npm run test             # Run all tests
npm run lint             # Lint all code
```

**Frontend:**
```bash
npm start                # Start development server
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Lint TypeScript
```

**Backend:**
```bash
npm run dev              # Start with nodemon
npm start                # Start production server
npm test                 # Run tests
npm run migrate          # Run database migrations
```

## 🔒 Security Features

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS**: Configured for production
- **Helmet**: Security headers
- **Data Encryption**: Sensitive data encryption
- **Audit Logging**: Complete activity tracking

## 📈 Monitoring & Observability

### Metrics Collection
- Request/response metrics
- Database performance
- Cache hit rates
- Error rates and latency

### Logging
- Structured JSON logging
- Error tracking
- Performance monitoring
- Security event logging

### Health Checks
- Application health
- Database connectivity
- External service status
- Resource utilization

## 🚀 Deployment

### Production Checklist
- [ ] Set secure environment variables
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Configure load balancing
- [ ] Set up logging aggregation

### Cloud Deployment
The application is designed to run on any cloud platform:
- **AWS**: ECS, EKS, or EC2
- **Azure**: AKS or App Service
- **GCP**: GKE or Compute Engine
- **DigitalOcean**: App Platform or Droplets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@threatintel.com

---

**⚠️ Disclaimer**: This tool is for educational and research purposes. Always verify threat intelligence data before taking action. The authors are not responsible for any decisions made based on this tool's output.
