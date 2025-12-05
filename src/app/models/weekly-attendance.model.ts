// weekly-attendance.model.ts
export interface WeeklyAttendanceDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointRadius?: number;
}

export interface WeeklyAttendanceData {
  labels: string[];
  datasets: WeeklyAttendanceDataset[];
}
