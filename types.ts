
export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  UNKNOWN = 'UNKNOWN'
}

export interface IngredientInfo {
  name: string;
  category: string;
  riskLevel: RiskLevel;
  harm: string;
  evidence: string;
  pregnancySafe: 'SAFE' | 'CAUTION' | 'AVOID';
  tags: string[];
}

export interface AnalysisResult {
  overallScore: number;
  ingredients: IngredientInfo[];
  summary: string;
  concerns: {
    endocrine: number;
    pregnancy: number;
    skin: number;
    pcos: number;
  };
}

export type FilterType = 'pregnancy' | 'pcos' | 'acne' | 'sensitive';
