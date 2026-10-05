export type HunterRank = 'Mizunoto' | 'Mizunoe' | 'Kanoto' | 'Kanoe' | 'Tsuchinoto' | 'Tsuchinoe' | 'Hinoto' | 'Hinoe' | 'Kinoto' | 'Kinoe' | 'Hashira';
export type HunterStatus = 'Active' | 'In Recovery' | 'Deceased' | 'Retired';
export type ThreatLevel = 'Normal' | 'Lower Moon' | 'Upper Moon' | 'Muzan';
export type MissionStatus = 'Pending' | 'Ongoing' | 'Completed' | 'Failed';
export type InjurySeverity = 'Light' | 'Severe' | 'Critical';

export interface Hunter {
  id: string;
  name: string;
  rank: HunterRank;
  breathing_style: string | null;
  status: HunterStatus;
  joined_date: string;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  location: string;
  threat_level: ThreatLevel;
  status: MissionStatus;
  reward_multiplier: number;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  hunter_id: string;
  injury_severity: InjurySeverity;
  admission_date: string;
  estimated_recovery_days: number;
  cleared_date: string | null;
}

export interface Payroll {
  id: string;
  hunter_id: string;
  month_year: string;
  base_salary: number;
  hazard_pay_bonus: number;
  deductions: number;
}
