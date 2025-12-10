export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  MANAGER = 'MANAGER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  deliveryWindow: string; // e.g., "08:00-12:00"
  demand: number; // kg of fish
}

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  capacity: number; // kg
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE';
}

export interface RoutePoint {
  id: string;
  customerId?: string; // If null, it might be a depot or waypoint
  sequence: number;
  coordinates: Coordinates;
  estimatedArrival: string;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
}

export interface DeliveryRoute {
  id: string;
  name: string;
  vehicleId: string;
  driverName: string;
  totalDistance: number; // km
  totalDuration: number; // minutes
  points: RoutePoint[];
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  createdAt: string;
}
