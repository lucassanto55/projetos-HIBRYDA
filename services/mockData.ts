import { Customer, Vehicle, DeliveryRoute } from '../types';

export const MOCK_DEPOT: Customer = {
  id: 'depot',
  name: 'HIBRYDA Central',
  address: 'Porto Principal, Galpão 4',
  coordinates: { lat: -23.9618, lng: -46.3322 }, // Santos, SP example
  priority: 'HIGH',
  deliveryWindow: '06:00-20:00',
  demand: 0
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Restaurante Mar Azul',
    address: 'Av. da Praia, 100',
    coordinates: { lat: -23.965, lng: -46.335 },
    priority: 'HIGH',
    deliveryWindow: '08:00-10:00',
    demand: 50
  },
  {
    id: 'c2',
    name: 'Peixaria do Zé',
    address: 'Rua das Pedras, 45',
    coordinates: { lat: -23.955, lng: -46.340 },
    priority: 'MEDIUM',
    deliveryWindow: '09:00-12:00',
    demand: 120
  },
  {
    id: 'c3',
    name: 'Mercado Central',
    address: 'Praça Central, 1',
    coordinates: { lat: -23.970, lng: -46.320 },
    priority: 'LOW',
    deliveryWindow: '13:00-16:00',
    demand: 200
  },
  {
    id: 'c4',
    name: 'Sushi Bar Elite',
    address: 'Av. Ana Costa, 400',
    coordinates: { lat: -23.960, lng: -46.328 },
    priority: 'HIGH',
    deliveryWindow: '10:00-11:00',
    demand: 30
  }
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', plate: 'ABC-1234', driverName: 'Carlos Silva', capacity: 1000, status: 'AVAILABLE' },
  { id: 'v2', plate: 'XYZ-9876', driverName: 'João Santos', capacity: 800, status: 'IN_TRANSIT' },
];
