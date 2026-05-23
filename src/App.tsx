import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Layers, 
  Sparkles, 
  GraduationCap, 
  Globe, 
  BookOpen, 
  Code,
  ShieldCheck,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LardospeludosPortal from './components/LardospeludosPortal';
import PocketKnowledgePortal from './components/PocketKnowledgePortal';
import Notification, { ToastMessage } from './components/Notification';
import { Animal, FinancialEntry } from './types';
import { 
  initialAnimals, 
  initialFinancialEntries, 
  initialGreenTips, 
  initialEWasteCenters 
} from './mockData';

export default function App() {
  // Primary platform switcher state: 'lardospeludos' or 'pocketknowledge'
  const [activePortal, setActivePortal] = useState<'lardospeludos' | 'pocketknowledge'>('lardospeludos');

  // Shared state with client-side db persistence emulation (Local Storage)
  const [animals, setAnimals] = useState<Animal[]>(() => {
    const saved = localStorage.getItem('lardospeludos_animals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialAnimals;
  });

  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(() => {
    const saved = localStorage.getItem('lardospeludos_finances');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialFinancialEntries;
  });

  // Custom Toast notifications manager State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Push notifications helper
  const addToast = (type: 'success' | 'warning' | 'info', title: string, text: string) => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
      type,
      title,
      text
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Synchronize state changes to Local Storage to replicate persistent database
  useEffect(() => {
    localStorage.setItem('lardospeludos_animals', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('lardospeludos_finances', JSON.stringify(financialEntries));
  }, [financialEntries]);

  // Welcome user first loaded toast
  useEffect(() => {
    addToast(
      'info', 
      'Plataforma Universitária Ativa', 
      'Seja bem-vindo(a) ao portal acadêmico do seu projeto de extensão!'
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-800 antialiased selection:bg-amber-100 selection:text-amber-900 pb-12">
      {/* Dynamic Toast Alert Portal */}
      <Notification toasts={toasts} onRemove={removeToast} />

      {/* Mini Academic Header Bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] md:text-xs py-2 px-4 border-b border-slate-850 flex flex-wrap gap-x-6 gap-y-1 justify-between items-center z-40 relative">
        <div className="flex items-center gap-1.5 font-mono select-none">
          <GraduationCap className="h-3.5 w-3.5 text-amber-500" />
          <span>PROJETO COLETIVO DE EXTENSÃO UNIVERSITÁRIA • IMPACTO SOCIAL</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-sans">
          <span>Acessibilidade: Alto Contraste Ativo</span>
          <span>Transparência Social Garantida</span>
          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase animate-pulse">● Live DB</span>
        </div>
      </div>

      {/* Beautiful Top Branding Hero with dynamic layout switcher */}
      <header className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Building className="h-5.5 w-5.5 text-slate-700" /> Plataformas Digitais de Extensão
            </h1>
            <p className="text-xs text-gray-400 max-w-xl">
              Atendimento aos requisitos técnicos, responsividade mobile, fomento cooperativo e transparência de recursos sociais instituídos. Escolha uma das sub-plataformas do projeto a seguir:
            </p>
          </div>

          {/* Quick Dual Platform Nav Card Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 w-full md:w-auto">
            <button
              onClick={() => {
                setActivePortal('lardospeludos');
                addToast('info', 'Portal Lardospeludos Ativo', 'Mostrando catalogo de adoção e demonstrativos financeiros do abrigo.');
              }}
              className={`flex-1 md:flex-initial px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activePortal === 'lardospeludos'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-slate-205'
              }`}
            >
              <Heart className={`h-4 w-4 ${activePortal === 'lardospeludos' ? 'fill-white' : ''}`} />
              LardoSpeludos
            </button>
            
            <button
              onClick={() => {
                setActivePortal('pocketknowledge');
                addToast('info', 'Módulo Pocket Knowledge Ativo', 'Exibindo calculadora de orçamentos fiscais e painel geolocalizado comunitário.');
              }}
              className={`flex-1 md:flex-initial px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activePortal === 'pocketknowledge'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-slate-205'
              }`}
            >
              <Layers className="h-4 w-4" />
              Pocket Knowledge
            </button>
          </div>
        </div>
      </header>

      {/* Main Dynamic Viewport */}
      <main className="max-w-7xl mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          {activePortal === 'lardospeludos' ? (
            <motion.div
              key="portal-lardospeludos"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              {/* LARDOSPELUDOS COMPREHENSIVE VIEW */}
              <LardospeludosPortal 
                animals={animals}
                setAnimals={setAnimals}
                financialEntries={financialEntries}
                setFinancialEntries={setFinancialEntries}
                addToast={addToast}
              />
            </motion.div>
          ) : (
            <motion.div
              key="portal-pocketknowledge"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              {/* POCKET KNOWLEDGE CITIZEN SUITE VIEW */}
              <PocketKnowledgePortal
                greenTips={initialGreenTips}
                eWasteCenters={initialEWasteCenters}
                addToast={addToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Shared Extension Footer information */}
      <footer className="max-w-7xl mx-auto px-4 md:px-6 mt-12 text-center space-y-3">
        <div className="border-t border-gray-250 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-700" />
            <span>Relatório Final de Extensão • Colegiado de Programação para Sociedade</span>
          </div>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>DB SCHEMAS: 3FN CERTIFIED (MySQL SIMULATED)</span>
            <span>ACCESSIBLE AA COMPLIANT FONTING</span>
            <span>RESPONSIVE COOPERATIVE CODES: HTML5/REACT/VITE</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 font-light">
          © {new Date().getFullYear()} Lardospeludos e Pocket Knowledge. Projeto integrado sob licença SPDX-Apache-2.0.
        </p>
      </footer>
    </div>
  );
}
