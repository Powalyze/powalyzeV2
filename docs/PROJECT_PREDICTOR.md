# ProjectPredictor - Documentation Technique

## Vue d'ensemble

ProjectPredictor est le moteur d'IA prédictive de Powalyze, basé sur Claude AI, qui analyse les projets pour générer :
- **Risques probables** avec probabilité, impact et mitigation
- **Opportunités** avec impact et bénéfices
- **Actions recommandées** avec type, priorité, horizon et effet attendu
- **Résumé exécutif** et niveau de confiance

---

## Architecture

```
┌─────────────────┐
│ CockpitRoot     │
│ (Frontend)      │
└────────┬────────┘
         │ analyzeProject()
         ↓
┌─────────────────┐
│ API Route       │
│ /api/ai/        │
│ project-        │
│ prediction      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ ai-project-     │
│ predictor.ts    │
│ (AI Engine)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Claude AI       │
│ (OpenAI API)    │
└─────────────────┘
```

---

## Contrats de données

### 1. Input: Powalyze → IA

```typescript
interface ProjectInput {
  project_id: string;
  name: string;
  owner_role: string;
  budget: number | null;
  deadline: string | null;
  status: string;
  complexity: "low" | "medium" | "high";
  team_size: number | null;
  dependencies: string[];
  context: string;
  objectives: string[];
}
```

**Exemple:**
```json
{
  "project_id": "uuid-123",
  "name": "Migration ERP vers Cloud",
  "owner_role": "DSI",
  "budget": 450000,
  "deadline": "2025-03-31",
  "status": "planned",
  "complexity": "high",
  "team_size": 7,
  "dependencies": ["Système legacy", "Fournisseur externe"],
  "context": "Migration d'un ERP on-premise vers cloud",
  "objectives": [
    "Réduire coûts infrastructure de 20%",
    "Améliorer disponibilité à 99.9%"
  ]
}
```

### 2. Output: IA → Powalyze

```typescript
interface ProjectPrediction {
  project_id: string;
  risks: ProjectRisk[];
  opportunities: ProjectOpportunity[];
  recommended_actions: RecommendedAction[];
  summary: string;
  confidence: number; // 0-1
}
```

**Exemple de réponse:**
```json
{
  "project_id": "uuid-123",
  "risks": [
    {
      "label": "Dépendance au fournisseur ERP",
      "probability": 0.7,
      "impact": "fort",
      "mitigation": "Négocier clauses de réversibilité"
    }
  ],
  "opportunities": [
    {
      "label": "Standardisation des processus",
      "impact": "moyen",
      "benefit": "Réduction des erreurs"
    }
  ],
  "recommended_actions": [
    {
      "label": "Sécuriser le planning avec le fournisseur",
      "type": "gouvernance",
      "priority": "haute",
      "horizon": "4 semaines",
      "expected_effect": "Réduction risque de dérive"
    }
  ],
  "summary": "Projet à fort enjeu de dépendance fournisseur",
  "confidence": 0.82
}
```

---

## Fichiers créés

### 1. `types/project-prediction.ts`
Types TypeScript pour les contrats d'entrée/sortie.

### 2. `lib/ai-project-predictor.ts`
- **Prompt système** ProjectPredictor
- **Fonction principale:** `analyzeProjectWithAI()`
- **Utilitaires:** formatage, parsing, graceful degradation
- **Mock fallback** si API OpenAI non disponible

### 3. `app/api/ai/project-prediction/route.ts`
- **POST** `/api/ai/project-prediction` - Analyse un projet
- **GET** `/api/ai/project-prediction` - Documentation de l'API
- Validation des inputs
- Gestion d'erreurs

### 4. `components/cockpit/CockpitRoot.tsx` (modifié)
- State `projectPredictions` pour stocker les prédictions
- State `analyzingProject` pour l'UI de chargement
- Fonction `analyzeProject()` pour déclencher l'analyse
- Intégration avec l'UI existante

---

## Utilisation

### Frontend (dans un composant)

```typescript
// Analyser un projet
await analyzeProject(project);

// Récupérer la prédiction
const prediction = projectPredictions.get(project.id);

// Afficher les risques
prediction?.risks.map(risk => (
  <div>
    <h4>{risk.label}</h4>
    <p>Probabilité: {risk.probability * 100}%</p>
    <p>Impact: {risk.impact}</p>
    <p>Mitigation: {risk.mitigation}</p>
  </div>
))
```

### API directe (curl)

```bash
curl -X POST https://www.powalyze.com/api/ai/project-prediction \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "uuid",
    "name": "Migration ERP",
    "owner_role": "DSI",
    "budget": 450000,
    "status": "planned",
    "complexity": "high",
    "team_size": 7,
    "dependencies": [],
    "context": "Migration vers cloud",
    "objectives": ["Réduire coûts"]
  }'
```

---

## Configuration

### Variables d'environnement

```bash
# .env.local
OPENAI_API_KEY=sk-...
```

**⚠️ Sans API key:**
- Le système fonctionne en mode graceful degradation
- Retourne une prédiction mock indiquant que l'IA n'est pas configurée
- Pas de crash, juste un message informatif

---

## Prompt système (extrait)

```
Tu es le moteur prédictif de Powalyze, appelé "ProjectPredictor".

CONTRAINTES
- Tu ne dois JAMAIS inventer de données d'entrée
- Tu te bases UNIQUEMENT sur le JSON fourni
- Tu renvoies UNIQUEMENT du JSON, pas de texte libre
- Maximum: 5 risques, 5 opportunités, 7 actions

RÈGLES
- Projet peu décrit → peu de prédictions, confiance faible
- Projet bien décrit → analyse détaillée, confiance haute
- Rester concret, opérationnel, orienté décision
```

---

## Déclenchement automatique (recommandé)

### Option 1: Supabase Edge Function
```sql
CREATE OR REPLACE FUNCTION trigger_project_analysis()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    'https://www.powalyze.com/api/ai/project-prediction',
    jsonb_build_object('project_id', NEW.id, 'name', NEW.name, ...)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_insert_or_update
  AFTER INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_project_analysis();
```

### Option 2: Frontend auto-trigger
```typescript
// Dans le formulaire de création/modification de projet
const handleSubmit = async () => {
  const savedProject = await saveProject(formData);
  await analyzeProject(savedProject); // Analyse automatique
};
```

---

## Tests

### Test l'API
```bash
npm run build
# Puis tester avec curl ou Postman
```

### Mock mode (sans API key)
```typescript
// Retourne automatiquement une prédiction mock
const prediction = await analyzeProjectWithAI(projectInput);
// prediction.confidence === 0
// prediction.summary === "Analyse prédictive non disponible..."
```

---

## Limites actuelles

1. **Pas de stockage persistant** des prédictions (in-memory Map)
2. **Pas de trigger automatique** Supabase (à implémenter)
3. **Format CockpitProject** simplifié (à enrichir selon besoins)
4. **Pas de cache** des prédictions (analyse à chaque fois)

## Prochaines étapes recommandées

1. ✅ **Créer table `project_predictions` dans Supabase**
2. ✅ **Implémenter trigger automatique** sur INSERT/UPDATE projects
3. ✅ **Afficher les prédictions** dans l'UI du cockpit
4. ✅ **Ajouter cache** pour éviter re-analyses inutiles
5. ✅ **Enrichir ProjectInput** avec plus de contexte métier

---

## Support

- Types: `types/project-prediction.ts`
- AI Engine: `lib/ai-project-predictor.ts`
- API: `app/api/ai/project-prediction/route.ts`
- Frontend: `components/cockpit/CockpitRoot.tsx`
