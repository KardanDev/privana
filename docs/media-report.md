# Mídia privada

## Configuração

Crie um bucket **privado** no Upstash Blob e configure `UPSTASH_BLOB_TOKEN` no ambiente do aplicativo, inclusive no desenvolvimento local. Nunca coloque esse segredo no código nem em variáveis públicas. A integração usa o SDK oficial `@upstash/blob`; a dependência Vercel Blob foi removida. O servidor recusa assinar novos uploads quando o token pertence a um bucket público.

`BETTER_AUTH_URL` deve corresponder à origem exata usada no navegador. Em previews da Vercel, configure a URL exata do deployment. As requisições autenticadas por cookie verificam essa origem; não há liberação por domínio curinga ou por cabeçalhos de host enviados pelo cliente.

O token de armazenamento é opcional para iniciar e compilar o aplicativo. Sem ele, as ações de armazenamento retornam HTTP 503 com uma mensagem em português. Não há fallback público nem simulação de upload bem-sucedido.

## Fluxo e limites

- `POST /api/media/upload` usa `uploadHandler` e autentica a conta/origem em cada fase, inclusive retries e finalização. Apenas contas ativas com perfil de criador aprovado (`ACTIVE`) podem enviar arquivos.
- O servidor escolhe uma chave nova no formato `userId/uuid-v4.ext`; o navegador não escolhe caminhos de destino. A política aceita JPEG, PNG, WebP e MP4 com conteúdo não vazio de até 100 MiB. O SDK aplica as restrições ao autorizar o upload.
- O navegador usa `@upstash/blob/browser` para enviar os bytes diretamente ao bucket privado por multipart. O token do bucket nunca é enviado ao cliente. As publicações guardam a chave interna, não uma URL de armazenamento.
- `POST /api/media/complete` verifica novamente a conta, a origem e a propriedade da chave. `bucket.info` consulta caminho, MIME, tamanho e metadado de proprietário no armazenamento. Antes de registrar o `MediaAsset`, o servidor lê os primeiros 32 bytes armazenados e confere a assinatura JPEG, PNG, WebP ou MP4. A conclusão é idempotente; o registro usa `upsert`. Falhas transitórias ao registrar no banco não apagam o objeto recém-enviado.
- O JSON de controle de upload e de confirmação tem limite de 16 KiB, inclusive quando não há `Content-Length`.
- A assinatura/finalização multipart pertence ao protocolo do SDK Upstash. Não existe callback Vercel sem autenticação por cookie.
- `GET /api/media/[postId]` consulta a política do backend antes de ler o Blob. Isso inclui o estado da conta, publicação, criador e validade da assinatura. Os bytes são transmitidos pelo servidor, com `Cache-Control: private, no-store`, `Vary: Cookie`, MIME permitido e `nosniff`. Não há redirecionamento para a URL privada.

## Vídeo e operação

A entrega aceita um único intervalo `Range` de bytes. O servidor cria uma URL de leitura de dois minutos e a usa internamente para buscar o objeto; essa URL não é devolvida ao navegador. A leitura confere o proprietário e usa `If-Match` com o ETag consultado para evitar mudança do arquivo entre a validação e o streaming. Apenas o intervalo validado é encaminhado à leitura. Respostas parciais retornam HTTP 206 com `Content-Range` e o tamanho parcial correto; intervalos múltiplos ou não atendíveis retornam HTTP 416. Metadados de intervalo inconsistentes são recusados antes de liberar o stream.

Os testes locais cobrem propriedade do caminho, MIME e tamanho, origem, limite de JSON, erros HTTP, recusa antes de ler o Blob, confirmação por metadados reais, autenticação antes de acessar o SDK, streaming e intervalos. Eles não usam credenciais reais.

Em 4 de novembro de 2026, o teste no navegador enviou uma imagem pelo estúdio para o bucket privado Upstash e publicou uma postagem exclusiva. A criadora autenticada visualizou a imagem; a leitura de `bytes=0-15` retornou HTTP 206, `Content-Range: bytes 0-15/10314`, exatamente 16 bytes e `Cache-Control: private, no-store, max-age=0`. Esse teste comprova upload/registro/entrega real de imagem e suporte a intervalos; não comprova codecs ou transcodificação de todos os vídeos MP4.

A conferência de assinatura valida o formato básico; ela não é inspeção de malware nem moderação. Não há transcodificação, moderação automática ou limpeza automática de uploads abandonados. Configure retenção e limpeza operacional de arquivos sem publicação antes de operar em escala. Limites de execução e transferência do plano de hospedagem continuam aplicáveis ao streaming pelo servidor.
