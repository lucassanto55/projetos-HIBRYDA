import React, { useState } from 'react';
import { Anchor, Fish } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
        onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-900 p-8 text-center relative overflow-hidden">
            {/* Background pattern decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="fish-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                             <circle cx="20" cy="20" r="1" fill="white"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#fish-pattern)" />
                </svg>
            </div>
            
            <div className="relative z-10 flex justify-center mb-4">
                <div className="bg-white p-3 rounded-full">
                    <Fish size={40} className="text-blue-900" />
                </div>
            </div>
            <h1 className="relative z-10 text-2xl font-bold text-white tracking-wider">HIBRYDA PESCADOS</h1>
            <p className="relative z-10 text-cyan-400 text-sm mt-1 font-medium">SISTEMA DE ROTAS INTELIGENTE</p>
        </div>

        <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Acesso ao Sistema</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Corporativo</label>
                    <input 
                        type="email" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                        placeholder="admin@hibryda.com.br"
                        defaultValue="admin@hibryda.com.br"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input 
                        type="password" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        defaultValue="password"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors flex justify-center items-center"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "ENTRAR"
                    )}
                </button>
            </form>
            <div className="mt-6 text-center">
                <a href="#" className="text-sm text-gray-500 hover:text-blue-900">Esqueceu sua senha?</a>
            </div>
        </div>
      </div>
    </div>
  );
};
