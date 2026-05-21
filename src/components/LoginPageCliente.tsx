import React from 'react';
import { motion } from 'motion/react';
import { Activity, Lock, User, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (dni: string, password: string) => Promise<boolean>;
  onSwitchToWorker?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToWorker }) => {
  const [dni, setDni] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(dni, password);
      if (!success) {
        setError('DNI o contraseña incorrectos. Por favor, intente de nuevo.');
      }
    } catch (error) {
      setError('No se pudo iniciar sesion. Intente nuevamente.');
      console.error('Login request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dash-bg flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-20 h-20 bg-dash-accent rounded-3xl flex items-center justify-center shadow-2xl mb-6 shadow-dash-accent/30"
          >
            <Activity className="text-white w-10 h-10 stroke-[3px]" />
          </motion.div>
          <h1 className="text-4xl font-black text-dash-text tracking-tighter uppercase italic mb-2">SIGHOS</h1>
          <p className="text-dash-text-dim text-[10px] uppercase tracking-[0.3em] font-bold">Sistema Integral de Gestión Hospitalaria</p>
        </div>

        <div className="bg-dash-panel border border-dash-border rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-dash-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-dash-accent/10 transition-all duration-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Identificación (DNI)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                    placeholder="Ingrese su DNI"
                    className="w-full bg-dash-glass border border-dash-border focus:border-dash-accent rounded-2xl py-4 pl-12 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/30"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dash-accent shadow-glow" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-dash-glass border border-dash-border focus:border-dash-accent rounded-2xl py-4 pl-12 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/30"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dash-accent" size={18} />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl"
              >
                <AlertCircle size={16} className="text-dash-danger shrink-0" />
                <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-dash-accent text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-dash-accent/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Iniciar Sesión'
                )}
              </span>
            </button>

            {onSwitchToWorker && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onSwitchToWorker}
                  className="text-xs font-bold text-dash-accent hover:text-dash-accent/80 transition-colors uppercase tracking-wider"
                >
                  Si eres trabajador has click aquí
                </button>
              </div>
            )}
          </form>

          <div className="mt-10 pt-10 border-t border-dash-border/50 text-center">
            <p className="text-[9px] font-bold text-dash-text-dim uppercase tracking-[0.2em] leading-relaxed italic">
              Este sistema es de uso exclusivo para personal autorizado.<br/>
              Todos los accesos son monitoreados por seguridad.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Versión 4.0.2 - Hospital Regional</p>
          <p className="text-[8px] text-dash-text-dim/50 uppercase tracking-widest">© 2026 SIGHOS INTELLIGENCE SYSTEMS</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
