# Question Tool - Demo Versions

This project supports two different versions:

## 1. Full Version (Normal + Demo Mode)
This is the complete application with both normal mode and demo mode functionality.

### Running the Full Version
```bash
# Development server
npm run start:all

# Or just the frontend
cd client
npm start
```

### Building the Full Version
```bash
cd client
npm run build
```

## 2. Demo-Only Version
This version contains only the demo mode functionality, perfect for showcasing the application without exposing the full admin features.

### Running the Demo-Only Version
```bash
cd client
npm run start:demo
```

### Building the Demo-Only Version
```bash
cd client
npm run build:demo
```

## Key Differences

### Full Version Features:
- ✅ Normal character management (create, edit, delete characters)
- ✅ Normal question management (create, edit, delete questions)
- ✅ Admin panel for full control
- ✅ Demo mode with session management
- ✅ Complete API integration

### Demo-Only Version Features:
- ✅ Demo mode only (session-based)
- ✅ Character management within demo sessions
- ✅ Question answering within demo sessions
- ✅ Automatic session cleanup (30 minutes)
- ✅ No admin access
- ✅ Cleaner, focused interface

## Deployment

### Full Version Deployment
The full version builds to `dist/question-tool/` and includes all functionality.

### Demo-Only Version Deployment
The demo-only version builds to `dist/question-tool-demo/` and is optimized for public demonstration.

## Configuration

Both versions use the same backend API, but the demo-only version:
- Only accesses demo-specific endpoints
- Has a simplified header and navigation
- Includes demo-specific disclaimers
- Automatically redirects to demo mode

## Use Cases

### Full Version
- Internal development and testing
- Production deployment with full admin access
- Complete feature demonstration

### Demo-Only Version
- Public demonstrations
- Client presentations
- Marketing websites
- Trial versions
- Educational purposes

## File Structure

```
client/src/
├── app/
│   ├── app.component.ts              # Full version app component
│   ├── app-demo-only.component.ts    # Demo-only app component
│   ├── app.routes.ts                 # Full version routes
│   ├── app-demo-only.routes.ts       # Demo-only routes
│   └── ...
├── main.ts                           # Full version entry point
├── main-demo-only.ts                 # Demo-only entry point
├── index.html                        # Full version HTML
└── index-demo-only.html              # Demo-only HTML
```
