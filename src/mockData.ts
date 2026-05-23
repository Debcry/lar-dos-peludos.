import { Animal, FinancialEntry, GreenTip, EWasteCenter } from './types';

export const initialAnimals: Animal[] = [
  {
    id: '1',
    name: 'Marley',
    type: 'dog',
    age: '2 anos',
    size: 'Grande',
    description: 'Muito ativo, adora correr e brincar com bolinhas. Ideal para casas com quintal espaçoso.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
    vaccinated: 'Sim',
    neutered: 'Sim',
    status: 'disponível',
    gender: 'Macho',
    breed: 'Golden Retriever Mix'
  },
  {
    id: '2',
    name: 'Pipoca',
    type: 'cat',
    age: '8 meses',
    size: 'Pequeno',
    description: 'Dócil, carinhosa e adora um colo quentinho. Já está adaptada a viver em apartamento.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    vaccinated: 'Sim',
    neutered: 'Sim',
    status: 'disponível',
    gender: 'Fêmea',
    breed: 'Vira-lata (SRD)'
  },
  {
    id: '3',
    name: 'Amora',
    type: 'dog',
    age: '1 ano',
    size: 'Médio',
    description: 'Uma companheira alegre que se dá muito bem com outros cachorros e crianças pequenas.',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    vaccinated: 'Sim',
    neutered: 'Não',
    status: 'disponível',
    gender: 'Fêmea',
    breed: 'Pastor Alemão Mix'
  },
  {
    id: '4',
    name: 'Mingau',
    type: 'cat',
    age: '3 anos',
    size: 'Médio',
    description: 'Independente e calmo. Gosta de passar o dia observando a janela e tirando longas sonecas.',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600',
    vaccinated: 'Sim',
    neutered: 'Sim',
    status: 'disponível',
    gender: 'Macho',
    breed: 'Siamês'
  },
  {
    id: '5',
    name: 'Paçoca',
    type: 'dog',
    age: '3 meses',
    size: 'Pequeno',
    description: 'Filhotinho cheio de energia e curiosidade! Precisa de paciência para adestramento inicial.',
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=600',
    vaccinated: 'Pendente',
    neutered: 'Não',
    status: 'disponível',
    gender: 'Macho',
    breed: 'Vira-lata (SRD)'
  },
  {
    id: '6',
    name: 'Luna',
    type: 'cat',
    age: '1 ano e meio',
    size: 'Médio',
    description: 'Extremamente curiosa, adora brinquedos com peninhas e interage muito com as pessoas.',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=600',
    vaccinated: 'Sim',
    neutered: 'Sim',
    status: 'em_processo',
    gender: 'Fêmea',
    breed: 'Tricolor / Calico'
  }
];

export const initialFinancialEntries: FinancialEntry[] = [
  {
    id: 'f1',
    type: 'donate',
    category: 'Doação Geral',
    value: 1500.00,
    date: '2026-05-18',
    description: 'Doação campanha solidária de Outono',
    donorOrSupplier: 'Comunidade Lardospeludos'
  },
  {
    id: 'f2',
    type: 'expense',
    category: 'Alimentação',
    value: 850.30,
    date: '2026-05-19',
    description: 'Compra de 20 fardos de ração premium cães adultos',
    donorOrSupplier: 'PetShop Distribuidora Sul'
  },
  {
    id: 'f3',
    type: 'donate',
    category: 'Parcial Empresarial',
    value: 3200.00,
    date: '2026-05-20',
    description: 'Patrocínio mensal institucional para cuidados e suporte veterinário',
    donorOrSupplier: 'Supermercado Vida Verde Ltda.'
  },
  {
    id: 'f4',
    type: 'expense',
    category: 'Veterinário',
    value: 1240.00,
    date: '2026-05-21',
    description: 'Cirurgia ortopédica corretiva e exames de imagem (Mel/Marley)',
    donorOrSupplier: 'Clínica Veterinária Dr. Silva'
  },
  {
    id: 'f5',
    type: 'expense',
    category: 'Medicamentos',
    value: 410.50,
    date: '2026-05-21',
    description: 'Antiparasitários, vacinas óctuplas e vermífugos gerais',
    donorOrSupplier: 'FarmaVet São Judas'
  },
  {
    id: 'f6',
    type: 'donate',
    category: 'Doação Geral',
    value: 350.00,
    date: '2026-05-22',
    description: 'Apoio espontâneo via PIX para custos gerais de manutenção',
    donorOrSupplier: 'Mariana de Souza Antunes'
  },
  {
    id: 'f7',
    type: 'expense',
    category: 'Infraestrutura',
    value: 620.00,
    date: '2026-05-22',
    description: 'Reparo hidráulico nas canaletas de lavagem dos canis do bloco B',
    donorOrSupplier: 'Materiais de Construção União'
  }
];

