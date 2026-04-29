export interface DataPoint {
  [key: string]: any;
}

export interface FairnessMetrics {
  disparateImpact: number;
  demographicParity: number;
  equalizedOdds: number;
  calibrationError: number;
  individualFairness: number;
  biasScore: number;
}

export interface SensitiveAttributeStats {
  name: string;
  groups: {
    [value: string]: {
      count: number;
      positiveOutcomeCount: number;
      selectionRate: number;
    };
  };
}

export interface MitigationResult {
  before: FairnessMetrics;
  after: FairnessMetrics;
  improvement: number;
}
