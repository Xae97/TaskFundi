export type UserRole = 'client' | 'fundi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  skills?: string;
  rating?: number;
  reviews?: Review[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: {
    amount: number;
    currency: string;
    unit: 'hour' | 'project' | 'day';
  };
  providerId: string;
  isRemote: boolean;
  images?: string[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  serviceId: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  createdAt: Date;
  scheduledFor?: Date;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  budget: {
    amount: number;
    currency: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  category: string;
  clientId: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed';
  createdAt: Date;
  requiredSkills: string[];
}