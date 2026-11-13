export const postFields = [
  {
    label: "Título",
    max: 160,
    name: "title",
    required: true,
    value: "Ensaio de domingo",
  },
  {
    hint: "Visível para todos, inclusive em publicações exclusivas.",
    label: "Prévia pública",
    max: 500,
    name: "excerpt",
    value: "Um novo ensaio e os detalhes que mais gostei.",
  },
  {
    label: "Sua publicação",
    max: 50_000,
    name: "body",
    required: true,
    type: "textarea",
    value:
      "Separei um ensaio especial e os bastidores desta semana. Obrigada por acompanhar meu trabalho!",
  },
  {
    label: "Quem pode ver?",
    name: "visibility",
    options: [
      { label: "Todos · publicação pública", value: "PUBLIC" },
      { label: "Somente assinantes · exclusivo", value: "SUBSCRIBERS" },
    ],
    type: "select",
    value: "SUBSCRIBERS",
  },
  {
    hint: "Opcional. Nunca use um link de mídia exclusiva aqui.",
    label: "Imagem de prévia pública (HTTPS)",
    max: 2048,
    name: "previewUrl",
    pattern: "https://.*",
    type: "url",
    value: "",
  },
  {
    hint: "JPG, PNG, WebP ou MP4, até 100 MB. Nenhum arquivo real é escolhido/enviado neste protótipo.",
    label: "Arquivo de conteúdo",
    name: "media",
    readOnly: true,
    value: "Nenhum arquivo anexado",
  },
];
