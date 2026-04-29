import { DataPoint, FairnessMetrics, SensitiveAttributeStats } from "../types";

export function calculateFairnessMetrics(
  data: DataPoint[],
  sensitiveAttr: string,
  targetAttr: string,
  privilegedValue: any
): { metrics: FairnessMetrics; stats: SensitiveAttributeStats } {
  const groups: { [key: string]: { count: number; positiveOutcome: number } } = {};

  data.forEach((row) => {
    const val = row[sensitiveAttr];
    if (!groups[val]) {
      groups[val] = { count: 0, positiveOutcome: 0 };
    }
    groups[val].count++;
    if (row[targetAttr] === 1 || row[targetAttr] === true || String(row[targetAttr]).toLowerCase() === "yes") {
      groups[val].positiveOutcome++;
    }
  });

  const stats: SensitiveAttributeStats = {
    name: sensitiveAttr,
    groups: {}
  };

  Object.entries(groups).forEach(([val, data]) => {
    stats.groups[val] = {
      count: data.count,
      positiveOutcomeCount: data.positiveOutcome,
      selectionRate: data.count > 0 ? data.positiveOutcome / data.count : 0
    };
  });

  const privilegedRate = stats.groups[privilegedValue]?.selectionRate || 0;
  
  // Calculate Disparate Impact and Demographic Parity
  let maxDP = 0;
  let minDI = 1;

  Object.entries(stats.groups).forEach(([val, groupStats]) => {
    if (val === String(privilegedValue)) return;
    
    const dp = Math.abs(privilegedRate - groupStats.selectionRate);
    if (dp > maxDP) maxDP = dp;

    if (privilegedRate > 0) {
      const di = groupStats.selectionRate / privilegedRate;
      if (di < minDI) minDI = di;
    }
  });

  // Mocking some metrics for the demo that are harder to calculate without true ML preds
  // In a real system, we'd need model probs/labels
  const metrics: FairnessMetrics = {
    disparateImpact: parseFloat(minDI.toFixed(3)),
    demographicParity: parseFloat(maxDP.toFixed(3)),
    equalizedOdds: parseFloat((maxDP * 0.85).toFixed(3)), // Simulation
    calibrationError: 0.04,
    individualFairness: 0.92,
    biasScore: Math.min(100, Math.max(0, Math.round((maxDP + (1 - minDI)) * 50)))
  };

  return { metrics, stats };
}

export function applyMitigation(
  data: DataPoint[],
  metrics: FairnessMetrics,
  method: 'reweighting' | 'oversampling' | 'threshold'
): FairnessMetrics {
  // Simulating improvements based on the method
  const improvementFactor = method === 'reweighting' ? 0.3 : method === 'oversampling' ? 0.4 : 0.25;
  
  return {
    ...metrics,
    disparateImpact: Math.min(1, metrics.disparateImpact + (1 - metrics.disparateImpact) * improvementFactor),
    demographicParity: metrics.demographicParity * (1 - improvementFactor),
    biasScore: Math.max(0, metrics.biasScore * (1 - improvementFactor * 1.5))
  };
}

export const SAMPLE_DATA: DataPoint[] = [
  { id: 1, gender: "Male", experience: 5, score: 85, selected: 1 },
  { id: 2, gender: "Female", experience: 6, score: 90, selected: 0 },
  { id: 3, gender: "Male", experience: 3, score: 70, selected: 1 },
  { id: 4, gender: "Female", experience: 10, score: 95, selected: 1 },
  { id: 5, gender: "Male", experience: 8, score: 88, selected: 1 },
  { id: 6, gender: "Female", experience: 4, score: 75, selected: 0 },
  { id: 7, gender: "Male", experience: 12, score: 92, selected: 1 },
  { id: 8, gender: "Female", experience: 2, score: 65, selected: 0 },
  { id: 9, gender: "Male", experience: 1, score: 60, selected: 0 },
  { id: 10, gender: "Female", experience: 7, score: 82, selected: 0 },
  { id: 11, gender: "Male", experience: 9, score: 89, selected: 1 },
  { id: 12, gender: "Female", experience: 5, score: 80, selected: 0 },
  { id: 13, gender: "Male", experience: 6, score: 84, selected: 1 },
  { id: 14, gender: "Female", experience: 8, score: 91, selected: 0 },
  { id: 15, gender: "Male", experience: 4, score: 72, selected: 1 },
];
