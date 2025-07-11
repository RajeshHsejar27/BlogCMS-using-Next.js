# Forest Blog CMS

A beautiful, production-ready blog CMS built with Next.js 14, featuring a forest-themed design that connects nature lovers through storytelling.

## 🌲 Features

### Core Functionality
- **Modern Tech Stack**: Next.js 14 with App Router, React 18, TypeScript, Tailwind CSS
- **Authentication**: Google OAuth integration with NextAuth.js
- **Content Management**: Full CRUD operations for blog posts with admin approval workflow
- **Rich Content**: Markdown support with image handling and reading time calculation
- **Interactive Features**: Heart system, commenting, and real-time engagement
- **Responsive Design**: Mobile-first approach with beautiful forest-themed UI

### User Features
- **Post Creation**: Rich text editor with markdown support, image uploads, and tagging
- **Social Engagement**: Heart posts, comment system, and author profiles
- **Personal Dashboard**: Track your posts, hearts received, and engagement metrics
- **Rate Limiting**: 5 posts per day limit to maintain quality

### Admin Features
- **Content Moderation**: Approve/reject posts with custom feedback
- **User Management**: Monitor user activity and engagement
- **Analytics**: Track post performance and community growth
- **Email Notifications**: Automated approval/rejection emails

### SEO & Performance
- **Server-Side Rendering**: Optimized for search engines and performance
- **Meta Tags**: Dynamic Open Graph and Twitter card generation
- **Sitemap**: Auto-generated sitemap.xml for better indexing
- **Image Optimization**: Next.js Image component with Pexels integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Google OAuth credentials
- SMTP email service (optional)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd forest-blog
npm install
```

2. **Environment Setup**
Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blogcms

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

3. **Get Required Credentials**

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

#### MongoDB Setup:
- **Local**: Install MongoDB locally or use Docker
- **Cloud**: Use MongoDB Atlas (free tier available)

#### Cloudinary Setup:
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your `.env.local` file

#### Email Setup (Optional):
- Use Gmail, SendGrid, or any SMTP provider
- For Gmail: Enable 2FA and use App Password

4. **Run the development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm start
```

## 📁 Project Structure

```
forest-blog/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/
│   │   └── auth/          # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── create/            # Post creation
│   ├── posts/             # Blog post pages
│   ├── profile/           # User profile
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── posts/         # Post CRUD operations
│   │   ├── admin/         # Admin operations
│   │   └── user/          # User operations
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── Navbar.tsx         # Navigation component
│   ├── Hero.tsx           # Hero section
│   ├── PostGrid.tsx       # Post grid display
│   ├── PostActions.tsx    # Heart/comment actions
│   └── CommentSection.tsx # Comments functionality
├── lib/                   # Utility libraries
│   ├── models/            # MongoDB models
│   │   ├── User.ts        # User model
│   │   ├── Post.ts        # Post model
│   │   └── Heart.ts       # Heart model
│   ├── utils/             # Utility functions
│   │   ├── email.ts       # Email notifications
│   │   └── reading-time.ts # Reading time calculation
│   ├── validations/       # Zod schemas
│   │   └── post.ts        # Post validation
│   ├── auth.ts            # NextAuth configuration
│   ├── mongodb.ts         # Database connection
│   └── utils.ts           # General utilities
├── .env.local.example     # Environment variables template
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🔧 Configuration Files

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

module.exports = nextConfig;
```

### tailwind.config.ts
Configured with custom color palette for forest theme, animations, and shadcn/ui integration.

## 🚀 Deployment Guide

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out`
3. Add environment variables in Netlify dashboard

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Railway/Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

## 📊 SEO Optimization

### Implemented Features
- **Dynamic Meta Tags**: Title, description, and Open Graph for each page
- **Structured Data**: JSON-LD schema for blog posts
- **Sitemap Generation**: Auto-generated sitemap.xml
- **Robots.txt**: SEO-friendly crawler instructions
- **Image Optimization**: Cloudinary integration with Next.js Image component
- **Server-Side Rendering**: Fast page loads and SEO-friendly content

### SEO Checklist
- [ ] Verify meta tags are properly generated
- [ ] Test sitemap.xml accessibility
- [ ] Check robots.txt configuration
- [ ] Validate structured data with Google's Rich Results Test
- [ ] Test page load speeds with PageSpeed Insights
- [ ] Verify mobile responsiveness

## 🧪 Testing Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

## 🔐 Security Features

- **Authentication**: Secure Google OAuth integration
- **Input Validation**: Zod schema validation on client and server
- **Rate Limiting**: Post creation limits to prevent spam
- **Content Sanitization**: Markdown content sanitization
- **File Upload Security**: File type and size validation for images
- **CSRF Protection**: NextAuth.js built-in CSRF protection
- **Environment Variables**: Secure credential management

## 🎨 Design System

### Forest Theme Colors
- **Primary**: Amber (600-900) - Warm, earthy tones
- **Secondary**: Green (400-600) - Fresh forest greens
- **Accent**: Red (500) - Hearts and important actions
- **Neutral**: Gray (100-900) - Text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, amber-900
- **Body**: Regular, amber-700
- **Captions**: Small, amber-600

### Components
- **Cards**: Subtle shadows with backdrop blur
- **Buttons**: Rounded, good contrast ratios
- **Forms**: Amber borders with focus states
- **Navigation**: Sticky header with forest gradient

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment tools
- **shadcn/ui** - For beautiful, accessible UI components
- **Cloudinary** - For image storage and optimization
- **Pexels** - For high-quality stock images
- **MongoDB** - For the database solution

---

**Built with ❤️ by the Forest Blog Team**

*Connecting nature lovers through the power of storytelling*