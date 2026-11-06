# Privana

Marketplace de comunidades e criadores em português do Brasil, com interface roxa, contas por e-mail e dados persistidos no PostgreSQL. Usa Next.js 16, React 19, Better Auth 1.7.10, oRPC, Prisma 7, shadcn/Base UI, Bun e Turborepo.

O planejamento atual está no [roadmap](docs/planning/roadmap.md), com [índice dos issues no Linear](docs/planning/linear-index.md) e [decisões de escopo](docs/planning/scope-and-decisions.md). A implementação desta etapa cobre somente M01, a base de entrega e validação. Consulte também os guias de [contribuição](docs/contributing.md), [testes](docs/testing.md) e [deploy](docs/deployment.md).

## Produto

- Descoberta por busca/categoria, perfis de criadores, feed, publicações públicas e exclusivas, seguir, curtir, salvar e comentar.
- Conversas privadas persistidas, notificações, biblioteca e preferências da conta.
- Cadastro, confirmação de e-mail, login e recuperação de senha; confirmação obrigatória e limites de tentativas persistidos.
- Estúdio para perfil, rascunhos, publicação, mídia e métricas dos dados existentes.
- Administração com papéis de proprietário, editor, moderador e analista; gestão de usuários, criadores, denúncias, assinaturas, transações e auditoria.
- CMS com marca, cores, navegação, descoberta, páginas, avisos e recursos; rascunho, publicação, histórico e restauração com proteção contra edições simultâneas.
- Upload privado e entrega de mídia autorizada no servidor. Conteúdo exclusivo é omitido das respostas sem acesso.

**Pagamentos reais estão adiados.** `/checkout/demo` oferece uma simulação com cartão de teste, Pix ilustrativo e preços de exemplo em BRL, USD e EUR. A simulação não cobra, ativa assinaturas ou libera conteúdo. A ação de interesse nos perfis apenas registra interesse no lançamento. Polar foi removido das dependências e configurações. Veja [o fluxo de demonstração](docs/payment-demo.md) e [a pesquisa de provedores](docs/payments-research.md).

## Executar localmente

Requisitos: Bun **1.3.14**, Node.js compatível com Next.js 16 e um banco **Prisma Postgres na nuvem**. O projeto usa `@prisma/adapter-ppg`: obtenha no console do Prisma a **URL de conexão direta TCP**, no formato `postgres://…@…:5432/…?sslmode=require`. Preserve as credenciais e parâmetros fornecidos pelo console. Não substitua por uma URL HTTP/Accelerate ou por um banco local.

1. Execute `bun install --frozen-lockfile`.
2. Copie [apps/web/.env.example](apps/web/.env.example) para `apps/web/.env` somente se esse arquivo ainda não existir. Preencha `DATABASE_URL`, gere `BETTER_AUTH_SECRET` e confira `BETTER_AUTH_URL=http://localhost:3001`.
3. Gere os tipos de ambiente e o cliente Prisma:

```sh
bun run env:generate
bun run db:generate
```

4. Confirme a conexão com `bun run db:inspect`. Se o Prisma retornar `Unauthorized`, atualize `DATABASE_URL` com uma conexão direta válida do console antes de continuar.
5. Para um banco vazio, aplique as migrações versionadas:

```sh
bun run db:migrate:deploy
```

A migração inicial também cria as tabelas de autenticação. Um banco que já contém tabelas do starter precisa de revisão de baseline ou migração incremental antes dessa etapa. Não é necessário apagar ou recriar o banco.

6. Inicie o aplicativo:

```sh
bun run dev:web
```

