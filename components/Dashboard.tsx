import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Truck, MapPin, Package, AlertCircle } from 'lucide-react';

const data = [
  { name: 'Seg', entregas: 12 },
  { name: 'Ter', entregas: 19 },
  { name: 'Qua', entregas: 15 },
  { name: 'Qui', entregas: 22 },
  { name: 'Sex', entregas: 28 },
  { name: 'Sab', entregas: 10 },
];

const pieData = [
  { name: 'Concluído', value: 75 },
  { name: 'Pendente', value: 25 },
];

const COLORS = ['#008080', '#FFA500'];

const StatCard = ({ icon: Icon, title, value, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Painel de Controle</h2>
        <div className="text-sm text-gray-500">Atualizado: Hoje, 14:30</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Truck} title="Veículos Ativos" value="8/12" color="bg-cyan-600" />
        <StatCard icon={MapPin} title="Rotas Hoje" value="24" color="bg-blue-600" />
        <StatCard icon={Package} title="Entregas Totais" value="156" color="bg-emerald-600" />
        <StatCard icon={AlertCircle} title="Atrasos" value="2" color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Performance Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="entregas" fill="#0e3a5d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Status Entregas</h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm">
             <div className="flex items-center gap-1">
               <div className="w-3 h-3 rounded-full bg-teal-600"></div>
               <span>Concluído</span>
             </div>
             <div className="flex items-center gap-1">
               <div className="w-3 h-3 rounded-full bg-orange-500"></div>
               <span>Pendente</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
