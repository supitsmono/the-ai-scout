# AI Scout - Project Context

**Laatste update:** $(date)

## 🎯 Project Status

### ✅ Wat werkt
- **Dashboard:** Alle views werken (Home, Applications, Chats, Analytics placeholder)
- **Backend:** FastAPI draait op poort 8000
- **Frontend:** Next.js draait op poort 3000
- **Database:** SQLite met models, chats, messages
- **Unified Workspace:** Drie-panel layout met WorkspaceContext

### ⚙️ Belangrijke Configuratie

#### 1. Authentication/Fraud Prevention: **UITGESCHAKELD**
- `backend/app/main.py`: `AUTH_AVAILABLE = False`
- Auth router wordt niet geladen om crashes te voorkomen
- Fraud prevention systeem bestaat maar is optioneel

#### 2. SSR Fixes Toegepast
- `WorkspaceContext.tsx`: `useSearchParams` NIET in `useState` initializer
- URL params worden gelezen in `useEffect` (client-side only)
- `typeof window !== 'undefined'` checks toegevoegd

#### 3. Analytics Component Verwijderd
- `Analytics.tsx` verwijderd (veroorzaakte crashes)
- Analytics view toont nu placeholder: "Analytics coming soon..."
- Recharts dependency niet geïnstalleerd

## 📁 Belangrijke Bestanden

### Frontend
- `frontend/app/dashboard/context/WorkspaceContext.tsx` - State management
- `frontend/app/dashboard/components/CenterPanel.tsx` - Main content renderer
- `frontend/app/dashboard/components/LeftPanel.tsx` - Model/chat lists
- `frontend/app/dashboard/components/ChatInterface.tsx` - Chat UI
- `frontend/app/dashboard/components/DashboardHome.tsx` - Home dashboard
- `frontend/app/dashboard/ModelDetailPanel.tsx` - Model detail view
- `frontend/app/chats/[chatId]/components/ModelProfilePanel.tsx` - Chat profile panel

### Backend
- `backend/app/main.py` - FastAPI app config (AUTH_AVAILABLE = False)
- `backend/app/routes/models.py` - Model endpoints
- `backend/app/routes/chats.py` - Chat endpoints
- `backend/app/routes/status.py` - Status/contact endpoints
- `backend/app/routes/pipeline.py` - Pipeline endpoints
- `backend/app/routes/ai.py` - AI classification endpoints

## 🚀 Server Starten

```bash
# Backend
cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend  
cd frontend && npm run dev
```

## 🗄️ Database Seeding

```bash
cd backend && python seed_db.py --force
```

## ✅ Pending Tasks

- [ ] Analytics backend endpoints (frontend placeholder bestaat)
- [ ] Bulk actions (selecteren, archiveren, exporteren)
- [ ] Advanced filtering (age range, height, country)
- [ ] Real AI classification (nu mock)
- [ ] Photo upload functionaliteit
- [ ] Real-time updates (WebSockets)

## 🐛 Bekende Issues (OPGELOST)

- ✅ SSR errors met `useSearchParams` - **OPGELOST**
- ✅ Analytics component crashes - **VERWIJDERD**
- ✅ Dashboard white screen - **OPGELOST**
- ✅ Internal server errors - **OPGELOST**

## 📝 Recente Wijzigingen

### Laatste Fixes
1. **SSR Compatibility:** `WorkspaceContext.tsx` aangepast om SSR errors te voorkomen
2. **Analytics Removed:** Component verwijderd die crashes veroorzaakte
3. **Error Boundaries:** `error.tsx` en `loading.tsx` toegevoegd aan dashboard
4. **Server Restart:** Beide servers opnieuw gestart en werkend

### Belangrijke Architectuur Beslissingen
- **Unified Workspace:** Drie-panel layout (Sidebar, Center, Right Panel)
- **State Management:** WorkspaceContext voor globale state
- **URL Sync:** State gesynchroniseerd met URL parameters
- **Portal Rendering:** Lightboxes en profile panels gebruiken `createPortal` voor z-index issues

## 🔧 Technische Details

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, SQLAlchemy, SQLite (dev)
- **State:** React Context API
- **Routing:** Next.js App Router met URL parameters

### API Endpoints
- `GET /models/` - List models (met pagination, filtering, sorting)
- `GET /models/{id}` - Get single model
- `DELETE /models/{id}` - Delete model
- `GET /chats/` - List chats
- `GET /chats/{id}` - Get chat with messages
- `POST /chats/{id}/send-message` - Send message
- `POST /models/{id}/contact` - Contact model (creates chat)
- `GET /pipeline/stats` - Pipeline statistics

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## 💡 Tips voor Nieuwe Chat

1. **Lees dit bestand eerst** om context te krijgen
2. **Check server status** - beide servers moeten draaien
3. **Test eerst** of alles werkt voordat je wijzigingen maakt
4. **SSR Issues:** Let op `useSearchParams` - gebruik altijd in `useEffect`, niet in `useState` initializer
5. **Error Handling:** Check altijd terminal output voor errors

## 📌 Quick Reference

- **Dashboard URL:** http://localhost:3000/dashboard
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Company Name:** AI Scout
- **Logo Component:** `frontend/components/logo.tsx`

---

**Note:** Dit bestand wordt automatisch bijgewerkt bij belangrijke wijzigingen. Open dit bestand in een nieuwe chat voor volledige context.

