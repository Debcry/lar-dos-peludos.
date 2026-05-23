import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PiggyBank, 
  MapPin, 
  BookOpen, 
  DollarSign, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Activity, 
  Navigation,
  Globe,
  Leaf,
  Layers,
  Search,
  ExternalLink,
  Award,
  Zap,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GreenTip, EWasteCenter, ExpenseItem } from '../types';

interface PocketKnowledgePortalProps {
  greenTips: GreenTip[];
  eWasteCenters: EWasteCenter[];
  addToast: (type: 'success' | 'warning' | 'info', title: string, text: string) => void;
}

export default function PocketKnowledgePortal({
  greenTips,
  eWasteCenters,
  addToast
}: PocketKnowledgePortalProps) {
  const [activeTab, setActiveTab] = useState<'budget' | 'sos' | 'tips'>('budget');

  // AUDIO STATE & WEB AUDIO API REFERENCING
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<number | null>(null);

  // 1. BUDGET CALCULATOR STATE
  const [incomeSalary, setIncomeSalary] = useState<number>(3100);
  const [incomeOthers, setIncomeOthers] = useState<number>(450);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: 'e1', category: 'Aluguel / Habitação', amount: 1100 },
    { id: 'e2', category: 'Alimentação', amount: 650 },
    { id: 'e3', category: 'Energia / Água', amount: 250 },
    { id: 'e4', category: 'Internet / Celular', amount: 120 },
    { id: 'e5', category: 'Transporte', amount: 300 },
    { id: 'e6', category: 'Lazer e Streaming', amount: 150 }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');

  // 2. SOS GEOLOCATION STATE
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [manualRegion, setManualRegion] = useState('SP_CENTER');
  const [sosCountdown, setSosCountdown] = useState(480); // 8 minutes in seconds
  const countdownIntervalRef = useRef<number | null>(null);

  // 3. ECO BASE DE CONHECIMENTO STATE
  const [tipCategoryFilter, setTipCategoryFilter] = useState<'all' | 'tecnologia_verde' | 'lixo_eletronico' | 'sustentabilidade'>('all');
  const [centerSearchText, setCenterSearchText] = useState('');
  const [centerStateSelect, setCenterStateSelect] = useState<'all' | 'SP' | 'RJ' | 'MG' | 'RS'>('all');
  
  // Interactive Footprint Diagnostic State
  const [quizDeviceCount, setQuizDeviceCount] = useState<number>(3);
  const [quizStandbyHabit, setQuizStandbyHabit] = useState<'always' | 'sometimes' | 'never'>('sometimes');
  const [quizBatteryDisposal, setQuizBatteryDisposal] = useState<'box' | 'bin' | 'ecopoint'>('ecopoint');

  // Budget calculations
  const totalIncome = useMemo(() => incomeSalary + incomeOthers, [incomeSalary, incomeOthers]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const netBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
  const burnRate = useMemo(() => {
    if (totalIncome === 0) return 100;
    return (totalExpenses / totalIncome) * 100;
  }, [totalIncome, totalExpenses]);

  // Audio Beeper Implementation using Native Web Audio API
  const startSirenBeep = () => {
    if (!audioCtxRef.current) {
      // @ts-ignore
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (oscillatorIntervalRef.current) {
      window.clearInterval(oscillatorIntervalRef.current);
    }

    let alternate = false;
    oscillatorIntervalRef.current = window.setInterval(() => {
      if (!audioEnabled || !isSirenActive) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Dual siren oscillation 440hz to 880hz
        osc.frequency.value = alternate ? 520 : 780;
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);

        alternate = !alternate;
      } catch (err) {
        // Safe play fail
      }
    }, 450);
  };

  const stopSirenBeep = () => {
    if (oscillatorIntervalRef.current) {
      window.clearInterval(oscillatorIntervalRef.current);
      oscillatorIntervalRef.current = null;
    }
  };

  // SOS activation triggers count tracking & alert sequences
  const handleActivateSos = () => {
    setIsSirenActive(true);
    setSosCountdown(480); // Reset timer to 8:00
    addToast('warning', 'ALERTA SOS INICIADO', 'A transmissão de emergência foi acionada. O sinalizador sonoro comunitário começou.');
  };

  const handleDeactivateSos = () => {
    setIsSirenActive(false);
    stopSirenBeep();
    addToast('success', 'SOS Desativado', 'O sinal de transmissão de emergência foi cancelado com sucesso.');
  };

  // Manage beep audio context state changes
  useEffect(() => {
    if (isSirenActive) {
      startSirenBeep();
      // Start real-time simulated countdown
      countdownIntervalRef.current = window.setInterval(() => {
        setSosCountdown(prev => {
          if (prev <= 1) {
            window.clearInterval(countdownIntervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as any;
    } else {
      stopSirenBeep();
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
      }
    }
    return () => {
      stopSirenBeep();
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isSirenActive, audioEnabled]);

  // Geolocation fetching logic
  const handleFetchGpsCoords = () => {
    setGpsLoading(true);
    setGpsError(null);
    
    if (!navigator.geolocation) {
      setGpsError('O seu navegador não possui suporte a geolocalização.');
      setGpsLoading(false);
      addToast('warning', 'GPS Não Suportado', 'Seu navegador não oferece suporte nativo à geolocalização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          acc: position.coords.accuracy
        });
        setGpsLoading(false);
        addToast('success', 'Coordenadas Carregadas', 'GPS sintonizado com sucesso! Coordenadas transmitidas para o barramento comunitário.');
      },
      (error) => {
        let msg = 'Falha na leitura do satélite.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permissão de Localização rejeitada pelo navegador. Ative as permissões ou use o fallback manual.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Sinal GPS indisponível no momento.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Tempo limite de busca esgotado.';
        }
        setGpsError(msg);
        setGpsLoading(false);
        addToast('warning', 'GPS Restrito', `Utilize a região manual para transmissão: ${msg}`);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Financial Health diagnostic algorithm & recommendation Engine
  const budgetDiagnostic = useMemo(() => {
    if (netBalance < 0) {
      return {
        status: 'crítico',
        color: 'text-red-700 bg-red-50 border-red-200',
        barColor: 'bg-red-500',
        badge: 'Orçamento com Deficit',
        advice: 'Seu saldo mensal está com déficit de endividamento rápido. Recomendamos buscar o corte de vampirismo das tomadas (reduz até 12% da luz), rever faturas de streaming inativas e evitar compras de cartões de crédito parcelados.'
      };
    } else if (burnRate > 85) {
      return {
        status: 'alerta',
        color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
        barColor: 'bg-yellow-500',
        badge: 'Alerta: Orçamento Apertado',
        advice: 'Sua reserva está muito próxima do teto operacional. Planeje seus custos de alimentação de forma semanal fixa e use o plugue filtro de linha para mitigar o consumo oculto standby dos eletrodomésticos.'
      };
    } else {
      return {
        status: 'saudável',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
        badge: 'Orçamento Saudável',
        advice: 'Parabéns, você possui excelente margem de poupança comunitária! Considere aportar o excedente em títulos de energia limpa (green bonds) ou investir em tecnologia doméstica de baixo consumo (lâmpadas LED, Selo Procel A).'
      };
    }
  }, [netBalance, burnRate]);

  // Household expense list administration handles
  const handleAddNewExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newCategoryAmount);
    if (!newCategoryName.trim()) {
      addToast('warning', 'Campos vazios', 'Nomeie a categoria para despesa.');
      return;
    }
    if (isNaN(val) || val <= 0) {
      addToast('warning', 'Valor inválido', 'Adicione um valor decimal válido maior que zero.');
      return;
    }

    const newItem: ExpenseItem = {
      id: 'exp_' + Date.now(),
      category: newCategoryName.trim(),
      amount: val
    };

    setExpenses(prev => [...prev, newItem]);
    setNewCategoryName('');
    setNewCategoryAmount('');
    addToast('success', 'Despesa Inserida', `Categoria ${newItem.category} de R$ ${newItem.amount.toFixed(2)} foi inserida.`);
  };

  const handleDeleteExpense = (id: string, name: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addToast('info', 'Orçamento Reajustado', `Custo ${name} removido da planilha doméstica.`);
  };

  // Filter electronics recycling centers
  const filteredCenters = useMemo(() => {
    return eWasteCenters.filter(center => {
      if (centerStateSelect !== 'all' && center.state !== centerStateSelect) return false;
      if (centerSearchText.trim() !== '') {
        const text = centerSearchText.toLowerCase();
        return (
          center.name.toLowerCase().includes(text) ||
          center.address.toLowerCase().includes(text) ||
          center.city.toLowerCase().includes(text) ||
          center.accepts.toLowerCase().includes(text)
        );
      }
      return true;
    });
  }, [eWasteCenters, centerStateSelect, centerSearchText]);

  // Filter green intelligence articles
  const filteredTips = useMemo(() => {
    if (tipCategoryFilter === 'all') return greenTips;
    return greenTips.filter(tip => tip.category === tipCategoryFilter);
  }, [greenTips, tipCategoryFilter]);

  // Green Eco Metric Footprint Diagnostic Score Calculation
  const scoreDiagnostic = useMemo(() => {
    let score = 100;
    if (quizDeviceCount > 5) score -= 20;
    else if (quizDeviceCount > 2) score -= 10;

    if (quizStandbyHabit === 'always') score -= 30;
    else if (quizStandbyHabit === 'sometimes') score -= 15;

    if (quizBatteryDisposal === 'bin') score -= 40;
    else if (quizBatteryDisposal === 'box') score -= 15;

    return {
      points: Math.max(0, score),
      label: score > 80 ? 'Herói da Tecnologia Verde' : score > 50 ? 'Consumidor Consciente' : 'Alerta Ambiental'
    };
  }, [quizDeviceCount, quizStandbyHabit, quizBatteryDisposal]);

  const mapRegionLabels: { [key: string]: string } = {
    SP_CENTER: 'São Paulo - Centro Cívico / Paulista',
    SP_EAST: 'São Paulo - Zona Leste Terminal',
    RJ_CENTER: 'Rio de Janeiro - Centro / Lapa',
    RJ_SOUTH: 'Rio de Janeiro - Zona Sul Ipanema',
    BH_SAVASSI: 'Belo Horizonte - Savassi',
    POA_SUR: 'Porto Alegre - Praia de Belas'
  };

  // Human interactive clock converter helper
  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="pocket-knowledge">
      {/* Platform Header Banner */}
      <div className="relative bg-gradient-to-r from-emerald-800 to-indigo-950 text-white p-6 md:p-8">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/50 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="h-3.5 w-3.5" /> Utilitário Híbrido Cidadão
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-emerald-50">
            Pocket Knowledge
          </h2>
          <p className="text-emerald-150 text-sm md:text-base mt-2 max-w-2xl font-light">
            Educação financeira doméstica adaptativa, geolocalização emergencial SOS comunitária e canal verde de reciclagem e-waste.
          </p>
        </div>
        {/* Futuristic layout pattern watermarks */}
        <div className="absolute right-6 bottom-0 opacity-10 hidden md:block">
          <Globe className="h-44 w-44 stroke-[0.5]" />
        </div>
      </div>

      {/* Internal Navigation switch bar */}
      <div className="bg-emerald-100/50 border-b border-emerald-200 px-4 flex flex-wrap gap-1">
        {[
          { id: 'budget', label: 'Educação Financeira' },
          { id: 'sos', label: 'Botão SOS Comunitário' },
          { id: 'tips', label: 'Descarte Verde & Dicas' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3.5 text-xs md:text-sm font-medium border-b-2 font-sans transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-700 text-emerald-950 font-bold bg-white/45'
                : 'border-transparent text-emerald-800 hover:text-emerald-950 hover:bg-emerald-200/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Container Area */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BUDGET CALCULATOR */}
          {activeTab === 'budget' && (
            <motion.div
              key="tab-budget"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-emerald-900">
                <PiggyBank className="h-6 w-6 text-emerald-700" />
                <h3 className="text-xl font-bold">Planejador de Orçamento Familiar</h3>
              </div>

              <div className="grid md:grid-cols-12 gap-6">
                {/* Inputs area (Left side) */}
                <div className="md:col-span-4 space-y-4">
                  {/* Revenue input envelope */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-150 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Fontes de Renda Mensal</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Pró-labore / Salário Principal (R$)</label>
                      <input
                        type="number"
                        min="0"
                        value={incomeSalary}
                        onChange={e => setIncomeSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs font-mono font-bold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Renda Extra / Bicos (R$)</label>
                      <input
                        type="number"
                        min="0"
                        value={incomeOthers}
                        onChange={e => setIncomeOthers(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs font-mono font-bold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Add cost itemized envelope */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Inserir Despesa Fixa/Variável</h4>
                    
                    <form onSubmit={handleAddNewExpense} className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Descrição da Despesa</label>
                        <input
                          type="text"
                          required
                          value={newCategoryName}
                          onChange={e => setNewCategoryName(e.target.value)}
                          placeholder="Ex: Assinatura Gym, Farmácia"
                          className="w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Valor Mensal (R$)</label>
                        <div className="flex gap-1.5">
                          <input
                            type="number"
                            required
                            min="0.1"
                            step="0.01"
                            value={newCategoryAmount}
                            onChange={e => setNewCategoryAmount(e.target.value)}
                            placeholder="ex: 45.90"
                            className="w-full px-3 py-1.5 border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            type="submit"
                            className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg cursor-pointer flex items-center justify-center shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Computational outputs area (Right side) */}
                <div className="md:col-span-8 space-y-6">
                  {/* Results row cards */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Total Entradas</span>
                        <div className="text-lg font-mono font-black text-emerald-700 mt-0.5">R$ {totalIncome.toFixed(2)}</div>
                      </div>
                      <span className="h-8.5 w-8.5 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">+</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Total Saídas</span>
                        <div className="text-lg font-mono font-black text-rose-700 mt-0.5">R$ {totalExpenses.toFixed(2)}</div>
                      </div>
                      <span className="h-8.5 w-8.5 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center font-bold text-sm">-</span>
                    </div>

                    <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800">Saldo Poupança</span>
                        <div className={`text-lg font-mono font-black mt-0.5 ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          R$ {netBalance.toFixed(2)}
                        </div>
                      </div>
                      <span className={`h-8.5 w-8.5 rounded-full flex items-center justify-center text-white ${netBalance >= 0 ? 'bg-emerald-600' : 'bg-rose-500'}`}>
                        =
                      </span>
                    </div>
                  </div>

                  {/* Operational Health indicator block */}
                  <div className={`p-4 rounded-xl border leading-relaxed text-xs ${budgetDiagnostic.color}`}>
                    <div className="flex items-center gap-2 font-bold mb-1 uppercase tracking-wide text-[11px]">
                      <Award className="h-4 w-4 stroke-[2.5]" /> {budgetDiagnostic.badge}
                    </div>
                    <p>{budgetDiagnostic.advice}</p>

                    {/* Progress tracking percent rule */}
                    <div className="mt-3.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mb-1">
                        <span>Comprometimento Energético de Renda</span>
                        <span>{burnRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all ${budgetDiagnostic.barColor}`} 
                          style={{ width: `${Math.min(100, burnRate)}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Household expense breakdown list */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                    <div className="bg-slate-55 bg-slate-100 p-3 border-b text-xs font-bold text-slate-800 flex justify-between items-center">
                      <span>Memória Discriminada de Gastos</span>
                      <span>{expenses.length} Itens Ativos</span>
                    </div>

                    <div className="divide-y divide-gray-105 divide-gray-100 max-h-56 overflow-y-auto">
                      {expenses.length === 0 ? (
                        <div className="text-center py-8 text-xs text-gray-400 font-mono">Planilha de custos limpa! Nenhuma saída lançada.</div>
                      ) : (
                        expenses.map(exp => {
                          const itemPercent = totalIncome > 0 ? ((exp.amount / totalIncome) * 100).toFixed(1) : '0.0';
                          return (
                            <div key={exp.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs">
                              <div>
                                <span className="font-semibold text-gray-800 block text-xs">{exp.category}</span>
                                <span className="text-[10px] text-gray-400 font-mono">Representa {itemPercent}% da renda familiar</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-black text-gray-700 font-mono">R$ {exp.amount.toFixed(2)}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteExpense(exp.id, exp.category)}
                                  className="text-gray-300 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Remover Despesa"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: BOTÃO SOS */}
          {activeTab === 'sos' && (
            <motion.div
              key="tab-sos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-red-900">
                <ShieldAlert className="h-6 w-6 text-red-650 text-red-600" />
                <h3 className="text-xl font-bold">Botão SOS Comunitário Híbrido</h3>
              </div>

              {/* Siren Warning active banner */}
              {isSirenActive && (
                <motion.div
                  animate={{ scale: [1, 1.015, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-4 bg-red-600 text-white rounded-xl flex flex-col sm:flex-row items-center gap-4 justify-between border-2 border-red-700 shadow-lg animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 shrink-0 stroke-2 text-white animate-spin" />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-red-50">Sinalizador Ativo em Tempo Real</h4>
                      <p className="text-xs text-red-100 font-light mt-0.5">
                        Transmissão comunitária via rádio-pacote estabelecida. Central informada sobre coordenadas de emergência.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Bleeper toggle button */}
                    <button
                      onClick={() => setAudioEnabled(a => !a)}
                      className="p-1.5 bg-red-750 bg-red-700 hover:bg-red-800 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer text-white"
                      title={audioEnabled ? 'Mutar Beep' : 'Ativar Beep'}
                    >
                      {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={handleDeactivateSos}
                      className="px-4 py-2 bg-white text-red-750 text-red-700 rounded-lg text-xs font-black uppercase hover:bg-neutral-50 transition-colors cursor-pointer border border-red-200"
                    >
                      Desativar SOS
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="grid md:grid-cols-12 gap-6">
                {/* Visualizer & SOS (Left Column) */}
                <div className="md:col-span-7 flex flex-col items-center justify-center p-6 bg-white border border-gray-150 rounded-2xl relative overflow-hidden text-center min-h-[350px]">
                  
                  {/* Outer waves when SOS is humming */}
                  {isSirenActive ? (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <div className="absolute h-56 w-56 bg-red-500/10 rounded-full animate-ping" />
                      <div className="absolute h-40 w-40 bg-red-500/20 rounded-full animate-ping [animation-delay:0.5s]" />
                    </div>
                  ) : null}

                  {/* Real Geotechnical pulsing button */}
                  <button
                    onClick={isSirenActive ? handleDeactivateSos : handleActivateSos}
                    className={`h-36 w-36 rounded-full border-4 flex flex-col items-center justify-center relative cursor-pointer font-sans transition-all active:scale-95 shadow-md ${
                      isSirenActive
                        ? 'bg-red-650 bg-red-600 hover:bg-red-750 text-white border-red-700 animate-pulse'
                        : 'bg-white hover:bg-red-50 border-red-600 text-red-600'
                    }`}
                  >
                    <ShieldAlert className="h-10 w-10 fill-transparent" />
                    <span className="text-xs font-extrabold tracking-widest uppercase mt-3">
                      {isSirenActive ? 'Parar Alerta' : 'Disparar SOS'}
                    </span>
                    <span className="text-[9px] font-medium opacity-70 mt-1 uppercase tracking-wide">
                      {isSirenActive ? 'Emitindo Beep' : 'Emergência'}
                    </span>
                  </button>

                  <div className="max-w-md pt-5 space-y-2 relative z-10 select-none">
                    <p className="text-xs text-gray-500">
                      <strong>Botão SOS Universitário:</strong> Utiliza geolocalização do navegador (ou sinalizadores substitutos de malha urbana) para apontar emergências de integridade do território comunitário.
                    </p>
                    
                    {isSirenActive && (
                      <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center gap-2 text-xs font-bold text-red-800">
                        <Activity className="h-4.5 w-4.5 text-red-600 animate-spin" />
                        Apoio estimado a caminho: <span className="font-mono text-sm">{formatSeconds(sosCountdown)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Satellite GPS details panel (Right Column) */}
                <div className="md:col-span-5 space-y-4">
                  
                  {/* Sat reception card */}
                  <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                        <Navigation className="h-4 w-4 text-emerald-700" /> Receptor de Coordenadas GPS
                      </span>
                      <span className={`h-2.5 w-2.5 rounded-full ${coords ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    </div>

                    <div className="space-y-2.5">
                      {coords ? (
                        <div className="p-3 bg-slate-50 border rounded-lg space-y-1.5 font-mono text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>LATITUDE:</span>
                            <span className="font-bold text-gray-950">{coords.lat.toFixed(6)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>LONGITUDE:</span>
                            <span className="font-bold text-gray-950">{coords.lng.toFixed(6)}°</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>PRECISÃO (GPS):</span>
                            <span>± {coords.acc.toFixed(1)} metros</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50/50 border border-amber-200 text-amber-800 rounded-lg text-xs text-center font-light leading-relaxed">
                          Nenhum GPS sintonizado. É recomendável ler as coordenadas antes do disparo emergencial comunitário.
                        </div>
                      )}

                      {gpsError && (
                        <div className="p-2.5 bg-red-50 text-red-800 text-[10px] rounded-lg leading-relaxed font-sans flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {gpsError}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={gpsLoading}
                          onClick={handleFetchGpsCoords}
                          className="flex-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          {gpsLoading ? 'Sintonizando Satélite...' : 'Consultar Satélite GPS'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Manual fallback transmitter selector */}
                  <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs space-y-3">
                    <span className="text-xs font-bold text-gray-600 uppercase block">Definir Malha de Transmissão Manual</span>
                    
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Caso o GPS esteja bloqueado pela sandbox da plataforma, selecione a subregião urbana para transmissão do alerta SOS:
                    </p>

                    <select
                      value={manualRegion}
                      onChange={e => {
                        setManualRegion(e.target.value);
                        addToast('info', 'Malha de Transmissão Alterada', `Canal regional alterado para ${mapRegionLabels[e.target.value]}`);
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-xs bg-white text-gray-800 focus:outline-none"
                    >
                      <option value="SP_CENTER">Paulista / Centro - São Paulo SP</option>
                      <option value="SP_EAST">Itaquera / Zona Leste - São Paulo SP</option>
                      <option value="RJ_CENTER">Lapa / Carioca - Rio de Janeiro RJ</option>
                      <option value="RJ_SOUTH">Ipanema / Lagoa - Rio de Janeiro RJ</option>
                      <option value="BH_SAVASSI">Savassi / Floresta - Belo Horizonte MG</option>
                      <option value="POA_SUR">Praia de Belas - Porto Alegre RS</option>
                    </select>

                    <div className="bg-slate-50 p-2.5 rounded-lg border text-[10px] font-mono flex items-center justify-between text-gray-500">
                      <span>ANTENA ATIVA:</span>
                      <span className="font-bold text-slate-800">UHF_M_CH_99</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BASE DE CONHECIMENTO & GREEN TECH */}
          {activeTab === 'tips' && (
            <motion.div
              key="tab-tips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-emerald-900">
                <BookOpen className="h-6 w-6 text-emerald-700" />
                <h3 className="text-xl font-bold">Base de Conhecimento Verde & Reciclagem</h3>
              </div>

              {/* Grid: Eco Footprint Diagnostics (Left) & Recycling Centers Lookup (Right) */}
              <div className="grid md:grid-cols-12 gap-6">
                
                {/* Diagnostic Footprint (Left Column) */}
                <div className="md:col-span-5 bg-white p-4 md:p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
                  <div className="flex items-center gap-1">
                    <Leaf className="h-4 text-emerald-700 fill-emerald-100" />
                    <h4 className="text-sm font-bold text-gray-800">Avaliação de Consumo de E-Waste</h4>
                  </div>
                  
                  <p className="text-xs text-gray-500 leading-normal">
                    Faça uma auditoria rápida de seus hábitos eletrônicos. Quanto menor a pontuação, maior a necessidade de rever hábitos verdes domésticos!
                  </p>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Qual o total de eletrodomésticos/eletrônicos ativos em casa?</label>
                      <select 
                        value={quizDeviceCount} 
                        onChange={e => setQuizDeviceCount(parseInt(e.target.value))}
                        className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white text-gray-700 focus:outline-none"
                      >
                        <option value={2}>Até 2 dispositivos</option>
                        <option value={4}>De 3 a 5 dispositivos</option>
                        <option value={8}>De 6 a 10 dispositivos</option>
                        <option value={15}>Mais de 10 dispositivos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Costuma manter aparelhos no modo tomada / stand-by (vampirismo)?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'always', label: 'Sempre' },
                          { id: 'sometimes', label: 'Às vezes' },
                          { id: 'never', label: 'Nunca' }
                        ].map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setQuizStandbyHabit(item.id as any)}
                            className={`py-1.5 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                              quizStandbyHabit === item.id 
                                ? 'bg-emerald-700 text-white font-semibold border-emerald-800' 
                                : 'bg-white text-gray-600 border-gray-150 hover:bg-emerald-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Como descarta pilhas e baterias velhas?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'bin', label: 'Lixo Comum' },
                          { id: 'box', label: 'Gaveta' },
                          { id: 'ecopoint', label: 'Ecopontos' }
                        ].map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setQuizBatteryDisposal(item.id as any)}
                            className={`py-1.5 rounded-lg border text-xs text-center cursor-pointer transition-colors ${
                              quizBatteryDisposal === item.id 
                                ? 'bg-emerald-700 text-white font-semibold border-emerald-800' 
                                : 'bg-white text-gray-600 border-gray-150 hover:bg-emerald-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ecological Footprint Score Output */}
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Pontuação Ecológica</span>
                      <div className="text-xl font-black font-mono text-emerald-950 mt-0.5">{scoreDiagnostic.points} / 100 pt</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-full font-bold">
                        {scoreDiagnostic.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recycling Centers Lookup (Right Column) */}
                <div className="md:col-span-7 bg-white p-4 md:p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Search className="h-4.5 w-4.5 text-emerald-700" /> Consultar Ecopontos Eletrônicos (E-Waste)
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={centerSearchText}
                        onChange={e => setCenterSearchText(e.target.value)}
                        placeholder="Buscar por cidade ou componentes aceitos..."
                        className="w-full pl-8.5 pl-8 pr-3 py-1.5 border rounded-lg text-xs focus:outline-none"
                      />
                    </div>

                    <select
                      value={centerStateSelect}
                      onChange={e => setCenterStateSelect(e.target.value as any)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs bg-white focus:outline-none text-gray-700"
                    >
                      <option value="all">Filtro Estado: Todos</option>
                      <option value="SP">São Paulo (SP)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="RS">Rio Grande do Sul (RS)</option>
                    </select>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {filteredCenters.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400 font-mono">Nenhum ecoponto cadastrado para sua busca.</div>
                    ) : (
                      filteredCenters.map(center => (
                        <div key={center.id} className="p-3 border rounded-xl hover:border-emerald-300 hover:bg-emerald-50/10 transition-colors space-y-1.5 text-xs text-gray-600">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-900 block leading-tight">{center.name}</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                              {center.state}
                            </span>
                          </div>
                          
                          <p className="font-medium text-[11px] text-gray-500 leading-relaxed font-sans">{center.address}</p>
                          
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400 pt-0.5">
                            <span>Telefone: <strong>{center.phone}</strong></span>
                            <span>Aceita: <strong className="text-emerald-700">{center.accepts}</strong></span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Clean curated green items articles row */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide mr-2">Filtrar Base:</span>
                  {[
                    { id: 'all', label: 'Todas as Dicas' },
                    { id: 'tecnologia_verde', label: 'Tecnologia Verde' },
                    { id: 'lixo_eletronico', label: 'Descarte e E-Waste' },
                    { id: 'sustentabilidade', label: 'Sustentabilidade Urbana' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setTipCategoryFilter(btn.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                        tipCategoryFilter === btn.id
                          ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                          : 'bg-white text-gray-600 border-gray-200 hover:text-emerald-800'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTips.map(tip => (
                    <div key={tip.id} className="bg-white p-4 rounded-xl border border-gray-150 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          tip.category === 'tecnologia_verde'
                            ? 'bg-emerald-50 text-emerald-750'
                            : tip.category === 'lixo_eletronico'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-indigo-50 text-indigo-800'
                        }`}>
                          {tip.category === 'tecnologia_verde' && 'Tecnologia Verde'}
                          {tip.category === 'lixo_eletronico' && 'Lixo Eletrônico'}
                          {tip.category === 'sustentabilidade' && 'Sustentabilidade'}
                        </span>

                        <h4 className="font-bold text-gray-900 leading-tight text-sm">{tip.title}</h4>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">{tip.summary}</p>
                        <p className="text-xs text-gray-500 leading-relaxed pt-1 font-light italic">{tip.content}</p>
                      </div>

                      <div className="pt-3 border-t mt-3 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                        <span>Código do Módulo</span>
                        <span className="flex items-center gap-0.5 text-emerald-800 font-bold font-sans">
                          Manual ECO <Zap className="h-3 w-3 inline" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
