export type Status = 'pending' | 'doing' | 'done';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
}

export interface ColumnType {
  id: Status;
  title: string;
  colorClass: string;
}