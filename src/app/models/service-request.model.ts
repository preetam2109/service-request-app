export interface ServiceRequest {
    id?: number; // Optional for creation, required for update/read
    title: string;
    description: string;
    createdDate?: Date; // Optional, set by backend
    status: string; // e.g., 'Open', 'In Progress', 'Closed'
    createdBy: string;
  }