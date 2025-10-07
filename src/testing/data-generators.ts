import {
  randUuid,
  randUrl,
  randProductCategory,
  randNumber,
} from '@ngneat/falso';

// Dados personalizados e mais realistas para o teaser de vídeo em português
const customBusinessNames = [
  'Inovações Nexus',
  'QuantumLeap IA',
  'Soluções Sinergia',
  'Cibernética Estelar',
  'Apex Digital',
  'Inovatech',
  'Dinâmicas PróximaGeração',
  'Laboratórios BioSynth',
  'Sistemas Aura',
  'Energia Helios',
];

const customDescriptions = [
  'Na Inovações Nexus, estamos pioneirando o futuro da inteligência artificial. Nossa plataforma de machine learning avançada não apenas automatiza tarefas complexas, mas também fornece insights preditivos que transformam dados brutos em decisões estratégicas, impulsionando o crescimento de negócios em escala global.',
  'A Soluções Sinergia capacita empresas para a era digital com integração em nuvem perfeita e soluções de análise de dados de ponta. Nós unificamos seus ecossistemas de software, permitindo um fluxo de informações contínuo e extraindo inteligência valiosa para otimizar operações e maximizar a receita.',
  'Em um mundo cada vez mais conectado, a Cibernética Estelar desenvolve protocolos de cibersegurança de ponta. Nossas soluções proativas defendem contra ameaças emergentes, garantindo a integridade e a confidencialidade de ativos digitais críticos para corporações e governos em todo o mundo.',
  'Estamos revolucionando a indústria fintech com sistemas de transação inovadores baseados em blockchain. Nossa tecnologia oferece segurança, transparência e eficiência sem precedentes, redefinindo a forma como as instituições financeiras operam e como as pessoas interagem com o dinheiro.',
  'A Energia Helios está liderando o avanço em energia sustentável. Por meio de tecnologias solares e biométricas avançadas, criamos soluções energéticas que não são apenas ecologicamente corretas, mas também economicamente viáveis, alimentando um futuro mais limpo e brilhante para as próximas gerações.',
  'Bem-vindo à próxima fronteira da bioengenharia. Nos Laboratórios BioSynth, estamos criando organismos sintéticos projetados para enfrentar desafios globais, desde a produção de novos medicamentos até a criação de materiais sustentáveis, moldando um amanhã mais saudável e resiliente.',
  'A Sistemas Aura é especializada em criar experiências de usuário excepcionais. Fornecemos frameworks de design UI/UX intuitivos e elegantes que simplificam a interação com aplicações de software complexas, aumentando o engajamento do usuário e a satisfação do cliente.',
  'A Dinâmicas PróximaGeração oferece automação de fluxo de trabalho inteligente para a empresa moderna. Nossa plataforma otimiza processos de negócios, elimina gargalos e libera o potencial humano, resultando em um aumento significativo de produtividade e eficiência operacional.',
  'Considere a Apex Digital seu parceiro de confiança na jornada da transformação digital. Oferecemos planejamento de recursos empresariais (ERP) e consultoria estratégica para modernizar sua infraestrutura, alinhar suas equipes e posicionar sua empresa para o sucesso a longo prazo.',
  'A Inovatech está conectando o mundo de forma segura e descentralizada. Nossos protocolos de rede e comunicação inovadores garantem a soberania dos dados e a privacidade do usuário, construindo a base para a próxima geração da internet e das interações digitais.',
];

// Helper function to shuffle an array
const shuffleArray = (arr: string[]) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const generateRanking = () => {
  const shuffledNames = shuffleArray(customBusinessNames);
  const shuffledDescriptions = shuffleArray(customDescriptions);

  return {
    id: randUuid() + Math.random(),
    url: randUrl(),
    tags: Array.from({ length: 5 }, () => randProductCategory()),
    businesses: Array.from({ length: 10 }, (_, i) => ({
      name: shuffledNames[i],
      description: shuffledDescriptions[i],
      score: randNumber({ min: 70, max: 100 }), // Higher scores for better impression
      url: randUrl(),
    })),
    createdAt: Date.now(),
  };
};

export const createRanking = <
  T extends Partial<ReturnType<typeof generateRanking>>,
>(
  overrides?: T,
) => {
  return { ...generateRanking(), ...overrides };
};
