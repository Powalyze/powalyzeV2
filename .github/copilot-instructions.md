# Powalyze AI Agent Instructions

## Project Overview

**Powalyze** is an executive cockpit platform for portfolio governance with integrated AI narrative generation. Built with Next.js 14 (App Router), TypeScript, Supabase, and OpenAI/Azure OpenAI.

**Key characteristic**: Dual-mode architecture (DEMO/PROD) that works immediately without configuration but scales to production environments.

## Architecture & Core Concepts

### Dual-Mode System (CRITICAL)
The platform operates in two distinct modes controlled by environment variables:

**DEMO Mode** (default):
- Uses fixed data from `lib/cockpitData.ts` (`getDemoData()`, `getEmptyData()`)
- No database required, no API keys needed
- Displays blue "Mode Démo" badge in UI
- Entry points: `/cockpit-real`, `/cockpit-demo`, `/cockpit-client`

**PROD Mode**:
- Connects to Supabase for real data via `lib/supabase.ts` and `lib/supabase-cockpit.ts`
- Requires OpenAI/Azure OpenAI for AI narrative generation
- Entry points: `/cockpit-client-supabase`, `/pro`
- Toggle: Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### Multi-Tenant Architecture
- Middleware (`middleware.ts`) extracts tenant context from JWT tokens
- All API routes check `x-tenant-id` and `x-user-id` headers
- Database schema (`database/schema.sql`) uses `organization_id` for tenant isolation
- Public routes exempted in middleware (auth, test endpoints)

### AI System Components
Three distinct AI engines with separate prompts and responsibilities:

1. **Chief of Staff Actions** (`lib/ai-chief-actions.ts`):
   - Generates strategic actions based on portfolio analysis
   - Input: Projects + Risks → Output: 6 prioritized actions
   - Each action includes: title, impact (quantified), priority, category, confidence score

2. **Project Predictor** (`lib/ai-project-predictor.ts`):
   - Predicts project completion probability, budget risks, velocity
   - Called via `/api/ai/predict` endpoint

3. **Committee Prep** (`/committee-prep`):
   - Generates executive briefs, COMEX documents, meeting agendas
   - Pulls from all cockpit data sources

## Key Development Patterns

### File Organization
```
app/
  ├── api/              # API routes (auth, cockpit, projects, risks, etc.)
  ├── cockpit*/         # Multiple cockpit variants (demo, client, real)
  ├── committee-prep/   # AI document generation
  └── powerbi/          # Power BI embed integration

lib/
  ├── cockpitData.ts    # DEMO mode data providers
  ├── supabase*.ts      # PROD mode Supabase clients
  ├── ai*.ts            # AI prompt engineering & OpenAI calls
  ├── auth.ts           # JWT authentication (bcrypt + jsonwebtoken)
  └── clientCodes.ts    # Pre-defined client access codes

components/
  ├── cockpit/          # Dashboard UI components
  ├── vitrine/          # Marketing/showcase pages
  └── ui/               # Reusable UI primitives

database/
  ├── schema.sql        # Full PostgreSQL schema
  └── seed*.sql         # Demo data seeds
```

### TypeScript Conventions
- Strict mode enabled (`tsconfig.json`)
- Core types in `types/index.ts`: `Project`, `Risk`, `Resource`, `Decision`, etc.
- All entities include: `id`, `tenant_id`/`organization_id`, `created_at`, `updated_at`
- Use `rag_status: 'GREEN' | 'YELLOW' | 'RED'` for project health

### Authentication Flow
1. User submits credentials to `/api/auth/login` or client code to `/api/auth/validate-client`
2. Server validates and returns JWT token via `generateToken()` from `lib/auth.ts`
3. Client stores token, includes in `Authorization: Bearer <token>` header
4. Middleware validates token and injects `x-tenant-id`, `x-user-id` headers
5. API routes read tenant context from headers

### Data Access Patterns
**DEMO Mode**:
```typescript
import { getDemoData, getEmptyData } from '@/lib/cockpitData';
const data = getDemoData(); // Fixed showcase data
```

**PROD Mode**:
```typescript
import { supabase, supabaseAdmin } from '@/lib/supabase';
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('organization_id', tenantId);
```

## Development Workflows

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
```

**Default URLs**:
- Demo cockpit: `http://localhost:3000/cockpit-real`
- Committee prep: `http://localhost:3000/committee-prep`
- AI test interface: `http://localhost:3000/ai-test`

