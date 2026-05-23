export interface Animal {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  age: string; // e.g. "2 meses", "1 ano"
  size: 'Pequeno' | 'Médio' | 'Grande';
  description: string;
  image: string;
  vaccinated: 'Sim' | 'Não' | 'Pendente';
  neutered: 'Sim' | 'Não';
  status: 'disponível' | 'adotado' | 'em_processo';
  gender: 'Macho' | 'Fêmea';
  breed: string; // Raça
}

export interface FinancialEntry {
  id: string;
  type: 'donate' | 'expense'; // doação ou despesa
  category: 'Alimentação' | 'Veterinário' | 'Medicamentos' | 'Infraestrutura' | 'Higiene' | 'Doação Geral' | 'Parcial Empresarial';
  value: number;
  date: string;
  description: string;
  donorOrSupplier: string; // Doador ou Fornecedor
}

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
}

export interface GreenTip {
  id: string;
  title: string;
  category: 'tecnologia_verde' | 'lixo_eletronico' | 'sustentabilidade';
  summary: string;
  content: string;
}

export interface EWasteCenter {
  id: string;
  name: string;
  city: string;
  state: 'SP' | 'RJ' | 'MG' | 'RS' | 'PR' | 'Outro';
  address: string;
  phone: string;
  accepts: string;
}