export const initialGreenTips: GreenTip[] = [
  {
    id: 't1',
    title: 'Descarte Correto de Smartphones Antigos',
    category: 'lixo_eletronico',
    summary: 'Celulares contêm metais pesados como lítio e cobalto que poluem severamente o solo se jogados no lixo comum.',
    content: 'Antes de descartar seu celular antigo, faça um backup de seus dados e realize a restauração de fábrica. Procure ecopontos especializados na sua cidade ou retorne o aparelho ao fabricante através da logística reversa, garantindo que precioso cobalto e placas de silício voltem para a indústria limpa.'
  },
  {
    id: 't2',
    title: 'Redução do Vampirismo de Energia das Tomadas',
    category: 'tecnologia_verde',
    summary: 'Aparelhos em modo de espera (standby) representam até 12% do consumo elétrico residencial médio.',
    content: 'O chamado "consumo vampiro" ocorre quando carregadores, micro-ondas, TVs e computadores continuam consumindo pequenas correntes mesmo desligados, contanto que fiquem conectados à tomada. Utilize filtros de linha com chaves liga/desliga para cortar a energia do conjunto de uma vez à noite, economizando custos e reduzindo a pegada ecológica.'
  },
  {
    id: 't3',
    title: 'A Importância do Descarte de Baterias e Pilhas',
    category: 'lixo_eletronico',
    summary: 'Chumbo, cádmio e mercúrio presentes em pilhas comuns contaminam o lençol freático por séculos.',
    content: 'Pilhas e baterias portáteis nunca devem ser misturadas ao lixo doméstico reciclável ou orgânico. Quando rompidas em aterros, liberam metais tóxicos bioacumulativos. Armazene as pilhas gastas em um pote plástico seco em casa e depois leve-as a pontos de coleta em supermercados ou farmácias parceiras de programas de reciclagem setorial.'
  },
  {
    id: 't4',
    title: 'Eficiência de Eletrodomésticos com Selo Procel A',
    category: 'tecnologia_verde',
    summary: 'Escolher eletrodomésticos corretos reduz consideravelmente as emissões indiretas da matriz elétrica nacional.',
    content: 'Ao adquirir geladeiras, ares-condicionados e máquinas de lavar, dê preferência absoluta aos equipamentos com Selo Procel A de Eficiência Energética e tecnologia Inverter. A tecnologia inverter evita o liga-desliga do compressor, reduzindo o consumo de energia em até 40% em relação aos modelos convencionais.'
  },
  {
    id: 't5',
    title: 'E-Waste: O Ouro Escondido nos Nossos Equipamentos',
    category: 'sustentabilidade',
    summary: 'A mineração urbana de lixo eletrônico é até 50 vezes mais rica em metais preciosos do que minas subterrâneas.',
    content: 'Uma tonelada de placas de circuito impresso de celulares antigos pode conter até 150g de ouro de alta pureza, além de cobre e prata. Incentivar a reciclagem cooperativa local ajuda a criar empregos verdes, reduz a mineração destrutiva primária e recupera semicondutores e plásticos reciclados para novas tecnologias ecológicas.'
  }
];

export const initialEWasteCenters: EWasteCenter[] = [
  {
    id: 'c1',
    name: 'Ecoponto Eletrônicos Centro-Sul (SP)',
    city: 'São Paulo',
    state: 'SP',
    address: 'Av. Paulista, 1200 - Bela Vista (Próximo ao Metrô Trianon)',
    phone: '(11) 3289-4455',
    accepts: 'Celulares, Notebooks, Carregadores, Pilhas, Cabos e Monitores.'
  },
  {
    id: 'c2',
    name: 'CoopRecicla Eletrônica Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua Cardeal Arcoverde, 450 - Pinheiros',
    phone: '(11) 3816-1212',
    accepts: 'Teclados, Impressoras, CPUs antigas, Baterias de Carro e Eletrodomésticos menores.'
  },
  {
    id: 'c3',
    name: 'Associação Verde de Descarte (RJ)',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Rua do Catete, 150 - Catete',
    phone: '(21) 2554-9090',
    accepts: 'Celulares, Tablets, Cabos HDMI, Fontes, Roteadores e TV Tubo/LCD.'
  },
  {
    id: 'c4',
    name: 'Recicla-MG Tecnologia e Ambiente',
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Av. do Contorno, 5600 - Savassi',
    phone: '(31) 3224-8800',
    accepts: 'Laptops, Estabilizadores, No-breaks, Pilhas alcalinas, Placas-mãe de computador.'
  },
  {
    id: 'c5',
    name: 'Ponto Ecológico POA Sul',
    city: 'Porto Alegre',
    state: 'RS',
    address: 'Av. Ipiranga, 4400 - Praia de Belas',
    phone: '(51) 3320-1122',
    accepts: 'Micro-ondas, Monitores CRT/LED, Celulares quebrados, Processadores velhos.'
  }
];
