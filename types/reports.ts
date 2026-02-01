/**
 * MODULE RAPPORTS UNIVERSALISÉ - Types TypeScript
 */

export type FileType = 
  | 'pdf' 
  | 'excel' 
  | 'csv' 
  | 'word' 
  | 'powerpoint' 
  | 'json' 
  | 'image' 
  | 'text';

export type ReportStatus = 'processing' | 'ready' | 'error';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface ReportInsight {
  title: string;
  description: string;
  priority: Priority;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  title: string;
  data: any; // Format Chart.js
  config?: any;
}

export interface ReportSection {
  title: string;
  content: string;
  order: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: Priority;
  actionable: boolean;
}

export interface Risk {
  title: string;
  description: string;
  severity: Severity;
  mitigation?: string;
}

export interface Decision {
  title: string;
  description: string;
  impact: string;
  options?: string[];
}

export interface ReportMetadata {
  author?: string;
  created_date?: string;
  modified_date?: string;
  tags?: string[];
  source?: string;
  [key: string]: any;
}

export interface Report {
  id: string;
  organization_id: string;
  project_id?: string;
  
  // Fichier
  file_name: string;
  file_type: FileType;
  file_size: number;
  file_url: string;
  
  // Contenu
  processed_content?: any;
  summary?: string;
  insights?: ReportInsight[];
  charts?: ChartData[];
  sections?: ReportSection[];
  recommendations?: Recommendation[];
  risks?: Risk[];
  decisions?: Decision[];
  
  // Métadonnées
  metadata?: ReportMetadata;
  version: number;
  parent_report_id?: string;
  
  // Status
  status: ReportStatus;
  error_message?: string;
  
  // Audit
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ReportUploadRequest {
  project_id?: string;
  file: File;
  metadata?: ReportMetadata;
}

export interface ReportAnalysisResult {
  summary: string;
  insights: ReportInsight[];
  charts?: ChartData[];
  sections?: ReportSection[];
  recommendations?: Recommendation[];
  risks?: Risk[];
  decisions?: Decision[];
}

export interface ParsedFileContent {
  text?: string;
  tables?: any[][];
  images?: string[];
  sections?: ReportSection[];
  metadata?: ReportMetadata;
  structure?: any;
}
