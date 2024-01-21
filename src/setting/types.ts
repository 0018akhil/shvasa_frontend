interface AgentState {
    name: string;
    email: string;
    phone: string;
    description: string;
  }
  
interface Errors {
    name?: string;
    email?: string;
    phone?: string;
    description?: string;
}
  
interface Ticket {
  topic: string;
  description: string;
  severity: string;
  type: string;
}

interface TicketErrors {
  topic?: string;
  description?: string;
  dateCreated?: string;
  severity?: string;
  type?: string;
  assignedTo?: string;
  status?: string;
  resolvedOn?: string;
}

interface Filters {
  type?: string;
  severity?: string;
  assignedTo?: string;
  status?: string;
}