import { additionalCreators } from "./additional-creators";

export interface DemoAccountDefinition {
  description: string;
  email: string;
  key: string;
  name: string;
  role: "member" | "creator" | "admin" | "editor" | "moderator" | "analyst";
  userId: string;
}
export interface DemoCreatorDefinition {
  bio: string;
  category: string;
  cover: string;
  handle: string;
  location: string;
  name: string;
  photo: string;
  price: number;
  status: "ACTIVE" | "PENDING";
  story: string;
  title: string;
  userId: string;
}
export const demoCreators: DemoCreatorDefinition[] = [
  {
    bio: "Fotografia, viagens e pequenos detalhes que tornam o cotidiano especial.",
    category: "Fotografia",
    cover: "photo-1493246507139-91e8fad9978e",
    handle: "luna-demo",
    location: "São Paulo, SP",
    name: "Luna Martins",
    photo: "photo-1534528741775-53994a69daeb",
    price: 2990,
    status: "ACTIVE",
    story:
      "Saí para fotografar sem roteiro e encontrei esta luz no caminho. Gosto de guardar os intervalos: uma conversa na rua, uma sombra diferente, o instante antes da chuva. Qual detalhe chamou sua atenção hoje?",
    title: "Luz de fim de tarde, sem pressa",
    userId: "demo-luna-demo",
  },
  {
    bio: "Do primeiro esboço à obra pronta: um espaço para criar com calma.",
    category: "Arte",
    cover: "photo-1547891654-e66ed7ebb968",
    handle: "rafael-demo",
    location: "Rio de Janeiro, RJ",
    name: "Rafael Costa",
    photo: "photo-1500648767791-00dcc994a43e",
    price: 3990,
    status: "ACTIVE",
    story:
      "O desenho de hoje começou com uma forma simples. Compartilho um pouco do meu processo: fazer versões pequenas, observar o que funciona e aceitar os desvios. O resultado costuma surpreender quando deixo espaço para o acaso.",
    title: "Um caderno, três ideias e muito café",
    userId: "demo-rafael-demo",
  },
  {
    bio: "Inspiração para uma rotina mais leve, perto do mar e da natureza.",
    category: "Estilo de vida",
    cover: "photo-1470252649378-9c29740c9fa8",
    handle: "marina-demo",
    location: "Florianópolis, SC",
    name: "Marina Alves",
    photo: "photo-1524504388940-b1c1722653e1",
    price: 2490,
    status: "ACTIVE",
    story:
      "Uma caminhada cedo, preparar o café com calma e reservar alguns minutos para ler: meus rituais não precisam ser grandes para fazer diferença. Trouxe três ideias que têm me ajudado a encontrar ritmo nesta semana.",
    title: "Pequenos rituais para uma semana mais leve",
    userId: "demo-marina-demo",
  },
  {
    bio: "Canções autorais, histórias de estúdio e encontros com a música.",
    category: "Música",
    cover: "photo-1516280440614-37939bbacd81",
    handle: "caio-demo",
    location: "Belo Horizonte, MG",
    name: "Caio Oliveira",
    photo: "photo-1506794778202-cad84cf45f1d",
    price: 3490,
    status: "ACTIVE",
    story:
      "Às vezes uma música nasce de uma frase solta. Hoje voltei a um trecho antigo e encontrei um caminho novo para ele. Por aqui vou compartilhar os rascunhos, as referências e os encontros que aparecem no processo.",
    title: "A história por trás de uma melodia",
    userId: "demo-caio-demo",
  },
  {
    bio: "Um perfil de demonstração aguardando aprovação da equipe.",
    category: "Fotografia",
    cover: "photo-1500530855697-b586d89ba3ee",
    handle: "nova-criadora-demo",
    location: "Curitiba, PR",
    name: "Beatriz Santos",
    photo: "photo-1531123897727-8f129e1688ce",
    price: 1990,
    status: "PENDING",
    story:
      "Este perfil aguarda aprovação. Seu conteúdo não aparece na descoberta pública.",
    title: "Meu primeiro projeto",
    userId: "demo-role-creator-pending",
  },
];
demoCreators.push(...additionalCreators);

export const demoAccounts: DemoAccountDefinition[] = [
  {
    description:
      "Membro: feed, comentários, salvos, interesses e mensagens; sem assinatura paga.",
    email: "member@demo.privana.test",
    key: "member",
    name: "Camila Rocha",
    role: "member",
    userId: "demo-role-member",
  },
  ...demoCreators.map((creator, index) => ({
    description:
      creator.status === "PENDING"
        ? "Criadora aguardando aprovação; publicação bloqueada."
        : "Criador aprovado: perfil e estúdio; acesso ao próprio conteúdo.",
    email:
      creator.status === "PENDING"
        ? "creator-pending@demo.privana.test"
        : `${creator.handle}@demo.invalid`,
    key: index === 0 ? "creator" : `creator-${creator.handle}`,
    name: creator.name,
    role: "creator" as const,
    userId: creator.userId,
  })),
  {
    description:
      "Superadministrador local de demonstração: todas as áreas de operação.",
    email: "admin@demo.privana.test",
    key: "admin",
    name: "Administrador Demo",
    role: "admin",
    userId: "demo-role-admin",
  },
  {
    description: "Equipe editorial: rascunhos, publicação e histórico do CMS.",
    email: "editor@demo.privana.test",
    key: "editor",
    name: "Editora Demo",
    role: "editor",
    userId: "demo-role-editor",
  },
  {
    description: "Moderação de perfis, contas comuns e denúncias.",
    email: "moderator@demo.privana.test",
    key: "moderator",
    name: "Moderador Demo",
    role: "moderator",
    userId: "demo-role-moderator",
  },
  {
    description:
      "Leitura de métricas e finanças; livro financeiro vazio, sem compras inventadas.",
    email: "analyst@demo.privana.test",
    key: "analyst",
    name: "Analista Demo",
    role: "analyst",
    userId: "demo-role-analyst",
  },
];
