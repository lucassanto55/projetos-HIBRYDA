import { Coordinates, Customer, RoutePoint } from '../types';

// Haversine formula to calculate distance between two points in km
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth radius in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Simple heuristic: Nearest Neighbor
const nearestNeighbor = (points: Customer[], startNode: Customer): Customer[] => {
  const unvisited = [...points].filter(p => p.id !== startNode.id);
  const path = [startNode];
  let current = startNode;

  while (unvisited.length > 0) {
    let nearest: Customer | null = null;
    let minDist = Infinity;
    let nearestIndex = -1;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(current.coordinates, unvisited[i].coordinates);
      if (dist < minDist) {
        minDist = dist;
        nearest = unvisited[i];
        nearestIndex = i;
      }
    }

    if (nearest && nearestIndex !== -1) {
      path.push(nearest);
      current = nearest;
      unvisited.splice(nearestIndex, 1);
    }
  }

  // Return to depot (optional, usually implied in TSP)
  // path.push(startNode); 
  return path;
};

// 2-Opt Optimization to untangle crossed paths
const twoOpt = (route: Customer[]): Customer[] => {
  let newRoute = [...route];
  let improved = true;
  const maxIterations = 50; // Limit to prevent freezing in browser
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    for (let i = 1; i < newRoute.length - 2; i++) {
      for (let j = i + 1; j < newRoute.length - 1; j++) {
        const distA = calculateDistance(newRoute[i - 1].coordinates, newRoute[i].coordinates);
        const distB = calculateDistance(newRoute[j].coordinates, newRoute[j + 1].coordinates);
        const distC = calculateDistance(newRoute[i - 1].coordinates, newRoute[j].coordinates);
        const distD = calculateDistance(newRoute[i].coordinates, newRoute[j + 1].coordinates);

        if (distA + distB > distC + distD) {
          const newSegment = newRoute.slice(i, j + 1).reverse();
          newRoute.splice(i, j - i + 1, ...newSegment);
          improved = true;
        }
      }
    }
    iterations++;
  }
  return newRoute;
};

export const optimizeRoute = (depot: Customer, stops: Customer[]): Customer[] => {
  if (stops.length === 0) return [depot];
  
  // 1. Initial solution via Nearest Neighbor
  const initialPath = nearestNeighbor([...stops], depot);
  
  // 2. Refine using 2-Opt
  const optimizedPath = twoOpt(initialPath);
  
  return optimizedPath;
};
