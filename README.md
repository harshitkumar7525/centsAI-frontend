# CentsAI Finance Hub - Frontend

A modern, AI-powered personal finance tracking application built with React, TypeScript, and Vite. Track your expenses intelligently with natural language input and beautiful visualizations.

## 🎯 Features

- **AI-Powered Input**: Add expenses using natural language (e.g., "spent ₹50 on lunch")
- **Manual Entry**: Traditional form-based transaction entry
- **Visual Analytics**: Beautiful charts and spending insights
- **Category Breakdown**: Automatic expense categorization
- **Transaction Management**: Edit and delete transactions with ease
- **Daily Transaction View**: Transactions grouped by day with daily totals
- **Period Filtering**: View expenses by 7, 15, 30 days, or all time
- **Spending Trends**: Track spending patterns over time
- **Top Category Insights**: Identify your highest spending categories
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Secure Authentication**: JWT-based user authentication with auto-expiration
- **Currency Support**: Indian Rupee (₹) display throughout the app

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui (Radix UI)
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Routing**: React Router
- **Notifications**: Sonner (Toast)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or bun)
- Backend API running (see [CentsAI API](https://github.com/harshitkumar7525/CentsAI-API))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshitkumar7525/centsai-finance-hub.git
   cd centsai-finance-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```
   
   For production deployment:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.com/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   # or
   bun build
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/           # Dashboard-specific components
│   │   ├── AddTransactionDialog.tsx
│   │   ├── AIInput.tsx
│   │   ├── CategoryBreakdown.tsx
│   │   ├── ExpenseChart.tsx
│   │   ├── Header.tsx
│   │   ├── SpendingInsights.tsx
│   │   ├── TransactionList.tsx
│   │   └── ...
│   ├── Landing/             # Landing page components
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   └── Navbar.tsx
│   └── ui/                  # Reusable UI components (shadcn-ui)
├── lib/
│   ├── api.ts              # API client and type definitions
│   ├── categories.ts       # Expense categories configuration
│   └── utils.ts            # Utility functions
├── pages/
│   ├── Dashboard.tsx       # Main dashboard page
│   ├── Index.tsx           # Landing page
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Registration page
│   └── NotFound.tsx        # 404 page
└── hooks/                  # Custom React hooks
```

## 🔌 API Integration

The frontend integrates with the CentsAI Backend API. See the [API Documentation](https://github.com/harshitkumar7525/CentsAI-API) for complete details.

### Key Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/register` | POST | Register new user |
| `/users/login` | POST | Authenticate user |
| `/users/{userId}/transactions` | GET | Get all transactions |
| `/users/{userId}/transaction` | POST | Add manual transaction |
| `/users/ai/{userId}/transaction` | POST | Add AI-parsed transaction |
| `/users/{userId}/transaction/{id}` | PATCH | Update transaction |
| `/users/{userId}/transaction/{id}` | DELETE | Delete transaction |

### Authentication

All API requests (except register/login) require a JWT token in the Authorization header:

```typescript
Authorization: Bearer {token}
```

Tokens are automatically:
- Stored in localStorage upon successful login/registration
- Included in all authenticated API requests
- Validated for expiration on application load
- Cleared automatically when expired or on logout

### Token Management

The application includes automatic token expiration handling:
- JWT tokens are decoded to check expiration time
- Expired tokens are automatically cleared from localStorage
- Users are redirected to login when tokens expire
- No manual token refresh needed

## 💾 Local Storage

The application stores the following data in localStorage:

- `token`: JWT authentication token (auto-validated for expiration)
- `userId`: Current user's ID
- `username`: Current user's username

**Note**: All localStorage data is automatically cleared on logout or when tokens expire.

## 🎨 Customization

### Expense Categories

Categories are defined in `src/lib/categories.ts`. To add or modify categories:

```typescript
export const categoryList = [
  "Food",
  "Transportation",
  "Entertainment",
  "Groceries",
  "Shopping",
  "Utilities",
  "Health",
  "Other"
];
```

### Theme Colors

Tailwind configuration is in `tailwind.config.ts`. Modify colors, fonts, and other design tokens there.

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

- ESLint configured for code quality and best practices
- TypeScript strict mode enabled for type safety
- Component-based architecture following React best practices
- Consistent naming conventions (PascalCase for components, camelCase for functions)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Options

**Vercel** (Recommended):
```bash
vercel deploy
```

**Netlify**:
```bash
netlify deploy --prod
```

**Other Platforms**: Upload the `dist/` folder to any static hosting service.

### Environment Variables

Make sure to set `VITE_API_BASE_URL` in your deployment platform's environment variables.

## 🔒 Security

- **Password Security**: Passwords are never stored locally, only sent to backend for authentication
- **Token Expiration**: JWT tokens expire after 7 days (configurable in backend)
- **Auto-Logout**: Expired tokens are automatically detected and cleared
- **HTTPS**: All API requests use HTTPS in production environments
- **Data Isolation**: User data is isolated per account with authorization checks
- **XSS Protection**: React's built-in XSS protection with proper escaping
- **CORS**: Backend implements CORS policies for secure cross-origin requests

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Harshit Kumar**
- GitHub: [@harshitkumar7525](https://github.com/harshitkumar7525)

## 🔗 Related Repositories

- **Backend API**: [CentsAI-API](https://github.com/harshitkumar7525/CentsAI-API)
- **AI Microservice**: [CentsAI Gemini Microservice](https://github.com/harshitkumar7525/centsai-gemini-microservice)

## 📧 Support

For issues, questions, or feature requests:
- Open an issue on [GitHub Issues](https://github.com/harshitkumar7525/centsai-finance-hub/issues)
- Email: harshitkumarhk1290@gmail.com

---

**Live Demo**: [https://cents-ai.vercel.app](https://cents-ai.vercel.app)

**Backend Repository**: [CentsAI-API](https://github.com/harshitkumar7525/CentsAI-API)

**Last Updated**: December 5, 2025
**Version**: 1.0.0