### Environment Configuration
Create `.env.local` for PROD mode (optional for DEMO):
```env
# Supabase (PROD mode only)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# OpenAI (PROD mode only)
OPENAI_API_KEY=sk-xxx
# OR Azure OpenAI:
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Auth
JWT_SECRET=change-in-production

# Power BI (optional)
POWERBI_CLIENT_ID=xxx
POWERBI_CLIENT_SECRET=xxx
POWERBI_TENANT_ID=xxx
POWERBI_WORKSPACE_ID=xxx
```

### Deployment (Vercel)
```bash
npx vercel --prod --yes    # Deploy to production
```
- Build task available: "Deploy to Vercel Production"
- Config: `vercel.json` (framework detection, rewrites)
- Environment variables must be set in Vercel dashboard

### Database Migrations
```bash
# Apply schema
psql $DATABASE_URL -f database/schema.sql

# Seed demo data
psql $DATABASE_URL -f database/seed-demo-data.sql
```

## Common Tasks

### Adding a New API Endpoint
1. Create file in `app/api/<endpoint>/route.ts`
2. Check if public route → Add to `middleware.ts` `publicRoutes` array
3. Extract tenant context from headers:
   ```typescript
   const tenantId = request.headers.get('x-tenant-id');
   const userId = request.headers.get('x-user-id');
   ```
4. Query with tenant isolation: `.eq('organization_id', tenantId)`

### Creating a New Dashboard Page
1. Create `app/<page-name>/page.tsx`
2. Import mode-specific data:
   - DEMO: `import { getDemoData } from '@/lib/cockpitData'`
   - PROD: `import { supabase } from '@/lib/supabase'`
3. Use existing components from `components/cockpit/`
4. Add navigation item in `lib/navigation.ts` if needed

### Modifying AI Prompts
All AI system prompts are centralized:
- Chief of Staff: `lib/ai-chief-actions.ts` → `AI_CHIEF_ACTIONS_PROMPT`
- Project Predictor: `lib/ai-project-predictor.ts` → `PROJECT_PREDICTOR_SYSTEM_PROMPT`
- Committee Prep: Inline in `/committee-prep/page.tsx`

**Pattern**: System prompt defines rules, input format, output schema (JSON)

### Adding Client Codes (DEMO)
Edit `lib/clientCodes.ts`:
```typescript
export const CLIENT_CODES: Record<string, ClientConfig> = {
  'CLIENT-NEWCO': {
    code: 'CLIENT-NEWCO',
    name: 'NewCo Inc',
    description: 'Enterprise client',
    tier: 'PRO',
    logo: '/logos/newco.png'
  }
};
```

## Performance Considerations

- **Interaction to Next Paint (INP)**: Target <200ms (previously had 15s issue)
- Use `loading.tsx` for route-level loading states
- Debounce AI calls (Chief of Staff, predictors)
- Power BI embeds: Lazy load iframes, use `powerbi-client-react`
- Toast notifications: Max 30 concurrent (auto-dismiss after 3s)

## Testing & Debugging

### AI Testing Interface
Navigate to `/ai-test` to validate AI functions:
- Test Chief of Staff action generation
- Test project predictions
- Test committee document generation
- View raw prompts and responses

### Common Issues
1. **"Mode Démo" badge won't disappear**: Check `NEXT_PUBLIC_SUPABASE_URL` is set
2. **401 Unauthorized**: Token expired (24h lifetime) or missing `Authorization` header
3. **Tenant data leakage**: Always filter by `organization_id` in queries
4. **AI not responding**: Verify `OPENAI_API_KEY` or Azure credentials in `.env.local`

## External Integrations

- **Power BI**: Uses `powerbi-client-react` for embed, requires Azure AD app registration
- **Supabase**: PostgreSQL + Row Level Security (RLS) for tenant isolation
- **OpenAI/Azure OpenAI**: GPT-4 for narrative generation, structured outputs with Zod schemas

## Documentation References

- Full setup: `README.md`
- DEMO→PROD migration: `MIGRATION_GUIDE.md`
- New client setup: `GUIDE-NOUVEAU-CLIENT.md`
- Performance optimizations: `PERFORMANCE_OPTIMIZATIONS.md`
- Database schema: `database/schema.sql`
