import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Customer, Vehicle } from '../types';
import { MOCK_CUSTOMERS, MOCK_DEPOT, MOCK_VEHICLES } from '../services/mockData';
import { optimizeRoute, calculateDistance } from '../services/tspSolver';
import { Plus, Trash2, Map, Save, FileSpreadsheet, FileText, Truck } from 'lucide-react';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const DepotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const TruckIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper to fit bounds
const ChangeView = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
};

export const RoutePlanner: React.FC = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [routePath, setRoutePath] = useState<Customer[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [stats, setStats] = useState({ distance: 0, time: 0 });

  const addCustomer = (customer: Customer) => {
    setSelectedCustomers([...selectedCustomers, customer]);
    setAvailableCustomers(availableCustomers.filter(c => c.id !== customer.id));
    setIsOptimized(false);
  };

  const removeCustomer = (customer: Customer) => {
    setAvailableCustomers([...availableCustomers, customer]);
    setSelectedCustomers(selectedCustomers.filter(c => c.id !== customer.id));
    setIsOptimized(false);
  };

  const handleOptimize = () => {
    if (!selectedVehicle) {
      alert("Por favor selecione um veículo.");
      return;
    }
    
    // Run TSP
    const optimized = optimizeRoute(MOCK_DEPOT, selectedCustomers);
    setRoutePath(optimized);
    
    // Calculate Stats
    let totalDist = 0;
    for(let i=0; i<optimized.length-1; i++) {
        totalDist += calculateDistance(optimized[i].coordinates, optimized[i+1].coordinates);
    }
    // Return to depot distance
    // totalDist += calculateDistance(optimized[optimized.length-1].coordinates, MOCK_DEPOT.coordinates);

    setStats({
        distance: parseFloat(totalDist.toFixed(2)),
        time: Math.round(totalDist * 2.5) // Crude estimate: 2.5 mins per km
    });
    
    setIsOptimized(true);
  };

  const exportRoute = (type: 'pdf' | 'excel') => {
    if(!isOptimized) return;
    alert(`Exportando rota ${selectedVehicle?.plate} em formato ${type.toUpperCase()}... \n(Simulação de Download)`);
  };

  const getBounds = (): L.LatLngBoundsExpression => {
    const points = [MOCK_DEPOT, ...selectedCustomers];
    if (points.length === 0) return [[-23.9618, -46.3322]];
    const lats = points.map(p => p.coordinates.lat);
    const lngs = points.map(p => p.coordinates.lng);
    return [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)]
    ];
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-4">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
        
        {/* Vehicle Selection */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Truck size={18} /> Veículo
            </h3>
            <select 
                className="w-full p-2 border rounded-md text-sm"
                onChange={(e) => setSelectedVehicle(MOCK_VEHICLES.find(v => v.id === e.target.value) || null)}
            >
                <option value="">Selecione um veículo...</option>
                {MOCK_VEHICLES.map(v => (
                    <option key={v.id} value={v.id}>{v.plate} - {v.driverName} ({v.capacity}kg)</option>
                ))}
            </select>
        </div>

        {/* Selected Stops */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-2">Paradas ({selectedCustomers.length})</h3>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-[150px]">
                {selectedCustomers.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-4">Nenhuma parada selecionada</div>
                )}
                {selectedCustomers.map((c, idx) => (
                    <div key={c.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100 text-sm">
                        <div className="flex gap-2">
                            <span className="font-bold text-blue-900">{idx + 1}.</span>
                            <div>
                                <div className="font-medium text-slate-700">{c.name}</div>
                                <div className="text-xs text-gray-500">{c.address}</div>
                            </div>
                        </div>
                        <button onClick={() => removeCustomer(c)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {isOptimized && (
                    <div className="grid grid-cols-2 gap-2 text-center bg-cyan-50 p-2 rounded-md border border-cyan-100">
                        <div>
                            <div className="text-xs text-gray-500">Distância Total</div>
                            <div className="font-bold text-cyan-800">{stats.distance} km</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Tempo Estimado</div>
                            <div className="font-bold text-cyan-800">{stats.time} min</div>
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleOptimize}
                    disabled={selectedCustomers.length === 0 || !selectedVehicle}
                    className={`w-full py-2 rounded-md font-semibold text-white flex justify-center items-center gap-2 transition-colors
                        ${selectedCustomers.length > 0 && selectedVehicle 
                            ? 'bg-blue-900 hover:bg-blue-800' 
                            : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    <Map size={18} /> Gerar Rota Otimizada
                </button>
                
                {isOptimized && (
                    <div className="flex gap-2">
                        <button onClick={() => exportRoute('pdf')} className="flex-1 py-1 text-sm border border-red-200 text-red-700 hover:bg-red-50 rounded flex justify-center items-center gap-1">
                            <FileText size={14} /> PDF
                        </button>
                        <button onClick={() => exportRoute('excel')} className="flex-1 py-1 text-sm border border-green-200 text-green-700 hover:bg-green-50 rounded flex justify-center items-center gap-1">
                            <FileSpreadsheet size={14} /> Excel
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Available Customers */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-slate-800 mb-2">Clientes Disponíveis</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {availableCustomers.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-gray-100 text-sm cursor-pointer group" onClick={() => addCustomer(c)}>
                        <div>
                            <div className="font-medium text-gray-700">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.deliveryWindow}</div>
                        </div>
                        <Plus size={16} className="text-gray-400 group-hover:text-green-600" />
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
         <MapContainer center={[MOCK_DEPOT.coordinates.lat, MOCK_DEPOT.coordinates.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ChangeView bounds={getBounds()} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Depot Marker */}
            <Marker position={[MOCK_DEPOT.coordinates.lat, MOCK_DEPOT.coordinates.lng]} icon={DepotIcon}>
                <Popup>
                    <strong>{MOCK_DEPOT.name}</strong><br/>Depósito Central
                </Popup>
            </Marker>

            {/* Customer Markers */}
            {selectedCustomers.map((c, idx) => (
                <Marker key={c.id} position={[c.coordinates.lat, c.coordinates.lng]}>
                    <Popup>
                        <strong>{c.name}</strong><br/>
                        {c.address}<br/>
                        Prioridade: {c.priority}
                    </Popup>
                </Marker>
            ))}

            {/* Route Polyline */}
            {isOptimized && routePath.length > 0 && (
                <Polyline 
                    positions={routePath.map(p => [p.coordinates.lat, p.coordinates.lng])}
                    color="#008080" // Teal color
                    weight={4}
                    opacity={0.8}
                    dashArray="10, 10" // Dashed line to signify planned route
                />
            )}
         </MapContainer>
         
         {!isOptimized && selectedCustomers.length > 0 && (
            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow text-xs text-gray-600 z-[1000] backdrop-blur-sm">
                Adicione clientes e clique em "Gerar Rota"
            </div>
         )}
      </div>
    </div>
  );
};
