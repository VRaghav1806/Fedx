import { ICase } from '../models/Case';

export const predictRecovery = (caseData: ICase): number => {
    // Simple heuristic prediction
    let score = 0.5;

    // High amount reduces probability (harder to collect)
    if (caseData.amount > 50000) score -= 0.1;
    else if (caseData.amount < 5000) score += 0.1;

    // Priority impact
    if (caseData.priority === 'critical') score += 0.2;
    else if (caseData.priority === 'low') score -= 0.1;

    // Status impact
    if (caseData.status === 'collected') score = 1.0;
    else if (caseData.status === 'escalated') score -= 0.2;

    return Math.min(Math.max(score, 0), 1);
};