Abra [localhost:3001](http://localhost:3001). `bun run dev` e `bun run start:dev` também iniciam as tarefas de desenvolvimento do monorepo. `start:dev` é um alias de desenvolvimento. Sem registros, o produto mostra estados vazios; erros de conexão não são substituídos por demonstrações.

## Ambiente e integrações

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | URL direta TCP do Prisma Postgres da aplicação. Obrigatória. |
| `BETTER_AUTH_SECRET` | Segredo aleatório de pelo menos 32 caracteres, estável entre instâncias. Obrigatório. |
| `BETTER_AUTH_URL` | Origem exata do aplicativo, incluindo protocolo e porta local. |
| `EMAIL_DELIVERY_MODE` | `preview` no desenvolvimento ou `resend` para entrega real. Produção recusa `preview`. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Necessários para `resend`; remetente de domínio verificado. |
| `UPSTASH_BLOB_TOKEN` | Token do bucket **privado** Upstash Blob, necessário para operações de mídia. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | URL REST e token do Upstash Redis para limites compartilhados de autenticação. Configure ambos. |

Os schemas ficam em `apps/web/.env.schema` e `packages/db/.env.schema`; o banco importa as variáveis da aplicação. `bun run env:generate` atualiza tipos, sem criar credenciais. Bun não carrega `.env` automaticamente neste repositório: a integração Next.js/Varlock e os comandos do projeto fazem o carregamento. Não versione segredos nem use prefixos públicos para chaves de serviços.

**E-mail local:** use `EMAIL_DELIVERY_MODE=preview`. Após cadastro ou recuperação, abra o HTML mais recente em `apps/web/.local-mail/` e use o link. A pasta é ignorada pelo Git e contém links temporários de acesso; limpe os arquivos após testar. Nenhum e-mail externo é enviado nesse modo. Confirmação expira em uma hora; recuperação, em 30 minutos. A redefinição de senha revoga sessões existentes.

**E-mail em produção:** configure `resend`, a chave e o remetente, e publique os registros de autenticação do domínio indicados pelo Resend. A entrega usa o SDK oficial do Resend no servidor, com idempotência, timeout e tratamento dos erros retornados pelo SDK. Falta de configuração impede ações dependentes de e-mail com uma mensagem útil; páginas públicas e builds não precisam inicializar o provedor. Não há fila automática de reenvio. O MCP Resend está declarado nos arquivos de configuração; reinicie/reconecte o cliente MCP para disponibilizá-lo quando necessário.

**Redis:** a instância Upstash usada no desenvolvimento fica em São Paulo (`sa-east-1`). O SDK HTTP executa uma operação atômica para conferir e incrementar os limites de autenticação, compartilhados entre instâncias Vercel. As chaves usam identificadores protegidos por HMAC e expiram automaticamente. Sessões e permissões continuam no Prisma. Sem as duas configurações Redis, o aplicativo usa o limite persistido no banco; uma configuração parcial é recusada.

**Mídia:** conecte um bucket privado do Upstash Blob. Sem token, ações de armazenamento retornam indisponibilidade. São aceitos JPEG, PNG, WebP e MP4 de até 100 MiB. O navegador envia os bytes diretamente ao bucket por upload multipart; o servidor confere propriedade e metadados reais antes de registrar o arquivo. A leitura usa autorização e streaming privado, inclusive intervalos de bytes. URLs assinadas de leitura ficam no servidor. Consulte [docs/media-report.md](docs/media-report.md).

## Conta proprietária

Cadastre a conta pretendida e confirme seu e-mail. Então execute deliberadamente, na raiz:

```sh
bun run owner:bootstrap owner@example.com
```

O comando carrega a configuração da aplicação e promove somente uma conta existente, confirmada e ativa para o papel servidor `admin`, registrando auditoria. Não existe regra de primeiro usuário nem campo público para conceder administração. O acesso de super-admin fica em `/admin`. Veja [docs/auth-report.md](docs/auth-report.md).

## Dados de demonstração

O seed é opcional, idempotente e limitado a um banco de desenvolvimento. Cria 18 contas verificadas com senhas individuais aleatórias, 13 perfis e mais de 150 publicações, além de conversas, comentários e exemplos de moderação. Inclui cliente, modelos/criadores, proprietário, editor, moderador e analista. Não cria pagamentos ou assinaturas ativas. Exige `ALLOW_DEMO_SEED=1` e recusa produção. Históricos são gravados em lotes por criador para respeitar os limites de transação na nuvem; uma execução interrompida pode ser repetida com as mesmas credenciais.

PowerShell:

```powershell
$env:NODE_ENV = "development"
$env:ALLOW_DEMO_SEED = "1"
bun run db:seed:demo
Remove-Item Env:ALLOW_DEMO_SEED
```

Em shells POSIX: `ALLOW_DEMO_SEED=1 bun run db:seed:demo`. O seed escreve no banco configurado; não o inclua no build ou no deploy.

Após sucesso, as credenciais ficam em `apps/web/.local-demo-credentials.json`, ignorado pelo Git. Use apenas um arquivo com `status: "ready"`. As senhas são reutilizadas em execuções seguintes. Consulte [as contas e permissões](docs/demo-accounts.md).

## Comandos e estrutura

| Comando na raiz | Função |
| --- | --- |
| `bun run dev:web` | Inicia somente a aplicação web na porta 3001. |
| `bun run dev` / `bun run start:dev` | Inicia desenvolvimento pelo Turborepo. |
| `bun run build` | Compila pacotes e aplicativo. |
| `bun run --cwd apps/web start` | Serve um build de produção existente. |
| `bun run test` | Executa testes de backend, autenticação, seed, mídia, CMS e checkout com fixtures locais. |
| `bun run test:smoke` | Verifica logins e fluxos HTTP locais com as contas demo; exige `ALLOW_DEMO_SMOKE=1`. |
| `bun run --cwd packages/auth email:check` | Testa o SDK Resend com o destinatário de simulação oficial. |
| `bun run --cwd packages/auth email:check-auth` | Verifica cadastro, confirmação, recuperação e login pelo handler real; exige `ALLOW_EMAIL_CHECK=1` e usa somente o simulador Resend. |
| `bun run check-types` | Verifica TypeScript no monorepo. |
| `bun run check` / `bun run fix` | Verifica ou aplica padrões Ultracite. |
| `bun run db:generate` | Regenera o cliente Prisma. |
| `bun run db:migrate` | Cria/aplica migrações de desenvolvimento. |
| `bun run db:migrate:deploy` | Aplica migrações versionadas no banco configurado. |
| `bun run db:inspect` | Inspeciona conexão e estado do banco. |
| `bun run db:studio` | Abre o Prisma Studio. |

`apps/web/src/domains/` organiza interfaces por domínio; `shared/` reúne a estrutura visual. `packages/api/` contém procedimentos e autorização; `packages/auth/`, autenticação e e-mails; `packages/db/`, schema e migrações; `packages/ui/`, componentes e tokens. Importações de UI são diretas, por exemplo `@privana/ui/components/button`.

## Vercel

O [vercel.json](vercel.json) na raiz define o serviço `web` com root `apps/web`, instalação por Bun na raiz e build que gera o cliente Prisma antes de compilar o aplicativo. O tráfego é encaminhado ao serviço web. Mantenha essa configuração no fluxo Vercel Services.

1. Vincule o projeto com `bun run deploy:setup`.
2. Configure em Preview/Production a conexão Prisma Postgres, o segredo, Resend, Upstash Redis e o bucket privado Upstash Blob. Configure `BETTER_AUTH_URL` com a origem HTTPS exata; o schema pode usar os metadados de URL da Vercel sem um valor explícito. Não use curingas para contornar a validação de origem.
3. Aplique migrações ao banco correto em etapa controlada com `bun run db:migrate:deploy`. O build não aplica migrações nem seed.
4. Use `bun run deploy:check` para verificar o deploy localmente, `bun run deploy` para publicar um preview e `bun run deploy:prod` para publicar em produção. `bun run dev:vercel` inicia o ambiente local Vercel.

`bun run env:preview` e `bun run env:production` sincronizam variáveis declaradas de arquivos locais e aceitam um caminho de arquivo específico. Esses comandos escrevem na configuração Vercel. Não sincronizam `BETTER_AUTH_URL` nem `NODE_ENV`: configure a URL na plataforma ou use o valor derivado pelo schema. Ajuste `EMAIL_DELIVERY_MODE` para `resend` antes de sincronizar um arquivo local para ambientes hospedados. Arquivos `.env` locais não são publicados automaticamente.

## Validação e limites

Os testes cobrem autorização, suspensão, isolamento de conversas, conteúdo exclusivo, mídia, e-mail e elegibilidade do proprietário. Eles não comprovam credenciais, entrega real de e-mail, upload/reprodução em Blob ou uma implantação Vercel. Valide esses fluxos com os serviços configurados antes do lançamento; falhas de autenticação do banco exigem renovar a conexão no console do Prisma.

As credenciais demo e os fluxos HTTP locais também são verificados separadamente. Consulte [o estado atual de integração](docs/verification.md) para distinguir os testes automatizados, verificações do banco real e serviços externos ainda pendentes.

Pagamentos/repasses, verificação de identidade por provedor, transcodificação, transmissões ao vivo e limpeza automática de uploads abandonados permanecem fora desta entrega. Consulte os relatórios em [docs/](docs/) para contratos, decisões e evidências de validação.
