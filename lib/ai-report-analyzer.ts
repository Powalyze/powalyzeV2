/**
 * MODULE RAPPORTS - Analyseur IA et générateur de rapport
 */

import OpenAI from 'openai';
import type {
  ParsedFileContent,
  ReportAnalysisResult,
  ReportInsight,
  Recommendation,
  Risk,
  Decision,
  ChartData
} from '@/types/reports';

// Initialiser OpenAI
const openai =
  process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
        baseURL: process.env.AZURE_OPENAI_ENDPOINT
          ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`
          : undefined,
        defaultQuery: process.env.AZURE_OPENAI_ENDPOINT
          ? { 'api-version': '2024-02-15-preview' }
          : undefined,
        defaultHeaders: process.env.AZURE_OPENAI_ENDPOINT
          ? { 'api-key': process.env.AZURE_OPENAI_API_KEY }
          : undefined,
      })
    : null;

/**
 * Prompt système pour l'analyse de rapport
 */
const REPORT_ANALYSIS_PROMPT = `Tu es un analyste expert en transformation de documents en rapports structurés et actionnables.

Ton rôle est d'analyser le contenu d'un document et de générer :
1. Un résumé exécutif concis (3-5 phrases)
2. 3-5 insights clés avec priorités
3. Des recommandations actionnables
4. Des risques potentiels identifiés
5. Des décisions possibles

Format de réponse JSON strict :
{
  "summary": "Résumé exécutif...",
  "insights": [
    {"title": "Titre", "description": "Description", "priority": "high|medium|low"}
  ],
  "recommendations": [
    {"title": "Titre", "description": "Description", "priority": "high|medium|low", "actionable": true}
  ],
  "risks": [
    {"title": "Titre", "description": "Description", "severity": "critical|high|medium|low", "mitigation": "Mitigation"}
  ],
  "decisions": [
    {"title": "Titre", "description": "Description", "impact": "Impact description", "options": ["Option 1", "Option 2"]}
  ]
}

Sois concis, factuel et actionnable.`;

/**
 * Analyser le contenu avec IA
 */
export async function analyzeContentWithAI(
  content: ParsedFileContent,
  fileName: string
): Promise<ReportAnalysisResult> {
  if (!openai) {
    console.warn('OpenAI not configured, returning mock analysis');
    return generateMockAnalysis(fileName);
  }

  try {
    const contentText = buildContentText(content);

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4',
      messages: [
        { role: 'system', content: REPORT_ANALYSIS_PROMPT },
        {
          role: 'user',
          content: `Analyse ce document et génère un rapport structuré.\n\nFichier: ${fileName}\n\nContenu:\n${contentText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from AI');
    }

    const analysis = JSON.parse(result);
    return analysis;
  } catch (error) {
    console.error('Error analyzing with AI:', error);
    return generateMockAnalysis(fileName);
  }
}

/**
 * Construire le texte de contenu pour l'IA
 */
function buildContentText(content: ParsedFileContent): string {
  const parts: string[] = [];

  if (content.text) {
    parts.push(`Texte:\n${content.text.slice(0, 5000)}`);
  }

  if (content.tables && content.tables.length > 0) {
    parts.push(`\nTableaux: ${content.tables.length} table(s) détectée(s)`);
    // Limiter à 3 premières tables
    content.tables.slice(0, 3).forEach((table, i) => {
      parts.push(`\nTable ${i + 1}:\n${JSON.stringify(table.slice(0, 5))}`);
    });
  }

  if (content.metadata) {
    parts.push(`\nMétadonnées:\n${JSON.stringify(content.metadata, null, 2)}`);
  }

  return parts.join('\n');
}

/**
 * Générer une analyse mock (fallback)
 */
function generateMockAnalysis(fileName: string): ReportAnalysisResult {
  return {
    summary: `Analyse du document "${fileName}". Ce rapport contient des informations importantes nécessitant une attention particulière. Les données présentées montrent des tendances significatives qui devraient guider les décisions stratégiques.`,
    insights: [
      {
        title: 'Tendance principale identifiée',
        description: 'Les données révèlent une tendance majeure qui impacte les objectifs du projet.',
        priority: 'high',
      },
      {
        title: 'Points d\'attention',
        description: 'Plusieurs éléments nécessitent un suivi rapproché pour assurer le succès.',
        priority: 'medium',
      },
      {
        title: 'Opportunités détectées',
        description: 'Des opportunités d\'optimisation ont été identifiées dans le document.',
        priority: 'medium',
      },
    ],
    recommendations: [
      {
        title: 'Action prioritaire',
        description: 'Mettre en place un plan d\'action basé sur les données présentées.',
        priority: 'high',
        actionable: true,
      },
      {
        title: 'Suivi régulier',
        description: 'Établir un calendrier de suivi pour les indicateurs clés.',
        priority: 'medium',
        actionable: true,
      },
    ],
    risks: [
      {
        title: 'Risque potentiel identifié',
        description: 'Un risque a été détecté dans les données analysées.',
        severity: 'medium',
        mitigation: 'Mettre en place des mesures de contrôle préventives.',
      },
    ],
    decisions: [
      {
        title: 'Décision stratégique requise',
        description: 'Une décision doit être prise concernant la direction à prendre.',
        impact: 'Impact significatif sur le projet et les objectifs.',
        options: ['Option A: Approche progressive', 'Option B: Mise en œuvre rapide'],
      },
    ],
  };
}

/**
 * Générer des graphiques automatiques depuis des données tabulaires
 */
export function generateChartsFromTables(tables?: any[][]): ChartData[] {
  if (!tables || tables.length === 0) {
    return [];
  }

  const charts: ChartData[] = [];

  // Pour chaque table, tenter de générer un graphique
  tables.slice(0, 3).forEach((table, index) => {
    if (table.length < 2) return; // Besoin d'au moins headers + 1 ligne

    const headers = table[0];
    const rows = table.slice(1);

    // Essayer de détecter des colonnes numériques
    const numericColumns: number[] = [];
    headers.forEach((header: any, colIndex: number) => {
      const isNumeric = rows.every(row => {
        const value = row[colIndex];
        return !isNaN(parseFloat(value));
      });
      if (isNumeric) numericColumns.push(colIndex);
    });

    if (numericColumns.length > 0 && rows.length > 0) {
      // Générer un graphique en barres
      const labels = rows.map(row => row[0] || `Row ${rows.indexOf(row) + 1}`);
      const datasets = numericColumns.map(colIndex => ({
        label: headers[colIndex],
        data: rows.map(row => parseFloat(row[colIndex]) || 0),
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`,
      }));

      charts.push({
        type: 'bar',
        title: `Tableau ${index + 1}: ${headers[0] || 'Données'}`,
        data: {
          labels,
          datasets,
        },
      });
    }
  });

  return charts;
}

/**
 * Pipeline complète d'analyse
 */
export async function analyzeReport(
  content: ParsedFileContent,
  fileName: string
): Promise<ReportAnalysisResult> {
  // Analyse IA
  const aiAnalysis = await analyzeContentWithAI(content, fileName);

  // Génération de graphiques
  const charts = generateChartsFromTables(content.tables);

  // Extraction de sections si disponible
  const sections = content.sections || [];

  return {
    ...aiAnalysis,
    charts: charts.length > 0 ? charts : undefined,
    sections: sections.length > 0 ? sections : undefined,
  };
}
