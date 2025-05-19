export interface ContractClause {
  id: string;
  text: string;
  type: string;
  confidence: number;
  annotations: Annotation[];
  version: string;
  lastModified: Date;
}

export interface Annotation {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  highlightRange: {
    start: number;
    end: number;
  };
}

export interface ContractAnalysis {
  id: string;
  contractId: string;
  extractedTerms: {
    royaltyRates: RoyaltyTerm[];
    territories: string[];
    duration: {
      start: Date;
      end: Date | null;
    };
    specialClauses: ContractClause[];
  };
  confidence: number;
  validationResults: ValidationResult[];
  timestamp: Date;
}

export interface RoyaltyTerm {
  type: string;
  rate: number;
  conditions: string[];
  territory?: string[];
  confidence: number;
}

export interface ValidationResult {
  rule: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ContractVersion {
  id: string;
  contractId: string;
  version: string;
  timestamp: Date;
  changes: ContractChange[];
}

export interface ContractChange {
  type: 'addition' | 'deletion' | 'modification';
  clauseId: string;
  previousText?: string;
  newText?: string;
  timestamp: Date;
} 