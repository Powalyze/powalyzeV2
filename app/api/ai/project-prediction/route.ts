/**
 * API Route: Project Prediction with Claude AI
 * POST /api/ai/project-prediction
 * 
 * Receives a project input and returns AI-generated predictions
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeProjectWithAI } from "@/lib/ai-project-predictor";
import type { ProjectInput } from "@/types/project-prediction";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const projectInput: ProjectInput = await request.json();

    // Validate required fields
    if (!projectInput.project_id || !projectInput.name) {
      return NextResponse.json(
        { error: "Missing required fields: project_id, name" },
        { status: 400 }
      );
    }

    // Call AI analysis
    const prediction = await analyzeProjectWithAI(projectInput);

    // Return prediction
    return NextResponse.json(prediction, { status: 200 });
  } catch (error) {
    console.error("Error in project prediction API:", error);
    
    // Return error response
    return NextResponse.json(
      {
        error: "Failed to generate project prediction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    name: "ProjectPredictor API",
    version: "1.0.0",
    description: "Claude AI engine for project risk analysis and recommendations",
    endpoints: {
      POST: {
        path: "/api/ai/project-prediction",
        description: "Analyze a project and generate predictions",
        inputContract: {
          project_id: "string (required)",
          name: "string (required)",
          owner_role: "string",
          budget: "number | null",
          deadline: "string | null",
          status: "string",
          complexity: "'low' | 'medium' | 'high'",
          team_size: "number | null",
          dependencies: "string[]",
          context: "string",
          objectives: "string[]",
        },
        outputContract: {
          project_id: "string",
          risks: "ProjectRisk[]",
          opportunities: "ProjectOpportunity[]",
          recommended_actions: "RecommendedAction[]",
          summary: "string",
          confidence: "number (0-1)",
        },
      },
    },
    usage: {
      example: `
curl -X POST /api/ai/project-prediction \\
  -H "Content-Type: application/json" \\
  -d '{
    "project_id": "uuid",
    "name": "Migration ERP vers Cloud",
    "owner_role": "DSI",
    "budget": 450000,
    "deadline": "2025-03-31",
    "status": "planned",
    "complexity": "high",
    "team_size": 7,
    "dependencies": ["Système legacy", "Fournisseur externe"],
    "context": "Migration d'un ERP on-premise vers cloud",
    "objectives": ["Réduire coûts de 20%", "Améliorer disponibilité"]
  }'
      `,
    },
  });
}
