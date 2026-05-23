import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Info, 
  DollarSign, 
  PlusCircle, 
  Search, 
  Mail, 
  Phone, 
  Clock, 
  Sparkles, 
  User, 
  Home, 
  ShieldCheck, 
  CheckCircle,
  Copy,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Animal, FinancialEntry } from '../types';

interface LardospeludosPortalProps {
  animals: Animal[];
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
  financialEntries: FinancialEntry[];
  setFinancialEntries: React.Dispatch<React.SetStateAction<FinancialEntry[]>>;
  addToast: (type: 'success' | 'warning' | 'info', title: string, text: string) => void;
}

export default function LardospeludosPortal({
  animals,
  setAnimals,
  financialEntries,
  setFinancialEntries,
  addToast
}: LardospeludosPortalProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'galeria' | 'transparencia' | 'ajudar'>('home');

  // Galeria filters state
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'dog' | 'cat'>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'Pequeno' | 'Médio' | 'Grande'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Macho' | 'Fêmea'>('all');

  // Adoption modal state
  const [selectedAdoptionAnimal, setSelectedAdoptionAnimal] = useState<Animal | null>(null);
  const [adopterName, setAdopterName] = useState('');
  const [adopterEmail, setAdopterEmail] = useState('');
  const [adopterPhone, setAdopterPhone] = useState('');
  const [adopterHomeType, setAdopterHomeType] = useState('Casa');
  const [adopterHasPets, setAdopterHasPets] = useState('Não');
  const [adopterDetails, setAdopterDetails] = useState('');

  // Transparência state
  const [financeSearch, setFinanceSearch] = useState('');
  const [financeTypeFilter, setFinanceTypeFilter] = useState<'all' | 'donate' | 'expense'>('all');
  const [showAddFinanceForm, setShowAddFinanceForm] = useState(false);

  // New finance entry form state
  const [newFinanceType, setNewFinanceType] = useState<'donate' | 'expense'>('donate');
  const [newFinanceCategory, setNewFinanceCategory] = useState<string>('Doação Geral');
  const [newFinanceValue, setNewFinanceValue] = useState('');
  const [newFinanceDonor, setNewFinanceDonor] = useState('');
  const [newFinanceDesc, setNewFinanceDesc] = useState('');
  const [newFinanceDate, setNewFinanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Contato / PIX state
  const [pixAmount, setPixAmount] = useState<number>(30);
  const [showPixQR, setShowPixQR] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Statistics calculation
  const stats = useMemo(() => {
    const total = animals.length;
    const waiting = animals.filter(a => a.status === 'disponível').length;
    const adopting = animals.filter(a => a.status === 'em_processo').length;
    const adopted = animals.filter(a => a.status === 'adotado').length + 147; // Base count + current session adoptions
    return { total, waiting, adopting, adopted };
  }, [animals]);

  // Financial calculations
  const financialTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    financialEntries.forEach(entry => {
      if (entry.type === 'donate') income += entry.value;
      else expense += entry.value;
    });
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [financialEntries]);

  // Finance categories aggregation for visuals
  const categoryChartData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    financialEntries
      .filter(e => e.type === 'expense')
      .forEach(entry => {
        categories[entry.category] = (categories[entry.category] || 0) + entry.value;
      });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [financialEntries]);

  // Filter animals list
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      if (speciesFilter !== 'all' && animal.type !== speciesFilter) return false;
      if (sizeFilter !== 'all' && animal.size !== sizeFilter) return false;
      if (genderFilter !== 'all' && animal.gender !== genderFilter) return false;
      return true;
    });
  }, [animals, speciesFilter, sizeFilter, genderFilter]);

  // Filter financial entries
  const filteredFinancialEntries = useMemo(() => {
    return financialEntries
      .filter(entry => {
        if (financeTypeFilter !== 'all' && entry.type !== financeTypeFilter) return false;
        if (financeSearch.trim() !== '') {
          const s = financeSearch.toLowerCase();
          const matchDesc = entry.description.toLowerCase().includes(s);
          const matchDonor = entry.donorOrSupplier.toLowerCase().includes(s);
          const matchCat = entry.category.toLowerCase().includes(s);
          return matchDesc || matchDonor || matchCat;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [financialEntries, financeTypeFilter, financeSearch]);

  // Handle new adoption application
  const handleAdoptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdoptionAnimal) return;

    if (!adopterName || !adopterEmail || !adopterPhone) {
      addToast('warning', 'Campos Obrigatórios', 'Por favor preencha nome, email e telefone.');
      return;
    }

    // Update animal status to em_processo
    setAnimals(prev => prev.map(a => {
      if (a.id === selectedAdoptionAnimal.id) {
        return { ...a, status: 'em_processo' };
      }
      return a;
    }));

    addToast(
      'success',
      'Solicitação Recebida!',
      `Obrigado, ${adopterName}! Sua intenção de adotar o ${selectedAdoptionAnimal.name} foi registrada. Nossa equipe de extensão entrará em contato em breve!`
    );

    // Reset adoption form state
    setSelectedAdoptionAnimal(null);
    setAdopterName('');
    setAdopterEmail('');
    setAdopterPhone('');
    setAdopterDetails('');
  };

  // Handle insertion of manual finance record
  const handleAddFinance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newFinanceValue);
    if (isNaN(val) || val <= 0) {
      addToast('warning', 'Valor Inválido', 'Por favor forneça um valor numérico positivo.');
      return;
    }
    if (!newFinanceDonor.trim() || !newFinanceDesc.trim()) {
      addToast('warning', 'Dados Incompletos', 'Preencha o campo de descrição e fornecedor/doador.');
      return;
    }

    const newEntry: FinancialEntry = {
      id: 'custom_' + Date.now(),
      type: newFinanceType,
      category: newFinanceCategory as any,
      value: val,
      date: newFinanceDate,
      description: newFinanceDesc,
      donorOrSupplier: newFinanceDonor
    };

    setFinancialEntries(prev => [newEntry, ...prev]);
    addToast('success', 'Lançamento Concluído', `Registro de R$ ${val.toFixed(2)} cadastrado com sucesso no livro de contas.`);

    // Reset state
    setNewFinanceValue('');
    setNewFinanceDonor('');
    setNewFinanceDesc('');
    setShowAddFinanceForm(false);
  };

  // Trigger simulated PIX payment
  const handleDoPixPayment = () => {
    if (pixAmount <= 0) {
      addToast('warning', 'Valor nulo', 'Fale sobre um valor válido.');
      return;
    }

    // Build automated transaction
    const newEntry: FinancialEntry = {
      id: 'pix_' + Date.now(),
      type: 'donate',
      category: 'Doação Geral',
      value: pixAmount,
      date: new Date().toISOString().split('T')[0],
      description: `Contribuição PIX Solidária em Tempo Real`,
      donorOrSupplier: 'Doador Anônimo Comunidade (Simulado)'
    };

    setFinancialEntries(prev => [newEntry, ...prev]);
    addToast(
      'success',
      'PIX Confirmado!',
      `Obrigado! Sua contribuição simulada de R$ ${pixAmount.toFixed(2)} foi processada e atualizada na tabela de Transparência Financeira!`
    );

    setShowPixQR(false);
  };

  // Handle contact form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      addToast('warning', 'Campos vazios', 'Por favor, complete todos os campos do contato.');
      return;
    }

    addToast(
      'success',
      'Mensagem Enviada!',
      'Nossa equipe de extensão acadêmica recebeu sua mensagem e responderá o mais breve possível.'
    );
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const getCategoryColor = (catName: string) => {
    switch (catName) {
      case 'Alimentação': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Veterinário': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Medicamentos': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Infraestrutura': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Higiene': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Doação Geral': return 'bg-green-100 text-green-800 border-green-200';
      case 'Parcial Empresarial': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-orange-50/30 rounded-2xl border border-orange-100 overflow-hidden shadow-sm" id="lardospeludos-portal">
      {/* Shelter Header Banner */}
      <div className="relative bg-gradient-to-r from-amber-700 to-orange-800 text-white p-6 md:p-8">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/50 text-amber-100 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="h-3.5 w-3.5 fill-amber-300 stroke-amber-300" /> Projeto de Extensão Universitária
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans text-amber-50">
            Lardospeludos
          </h2>
          <p className="text-amber-100 text-sm md:text-base mt-2 max-w-2xl font-light">
            Vitrine interativa de adoção responsável e painel completo de transparência social do abrigo animal da comunidade universitária. Care, Love & Transparência.
          </p>
        </div>
        {/* Cute dog ears vector watermark */}
        <div className="absolute right-6 bottom-0 opacity-15 hidden md:block">
          <Heart className="h-44 w-44 stroke-[0.5]" />
        </div>
      </div>

      {/* Internal Navigation Sub-bar */}
      <div className="bg-amber-100/60 border-b border-amber-200/50 px-4 flex flex-wrap gap-1">
        {[
          { id: 'home', label: 'Início & Missão' },
          { id: 'galeria', label: 'Galeria de Adoção' },
          { id: 'transparencia', label: 'Transparência Financeira' },
          { id: 'ajudar', label: 'Contato & Como Ajudar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3.5 text-xs md:text-sm font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-amber-700 text-amber-900 font-bold bg-white/45'
                : 'border-transparent text-amber-800 hover:text-amber-900 hover:bg-amber-200/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Portal Content Area */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Mission Card & Photo Intro */}
              <div className="grid md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg font-bold tracking-tight">Amor Não Tem Raça, Mas Tem Lar</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Nossa missão acadêmica é conectar o acolhimento animal à cidadania por meio de tecnologia e dedicação de voluntários. O <strong>Lardospeludos</strong> abriga hoje dezenas de animais resgatados que recebem tratos veterinários detalhados, banho, castração, adestramento cooperativo de socialização e, acima de tudo, carinho enquanto aguardam sua adoção definitiva.
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Com este sistema integrado, estimulamos a prestação de contas governamental e comunitária. Cada centavo de doação recebido é documentado com rastreabilidade auditável, garantindo que o amor social seja guiado com integridade matemática.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('galeria')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 shadow-sm cursor-pointer transition-colors"
                    >
                      Ver Animais para Adoção
                    </button>
                    <button
                      onClick={() => setActiveTab('ajudar')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-amber-700 text-amber-800 hover:bg-amber-50 cursor-pointer transition-colors"
                    >
                      Apoiar com PIX solidário
                    </button>
                  </div>
                </div>

                {/* Banner Illustration (Dynamic Aesthetic SVG representation) */}
                <div className="md:col-span-5 bg-amber-100/50 p-6 rounded-2xl border border-amber-200/40 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="bg-amber-200/80 p-4 rounded-full text-amber-800">
                    <Heart className="h-10 w-10 fill-amber-700 stroke-amber-700" />
                  </div>
                  <h4 className="font-semibold text-amber-900 text-sm">Amigo que Transforma de Verdade</h4>
                  <p className="text-xs text-amber-800 max-w-xs font-light">
                    “Adotar um amigo é preencher o ambiente de luz e dar uma segunda chance a quem só sabe dar amor.”
                  </p>
                  <div className="text-[10px] bg-white/70 px-2.5 py-1 rounded-full text-amber-800 border border-amber-200">
                    Projeto Integrado • Acessibilidade Força-Tarefa
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {[
                  { label: 'Animais Acolhidos', value: stats.total, color: 'border-blue-100 bg-blue-50/50 text-blue-700' },
                  { label: 'Esperando Adoção', value: stats.waiting, color: 'border-yellow-200 bg-yellow-50/30 text-yellow-700' },
                  { label: 'Em Processo', value: stats.adopting, color: 'border-amber-200 bg-amber-50/40 text-amber-700' },
                  { label: 'Vidas Transformadas', value: stats.adopted, color: 'border-green-100 bg-green-50/50 text-green-700' }
                ].map((st, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${st.color} flex flex-col justify-between`}>
                    <span className="text-xs font-medium text-gray-500">{st.label}</span>
                    <span className="text-3xl font-extrabold tracking-tight mt-2">{st.value}</span>
                  </div>
                ))}
              </div>

              {/* Fast Transparency Box inside Home */}
              <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 grid md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                    <ShieldCheck className="h-4.5 w-4.5" /> Auditoria Geral de Caixa do Abrigo
                  </div>
                  <p className="text-xs text-gray-500 max-w-xl">
                    Demonstrativo básico do mês corrente. Todos os lançamentos estão disponíveis para consulta livre no painel de transparência financeira.
                  </p>
                </div>
                <div className="flex justify-between md:justify-around p-3 bg-white rounded-xl border border-emerald-100">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 font-semibold uppercase">Saldo Disponível</div>
                    <div className="text-lg font-extrabold text-emerald-700">R$ {financialTotals.balance.toFixed(2)}</div>
                  </div>
                  <div className="border-l border-emerald-150 h-8 self-center" />
                  <div className="text-center">
                    <button
                      onClick={() => setActiveTab('transparencia')}
                      className="px-2.5 py-1.5 rounded-lg text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-medium cursor-pointer transition-colors"
                    >
                      Auditar Contas
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: GALERIA DE ADOÇÃO */}
          {activeTab === 'galeria' && (
            <motion.div
              key="tab-galeria"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Filter controls */}
              <div className="bg-white p-4 rounded-xl border border-orange-100/50 shadow-xs flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide mr-2">Filtros:</span>
                  
                  {/* Species Toggle */}
                  <div className="flex rounded-lg bg-gray-100 p-0.5">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'dog', label: 'Cães' },
                      { id: 'cat', label: 'Gatos' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setSpeciesFilter(btn.id as any)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                          speciesFilter === btn.id
                            ? 'bg-amber-700 text-white font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Size Dropdown */}
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    <option value="all">Porte: Todos</option>
                    <option value="Pequeno">Porte Pequeno</option>
                    <option value="Médio">Porte Médio</option>
                    <option value="Grande">Porte Grande</option>
                  </select>

                  {/* Gender Dropdown */}
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    <option value="all">Sexo: Todos</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>

                <div className="text-[11px] text-gray-500">
                  Mostrando {filteredAnimals.length} peludinho(s)
                </div>
              </div>

              {/* Animals Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnimals.map(animal => (
                  <div 
                    key={animal.id} 
                    className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {/* Image space */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={animal.image} 
                        alt={`Foto do pet ${animal.name}`}
                        className="h-full w-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Floating Gender Badge */}
                      <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        animal.gender === 'Macho' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
                      }`}>
                        {animal.gender}
                      </span>

                      {/* Floating Status Badge */}
                      <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        animal.status === 'disponível'
                          ? 'bg-green-550 bg-green-500 text-white'
                          : animal.status === 'em_processo'
                            ? 'bg-yellow-500 text-white animate-pulse'
                            : 'bg-gray-500 text-white'
                      }`}>
                        {animal.status === 'disponível' && 'Adoção Aberta'}
                        {animal.status === 'em_processo' && 'Em Análise'}
                        {animal.status === 'adotado' && 'Adotado! ♥'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-gray-900">{animal.name}</h4>
                          <span className="text-[11px] font-medium text-gray-400 bg-gray-150 py-0.5 px-2 rounded-full">
                            {animal.breed}
                          </span>
                        </div>
                        
                        {/* Tags list */}
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                            Previsão: {animal.size}
                          </span>
                          <span className="text-[9px] bg-stone-50 text-stone-800 px-1.5 py-0.5 rounded border border-stone-200">
                            {animal.age}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                            animal.vaccinated === 'Sim' 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                              : 'bg-red-50 text-red-850 border-red-150'
                          }`}>
                            Vacinação: {animal.vaccinated}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed pt-1 min-h-[44px]">
                          {animal.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 mt-4">
                        {animal.status === 'disponível' ? (
                          <button
                            onClick={() => setSelectedAdoptionAnimal(animal)}
                            className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Heart className="h-3.5 w-3.5 fill-white" /> Quero Adotar o {animal.name}
                          </button>
                        ) : animal.status === 'em_processo' ? (
                          <div className="text-center py-2 bg-yellow-50 text-yellow-800 text-xs font-semibold rounded-xl border border-yellow-200">
                            Processo de Adoção Inicializado
                          </div>
                        ) : (
                          <div className="text-center py-2 bg-green-50 text-green-800 text-xs font-semibold rounded-xl border border-green-200 flex items-center justify-center gap-1">
                            <CheckCircle className="h-4 w-4 shrink-0" /> Lar Adotivo Determinado
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Application Form Modal Background overlay */}
              <AnimatePresence>
                {selectedAdoptionAnimal && (
                  <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-amber-250 p-6 shadow-2xl relative"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-amber-700 fill-amber-700" />
                          <h4 className="text-lg font-bold text-amber-900">Adotar {selectedAdoptionAnimal.name}</h4>
                        </div>
                        <button
                          onClick={() => setSelectedAdoptionAnimal(null)}
                          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/60 mb-4 flex gap-3 text-xs leading-relaxed text-amber-900">
                        <Info className="h-4 w-4 shrink-0 stroke-amber-700" />
                        <div>
                          <strong>Por favor note:</strong> O envio desta manifestação não gera obrigação imediata de acolhida. Faremos uma entrevista para garantir a harmonia perfeita entre o peludinho e seu novo tutor.
                        </div>
                      </div>

                      <form onSubmit={handleAdoptionSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Seu Nome Completo *</label>
                            <input
                              type="text"
                              required
                              value={adopterName}
                              onChange={e => setAdopterName(e.target.value)}
                              placeholder="ex: João da Silva"
                              className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Contato Telefone/WhatsApp *</label>
                            <input
                              type="tel"
                              required
                              value={adopterPhone}
                              onChange={e => setAdopterPhone(e.target.value)}
                              placeholder="ex: (11) 99999-9999"
                              className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">E-mail para contato *</label>
                          <input
                            type="email"
                            required
                            value={adopterEmail}
                            onChange={e => setAdopterEmail(e.target.value)}
                            placeholder="ex: joao@email.com"
                            className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Residência</label>
                            <select
                              value={adopterHomeType}
                              onChange={e => setAdopterHomeType(e.target.value)}
                              className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                            >
                              <option value="Casa">Casa com quintal</option>
                              <option value="Apartamento">Apartamento seguro</option>
                              <option value="Sítio">Sítio / Chácara</option>
                              <option value="Outro">Outro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Já possui outros pets?</label>
                            <select
                              value={adopterHasPets}
                              onChange={e => setAdopterHasPets(e.target.value)}
                              className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                            >
                              <option value="Não">Não possuo</option>
                              <option value="Sim, Cães">Sim, cachorro(s)</option>
                              <option value="Sim, Gatos">Sim, gato(s)</option>
                              <option value="Ambos">Sim, cães e gatos</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Fale sobre sua rotina e experiência com animais</label>
                          <textarea
                            value={adopterDetails}
                            onChange={e => setAdopterDetails(e.target.value)}
                            placeholder="ex: Ficará sozinho poucas horas, já tive cachorros antes, etc."
                            rows={3}
                            className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div className="pt-4 flex gap-2 justify-end border-t border-gray-105">
                          <button
                            type="button"
                            onClick={() => setSelectedAdoptionAnimal(null)}
                            className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
                          >
                            Voltar
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold hover:bg-amber-800 cursor-pointer shadow-sm"
                          >
                            Enviar Solicitação Oficial
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TAB 3: TRANSPARÊNCIA FINANCEIRA */}
          {activeTab === 'transparencia' && (
            <motion.div
              key="tab-transparencia"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Financial Box overview card */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Recursos Arrecadados</div>
                  <div className="text-2xl font-extrabold text-green-700 mt-1">R$ {financialTotals.income.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" /> Doações e apoios recebidos
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Custos e Pagamentos</div>
                  <div className="text-2xl font-extrabold text-rose-700 mt-1">R$ {financialTotals.expense.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-rose-500" /> Ração, veterinário e instalações
                  </div>
                </div>

                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-150 shadow-xs">
                  <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Fundo Líquido Atual</div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">R$ {financialTotals.balance.toFixed(2)}</div>
                  <div className="text-[10px] text-emerald-800/80 mt-1">
                    Saldo disponível em conta institucional
                  </div>
                </div>
              </div>

              {/* Unified SVG dashboard charts row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Chart 1: Despesas vs Doacoes Comparison */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Proporção Fluxo de Caixa</h4>
                  
                  <div className="h-44 flex flex-col justify-end space-y-4">
                    {/* Dynamic Graphic */}
                    <div className="space-y-3">
                      {/* Donations bar */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                          <span>Doações Totais (Entradas)</span>
                          <span className="text-green-600">R$ {financialTotals.income.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-lg h-3 overflow-hidden">
                          <div 
                            className="bg-green-500 h-full rounded-lg transition-all" 
                            style={{ width: `${Math.min(100, (financialTotals.income / (financialTotals.income + financialTotals.expense || 1)) * 100)}%` }} 
                          />
                        </div>
                      </div>

                      {/* Expense bar */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                          <span>Custos Operacionais (Despesas)</span>
                          <span className="text-rose-600">R$ {financialTotals.expense.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-lg h-3 overflow-hidden">
                          <div 
                            className="bg-rose-500 h-full rounded-lg transition-all" 
                            style={{ width: `${Math.min(100, (financialTotals.expense / (financialTotals.income + financialTotals.expense || 1)) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-400 bg-slate-50 p-2.5 rounded-lg text-center font-mono">
                      Superávit Operacional: R$ {financialTotals.balance.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Chart 2: Expense Allocation by category */}
                <div className="bg-white p-5 rounded-2xl border border-gray-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Rateio de Gastos (Insumos)</h4>
                  
                  <div className="h-44 overflow-y-auto space-y-2 pr-1">
                    {categoryChartData.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400 font-mono">Sem gastos registrados</div>
                    ) : (
                      categoryChartData.map((cat, idx) => {
                        const percent = ((cat.value / (financialTotals.expense || 1)) * 100).toFixed(1);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-gray-700">
                              <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-amber-600" /> {cat.name}
                              </span>
                              <span>R$ {cat.value.toFixed(2)} ({percent}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-amber-600 h-full rounded-full" 
                                style={{ width: `${percent}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Table section header & form button */}
              <div className="flex flex-wrap gap-4 items-center justify-between border-t border-gray-100 pt-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Histórico de Caixa e Balanços</h3>
                  <p className="text-xs text-gray-500 mt-1">Conformidade com a Terceira Forma Normal (3FN) simulada</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowAddFinanceForm(p => !p)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    showAddFinanceForm 
                      ? 'bg-rose-150 text-rose-800 border-rose-300' 
                      : 'bg-amber-700 hover:bg-amber-800 text-white'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" /> {showAddFinanceForm ? 'Cancelar Lançamento' : 'Novo Lançamento'}
                </button>
              </div>

              {/* Dynamic launch form */}
              <AnimatePresence>
                {showAddFinanceForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden bg-amber-50/20 rounded-2xl border border-amber-100 p-4 md:p-5"
                  >
                    <form onSubmit={handleAddFinance} className="space-y-4">
                      <div className="flex items-center gap-1.5 text-amber-955 text-sm font-bold border-b pb-2 mb-2">
                        <PlusCircle className="h-4 w-4" /> Registro de Ativo Fixo / Lançamento de Caixa
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Tipo de Caixa</label>
                          <select
                            value={newFinanceType}
                            onChange={e => {
                              const v = e.target.value as 'donate' | 'expense';
                              setNewFinanceType(v);
                              setNewFinanceCategory(v === 'donate' ? 'Doação Geral' : 'Alimentação');
                            }}
                            className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="donate">Entrada (Doação)</option>
                            <option value="expense">Saída (Gasto / Custo)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Categoria de Livro</label>
                          <select
                            value={newFinanceCategory}
                            onChange={e => setNewFinanceCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            {newFinanceType === 'donate' ? (
                              <>
                                <option value="Doação Geral">Doação Geral via PIX</option>
                                <option value="Parcial Empresarial">Parcial Empresarial</option>
                              </>
                            ) : (
                              <>
                                <option value="Alimentação">Alimentação (Ração)</option>
                                <option value="Veterinário">Veterinário (Clínica/Exames)</option>
                                <option value="Medicamentos">Medicamentos gerais</option>
                                <option value="Infraestrutura">Infraestrutura física</option>
                                <option value="Higiene">Higiene / Banho / Limpeza</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Valor do Repasse (R$) *</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={newFinanceValue}
                            onChange={e => setNewFinanceValue(e.target.value)}
                            placeholder="ex: 150.00"
                            className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                            {newFinanceType === 'donate' ? 'Doador Solidário *' : 'Fornecedor Credenciado *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={newFinanceDonor}
                            onChange={e => setNewFinanceDonor(e.target.value)}
                            placeholder="Nome fantasia ou razão social"
                            className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Data da Operação</label>
                          <input
                            type="date"
                            required
                            value={newFinanceDate}
                            onChange={e => setNewFinanceDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Descrição Detalhada do Lançamento *</label>
                        <input
                          type="text"
                          required
                          value={newFinanceDesc}
                          onChange={e => setNewFinanceDesc(e.target.value)}
                          placeholder="ex: Doação de fardos ou repasse de vacinas contra raiva"
                          className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t">
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 cursor-pointer"
                        >
                          Concluir Lançamento
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Live search filters for table */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={financeSearch}
                    onChange={e => setFinanceSearch(e.target.value)}
                    placeholder="Filtrar por nome ou conteúdo..."
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex rounded-lg bg-gray-150 p-0.5 self-stretch sm:self-auto text-center shrink-0">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'donate', label: 'Doações' },
                    { id: 'expense', label: 'Despesas' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFinanceTypeFilter(btn.id as any)}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                        financeTypeFilter === btn.id
                          ? 'bg-amber-700 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-amber-100/40 border-b border-gray-200 text-amber-900 font-bold">
                        <th className="p-3">Data</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3">Origem/Destino</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3">Descrição</th>
                        <th className="p-3 text-right">Valor Repasse</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredFinancialEntries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 font-mono">
                            Nenhum registro financeiro encontrado com estes critérios.
                          </td>
                        </tr>
                      ) : (
                        filteredFinancialEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-amber-50/20 transition-colors">
                            <td className="p-3 font-mono text-gray-500 whitespace-nowrap">
                              {entry.date}
                            </td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                                entry.type === 'donate' 
                                  ? 'bg-green-50 text-green-705 border border-green-200' 
                                  : 'bg-rose-50 text-rose-705 border border-rose-200'
                              }`}>
                                {entry.type === 'donate' ? 'Entrada' : 'Saída'}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-gray-700 font-sans max-w-[150px] truncate" title={entry.donorOrSupplier}>
                              {entry.donorOrSupplier}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryColor(entry.category)}`}>
                                {entry.category}
                              </span>
                            </td>
                            <td className="p-3 text-gray-500 max-w-[200px] truncate" title={entry.description}>
                              {entry.description}
                            </td>
                            <td className={`p-3 text-right font-extrabold font-mono ${
                              entry.type === 'donate' ? 'text-green-600' : 'text-rose-600'
                            }`}>
                              {entry.type === 'donate' ? '+' : '-'} R$ {entry.value.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: CONTATO E COMO AJUDAR */}
          {activeTab === 'ajudar' && (
            <motion.div
              key="tab-ajudar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-12 gap-8"
            >
              {/* How to Help section (Left) */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                    <Heart className="h-5 w-5 fill-amber-700 stroke-amber-700" /> Como apoiar nossos peludinhos?
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Como projeto voluntário de extensão, dependemos exclusivamente do apoio espontâneo da comunidade.
                  </p>
                </div>

                {/* Simulated PIX dynamic generator widget */}
                <div className="p-5 rounded-2xl border border-amber-250 bg-gradient-to-br from-amber-50/20 to-orange-50/10 space-y-4">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-5 w-5 text-amber-700" />
                    <h4 className="text-sm font-bold text-amber-900">Doar em Tempo Real via PIX (Simulado)</h4>
                  </div>
                  
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Escolha um valor emblemático. O sistema simulará um pagamento real e adicionará automaticamente o valor ao livro-caixa público em <strong>Transparência Financeira</strong>!
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 50, 100].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setPixAmount(val);
                          setShowPixQR(true);
                        }}
                        className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          pixAmount === val && showPixQR
                            ? 'bg-amber-700 text-white border-amber-800'
                            : 'bg-white border-gray-200 hover:bg-amber-100 hover:text-amber-900 text-gray-700'
                        }`}
                      >
                        R$ {val}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2 text-xs text-gray-500 font-medium">Outro Valor (R$):</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Digitável"
                        value={pixAmount || ''}
                        onChange={e => {
                          setPixAmount(Math.max(0, parseFloat(e.target.value)));
                          setShowPixQR(true);
                        }}
                        className="w-full text-right pl-32 pr-4 py-1.5 border border-gray-250 bg-white rounded-lg text-xs font-extrabold focus:outline-none"
                      />
                    </div>
                    
                    {!showPixQR && (
                      <button
                        type="button"
                        onClick={() => setShowPixQR(true)}
                        className="p-2 border border-amber-700 text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Gerar Chave
                      </button>
                    )}
                  </div>

                  {/* PIX Drawer */}
                  <AnimatePresence>
                    {showPixQR && pixAmount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-white border border-dashed border-amber-250 rounded-xl space-y-4 flex flex-col items-center text-center"
                      >
                        {/* Dynamic aesthetic QR Box design */}
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 inline-block relative">
                          {/* Beautiful simulated dynamic QR code */}
                          <div className="h-32 w-32 bg-amber-900/10 flex flex-wrap p-1 gap-[3px] select-none">
                            {Array.from({ length: 49 }).map((_, i) => {
                              const isActive = (i * 7 + i % 2 + Math.floor(pixAmount)) % 3 === 0 || i < 8 || i > 40 || i % 7 === 0;
                              return (
                                <div 
                                  key={i} 
                                  className={`w-[15px] h-[15px] rounded-[1px] ${isActive ? 'bg-amber-900' : 'bg-transparent'}`} 
                                />
                              );
                            })}
                          </div>
                          
                          {/* Inner symbol sticker */}
                          <div className="absolute inset-0 m-auto h-6 w-6 bg-white border border-amber-200 rounded-lg flex items-center justify-center p-0.5 shadow-sm">
                            <Heart className="h-4 w-4 fill-amber-700 stroke-amber-750" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-widest block">Chave PIX Aleatória Lardospeludos</span>
                          <span className="text-xs font-mono font-bold bg-amber-50 px-3 py-1 rounded text-amber-900 inline-block border border-amber-100">
                            pix.lardospeludos.40b70313-d065
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`pix.lardospeludos.40b70313-d065?valor=${pixAmount}`);
                              addToast('info', 'Copiado para Área de Transferência', 'Código PIX Copie e Cole guardado!');
                            }}
                            className="bg-stone-100 text-stone-700 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 hover:bg-stone-200 transition-colors cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" /> Copiar Chave
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleDoPixPayment}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Confirmar Pagamento
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Contact Form (Right) */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4 col-span-1">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Mail className="h-4.5 w-4.5 text-amber-700" /> Canal Direto com o Abrigo
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Dúvidas sobre o acolhimento, parcerias de doação de insumos físicos (ração) ou agendamento de mutirão de banho? Deixe uma mensagem.
                  </p>

                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Seu Nome</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Carlos Alberto"
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">E-mail de Contato</label>
                      <input
                        type="email"
                        required
                        placeholder="carlos@email.com"
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Mensagem ou Proposta de Apoio</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Gostaria de doar ração ou ser um voluntário acadêmico..."
                        value={contactMessage}
                        onChange={e => setContactMessage(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-700 text-white rounded-xl py-2 text-xs font-bold hover:bg-amber-800 cursor-pointer transition-colors shadow-sm"
                    >
                      Enviar Mensagem
                    </button>
                  </form>
                </div>

                {/* Fast metadata of institution location */}
                <div className="bg-orange-50/50 p-4 rounded-xl border border-amber-100 space-y-2 text-xs">
                  <div className="font-bold text-amber-900 block uppercase tracking-wide text-[10px]">Informações Físicas do Abrigo</div>
                  <div className="text-gray-600 space-y-1.5 font-sans leading-relaxed">
                    <p className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5 text-amber-700" /> Campus Universitário Central - Bloco Veterinária-C
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-amber-700" /> Atendimento Fone: (11) 4004-9000
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-700" /> Sábados & Domingos para Visitação: 09h às 15h
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
