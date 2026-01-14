export interface QuantumAnalysis {
  project_id: string;
  success_probability: number;
  quantum_states: Array<{
    scenario: string;
    probability: number;
    impact: number;
    timeline_variance: number;
  }>;
  entanglement_risks: Array<{
    project_a: string;
    project_b: string;
    correlation: number;
    cascading_risk: number;
  }>;
  superposition_outcomes: Array<{
    outcome: string;
    probability: number;
    roi: number;
    strategic_value: number;
  }>;
}

export interface DigitalTwin {
  project_id: string;
  real_time_state: {
    health_score: number;
    velocity: number;
    burn_rate: number;
    team_sentiment: number;
    code_quality: number;
    deployment_frequency: number;
  };
  predictive_model: {
    completion_date_forecast: string;
    budget_at_completion: number;
    quality_score_forecast: number;
    team_attrition_risk: number;
  };
  simulation_scenarios: Array<{
    name: string;
    changes: string[];
    impact: {
      time_delta: number;
      cost_delta: number;
      quality_delta: number;
      risk_delta: number;
    };
  }>;
  autonomous_recommendations: Array<{
    action: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    impact_score: number;
    confidence: number;
    auto_executable: boolean;
  }>;
  real_time_alerts: Array<{
    type: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    triggered_at: string;
  }>;
}

export interface NLPAnalysis {
  sentiment_analysis: {
    overall_score: number;
    sentiment: 'VERY_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'VERY_NEGATIVE';
    emotional_indicators: {
      confidence: number;
      stress: number;
      motivation: number;
      satisfaction: number;
    };
    key_themes: Array<{
      theme: string;
      frequency: number;
      sentiment: number;
    }>;
  };
  communication_patterns: {
    meeting_frequency: number;
    response_time_avg: number;
    collaboration_score: number;
    conflict_indicators: number;
  };
  stakeholder_engagement: Array<{
    stakeholder: string;
    engagement_level: number;
    sentiment_trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    communication_quality: number;
  }>;
  risk_signals: Array<{
    signal: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    source: string;
    detected_at: string;
  }>;
  recommendations: string[];
}

export interface AutoHealingResult {
  healing_session_id: string;
  triggered_at: string;
  issues_detected: Array<{
    issue_id: string;
    type: 'RISK' | 'DELAY' | 'BUDGET' | 'QUALITY' | 'TEAM';
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    description: string;
  }>;
  healing_actions: Array<{
    action_id: string;
    action_type: string;
    description: string;
    execution_status: 'EXECUTED' | 'SCHEDULED' | 'APPROVAL_REQUIRED';
    impact_estimate: {
      time_saved: number;
      cost_saved: number;
      risk_reduction: number;
    };
    executed_at?: string;
  }>;
  autonomous_decisions: Array<{
    decision: string;
    rationale: string;
    confidence: number;
    reversible: boolean;
  }>;
  human_escalations: Array<{
    issue: string;
    reason: string;
    recommended_action: string;
    urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM';
  }>;
}

export interface PortfolioOptimization {
  current_portfolio: {
    total_projects: number;
    total_budget: number;
    expected_roi: number;
    risk_score: number;
  };
  optimization_recommendations: Array<{
    action: 'CONTINUE' | 'ACCELERATE' | 'PAUSE' | 'CANCEL' | 'PIVOT';
    project_id: string;
    project_name: string;
    rationale: string;
    impact: {
      roi_change: number;
      risk_change: number;
      budget_freed: number;
      strategic_value: number;
    };
    confidence: number;
  }>;
  optimized_portfolio: {
    total_projects: number;
    total_budget: number;
    expected_roi: number;
    risk_score: number;
    improvement: number;
  };
  resource_reallocation: Array<{
    from_project: string;
    to_project: string;
    resource_count: number;
    justification: string;
  }>;
}

export interface BlockchainAudit {
  transaction_hash: string;
  block_number: number;
  timestamp: string;
  action: string;
  actor: string;
  entity_type: string;
  entity_id: string;
  previous_state: any;
  new_state: any;
  immutable: boolean;
  verified: boolean;
}

export interface VoiceCommand {
  transcript: string;
  confidence: number;
  intent: string;
  entities: Record<string, any>;
  action: {
    type: string;
    params: Record<string, any>;
  };
  response: string;
}
