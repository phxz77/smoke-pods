# Painel administrativo — passo a passo

Este guia liga o site ao seu projeto Supabase e habilita o painel em `/admin`.
Tudo deve levar uns 10 minutos.

## 1. Pegar URL e anon key do Supabase

1. Abra https://app.supabase.com e entre no seu projeto.
2. Vá em **Project Settings → API**.
3. Copie:
   - **Project URL** (vira `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** (vira `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (não comite!) com:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-ANON-KEY
```

Na Vercel, adicione as duas variáveis em **Settings → Environment Variables**
(escopo Production, Preview e Development) e faça um redeploy.

## 3. Rodar o SQL do banco

1. No Supabase, abra **SQL Editor → New query**.
2. Cole o conteúdo de `supabase/migrations/0001_init.sql`.
3. Clique em **Run**. Isso cria:
   - tabela `produtos` (com status calculado automaticamente do estoque),
   - políticas de RLS (público lê, somente logado escreve),
   - bucket de Storage `produtos-imagens` (público) com políticas equivalentes,
   - publicação Realtime para a tabela.

(Opcional) Para popular com o catálogo atual: rode `supabase/seed.sql` da mesma forma.

## 4. Criar o usuário administrador

1. No Supabase, abra **Authentication → Users → Add user → Create new user**.
2. Email: `adm01@smokepods.com`
3. Senha: escolha uma senha forte (você usará no login).
4. Marque **Auto Confirm User** para já liberar o login.
5. Clique em **Create user**.

> Não há cadastro público. Para criar outros admins, basta repetir esse passo —
> as policies só verificam se a sessão é autenticada.

## 5. Subir o site

```bash
npm install
npm run dev
```

- Loja pública: http://localhost:3000
- Painel: http://localhost:3000/admin/login

Faça login com `adm01@smokepods.com` + senha. Você será redirecionado para
`/admin/dashboard`.

## 6. O que o painel faz

- **Dashboard** (`/admin/dashboard`): total de produtos, ativos, esgotados,
  unidades em estoque e tabela com últimos itens alterados.
- **Produtos** (`/admin/produtos`):
  - Listagem com busca por nome/modelo/sabor.
  - Botão **Novo produto** → formulário completo (Nome, Modelo, Sabor,
    Categoria, Descrição, Preço, Preço "de", Estoque, Puffs, Imagem).
  - Clicar em qualquer linha → editar.
  - Ícone de lixeira → exclui produto e a imagem do Storage.
- **Imagens**: o uploader manda a imagem direto para o bucket
  `produtos-imagens` e salva a URL pública no campo `imagem_url`.

## 7. Como aparece no site

- O site lê os produtos direto do Supabase via `useProducts()`
  (`lib/use-products.ts`).
- Há assinatura Realtime: qualquer mudança no painel aparece no site
  na mesma hora, sem deploy.
- Os produtos com o mesmo `modelo` aparecem como **um card só** com seletor
  de sabor. Cada sabor é uma linha separada no banco, com estoque próprio.

## 8. Regras de status

- `estoque > 0` → status `disponivel` (badge verde "Disponível").
- `estoque = 0` → status `esgotado` (badge vermelha "Esgotado").
- O cálculo é feito por uma coluna gerada no banco — não dá para o admin
  setar o status manualmente, ele sempre acompanha o estoque.

## 9. Segurança

- A tabela e o bucket usam **Row Level Security (RLS)**.
- Público (sem login) só consegue `SELECT`.
- Apenas a sessão autenticada do admin pode `INSERT`, `UPDATE`, `DELETE` e
  enviar/remover imagens.
- O middleware (`proxy.ts`) protege todas as rotas `/admin/*` e redireciona
  para o login se não houver sessão.

## 10. Resolvendo problemas comuns

- **"Catálogo não conectado ao Supabase" no site**: variáveis não setadas
  ou servidor não foi reiniciado depois de criar o `.env.local`.
- **"Email ou senha incorretos"**: confira se você marcou *Auto Confirm User*
  ao criar o admin; se esqueceu, edite o usuário e confirme.
- **Imagem não envia**: verifique se rodou o SQL inteiro (o bucket
  `produtos-imagens` precisa existir e estar `public`).
- **Realtime não atualiza**: o SQL já habilita realtime na tabela; se ainda
  não funcionar, vá em **Database → Replication → supabase_realtime** e
  confirme que `produtos` está na publicação.
