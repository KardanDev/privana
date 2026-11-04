import {
  BarChart3,
  BookOpen,
  CreditCard,
  Flag,
  History,
  ReceiptText,
  Sparkles,
  Users,
} from "lucide-react";

export const operationsNavigation = [
  {
    description: "A comunidade em números, sem estimativas.",
    icon: BarChart3,
    id: "overview",
    label: "Visão geral",
    roles: ["admin", "analyst"],
  },
  {
    description: "Contas, acesso e responsabilidades.",
    icon: Users,
    id: "users",
    label: "Pessoas e equipe",
    roles: ["admin", "moderator"],
  },
  {
    description: "Revise perfis e cuide de quem cria.",
    icon: Sparkles,
    id: "creators",
    label: "Criadores",
    roles: ["admin", "moderator"],
  },
  {
    description: "Inspecione o conteúdo antes de tomar uma decisão.",
    icon: Flag,
    id: "reports",
    label: "Denúncias",
    roles: ["admin", "moderator"],
  },
  {
    description: "Acessos registrados na plataforma.",
    icon: CreditCard,
    id: "subscriptions",
    label: "Assinaturas",
    roles: ["admin", "analyst"],
  },
  {
    description: "Registro financeiro somente para consulta.",
    icon: ReceiptText,
    id: "transactions",
    label: "Transações",
    roles: ["admin", "analyst"],
  },
  {
    description: "Edite o rascunho. Publique quando estiver pronto.",
    icon: BookOpen,
    id: "cms",
    label: "Conteúdo e marca",
    roles: ["admin", "editor"],
  },
  {
    description: "O histórico das decisões da equipe.",
    icon: History,
    id: "audits",
    label: "Auditoria",
    roles: ["admin"],
  },
] as const;
export type OperationsSection = (typeof operationsNavigation)[number]["id"];
export const teamRoleLabels: Record<string, string> = {
  admin: "Superadministrador",
  analyst: "Analista",
  creator: "Criador",
  editor: "Editor",
  member: "Membro",
  moderator: "Moderador",
};
