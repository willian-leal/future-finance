export type TransactionType = 'INCOME' | 'EXPENSE' | 'Income' | 'Expense';
export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'Daily' | 'Weekly' | 'Monthly';

export interface AccountDto {
  id: string;
  name: string;
  initialBalance: number;
}

export interface TransactionDto {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  category: string;
  accountId: string;
}

export interface RecurringDto {
  id: string;
  name: string;
  type: TransactionType;
  amount: number;
  frequency: RecurringFrequency;
  nextRunDate: string;
  endDate?: string;
  category: string;
  accountId: string;
}

export interface GoalDto {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  priority: number;
}

export interface ForecastPointDto {
  date: string;
  balance: number;
}

export interface ForecastMetrics {
  minBalance: number;
  negativeDays: number;
  finalBalance: number;
}

export interface GoalImpact {
  goalId: string;
  goalName: string;
  estimatedHitDate?: string | null;
  isHitInRange: boolean;
}

export interface ForecastResponse {
  timeline: ForecastPointDto[];
  metrics: ForecastMetrics;
  goals: GoalImpact[];
}

export interface SimulateRequest {
  amount: number;
  date: string;
  type: TransactionType;
  accountId?: string;
  description?: string;
}

export interface SimulateImpactResponse {
  baselineMetrics: ForecastMetrics;
  simulatedMetrics: ForecastMetrics;
  minBalanceDelta: number;
  enteredNegativeAfterSimulation: boolean;
  goalsAfterSimulation: GoalImpact[];
}
