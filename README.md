# AluraGeek &ndash; 3º Alura Challenge de Front-end

<div align="center">
  <img style="width: 300px;" src="./public/svg/logo.svg" alt="Logo AluraGeek" />
</div>
<br />

O AluraGeek é o terceiro challenge de front-end e consiste em uma plataforma e-commerce focado em produtos do universo geek.

O desafio é uma simulação do dia a dia de trabalho de um desenvolvedor front-end. Nele, utilizamos um design feito no Figma para construir aplicação do zero com as tecnologias que preferir, baseando-se em cumprir metas semanais divididas em 4 semanas.

Quer saber mais sobre o challenge? Acesse a [página oficial](https://www.alura.com.br/challenges/front-end-3?host=https://cursos.alura.com.br)!

Link do meu projeto: [https://alura-geek-heitorlisboa.vercel.app](https://alura-geek-heitorlisboa.vercel.app)

## ✅ Metas

- [x] Semana 1 &ndash; Concluída!
- [x] Semana 2 &ndash; Concluída!
- [x] Semana 3 &ndash; Concluída!
- [ ] Semana 4 &ndash; Em andamento!

🚧 **PROJETO EM CONSTRUÇÃO** 🚧

**Nota**: Com exceção do gerenciamento das categorias de produtos, todas as funcionalidades já estão prontas, as demais modificações no projeto serão apenas ajustes de UI/UX.

## 👨‍💻 Tecnologias/serviços utilizadas

- TypeScript
- Next.js
- Sass
- CSS Modules
- Prisma ORM
- Cloudinary
- PlanetScale
- GitHub OAuth

## ✨ Features

- Sistema de busca de produtos
- Login com GitHub
- [CRUD](## "Create, Read, Update, Delete") de produtos
- [SSG](## "Static Site Generation"), [ISR](## "Incremental Static Regeneration") e [SSR](## "Server Side Rendering")

## ❓ Como utilizar
### 💻 Inicializando localmente
#### Pré-requisitos
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (instale com `npm i -g yarn`)

Primeiro, crie uma pasta, clone o repositório dentro dela e depois entre na pasta.
```sh
mkdir alura-geek

git clone https://github.com/heitorlisboa/alura-geek.git alura-geek

cd alura-geek
```

Após isso, instale as dependências da aplicação e crie um arquivo `.env` na raíz do projeto (recomendo copiar o `.env.example`).
```sh
yarn

# Para rodar esse comando no Windows use o PowerShell, WSL ou Git bash
cp .env.example .env
```

Com o arquivo criado, abra o projeto com seu editor de código favorito, depois, abra o arquivo `.env` e substitua os valores de exemplo das variáveis de ambiente pelos seus.

Guias úteis para essa operação:
- [Variáveis de ambiente do NextAuth.js](https://next-auth.js.org/configuration/options)
- [Cadastrando um app OAuth GitHub](https://docs.github.com/pt/developers/apps/building-oauth-apps/creating-an-oauth-app)

**Nota**: As informações para preencher as variáveis de ambiente referentes ao Cloudinary estão disponíveis na página de Dashboard do seu perfil do Cloudinary.

Não se esqueça de fazer os ajustes necessários em `prisma/schema.prisma` para o provedor de banco de dados que você registrou no arquivo `.env`.

- [Configurando banco de dados para o Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-mysql)

Depois de tudo configurado, envie o schema para o banco de dados.
```sh
yarn prisma db push
```

Esse comando já irá gerar o cliente do Prisma junto, mas caso dê algum problema, utilize o seguinte comando para gerar o cliente:
```sh
yarn prisma generate
```

Se quiser adicionar alguma funcionalidade, crie uma nova branch antes de começar a editar:
```sh
git checkout -b <nome_da_branch>
```

Agora basta utilizar `yarn dev` para iniciar o ambiente de desenvolvimento, ou `yarn build && yarn start` para iniciar o ambiente de produção.

### 🌐 Utilizando o website

O website como um todo apresenta uma interface bem intuitiva de se navegar, porém vou dar algumas dicas de como funciona o painel de administrador da aplicação.

Primeiramente, para ter acesso de administrador, é necessário fazer login com uma conta qualquer do GitHub.

Feito isso, você será redirecionado à página de gerenciamento de produtos. Nessa página há um botão para adicionar um novo produto, e botões para editar e para excluir cara um dos produtos já cadastrados.

Ao clicar para adicionar ou editar um produto, você irá para um formulário de cadastro de produtos. Nele você fornecerá as informações e a imagem do produto e então poderá adicioná-lo ou atualizá-lo. Se atualizar um produto, sua imagem anterior também será apagada.

Ao clicar para excluir um produto você será questionado se realmente deseja excluí-lo. Se confirmar, este e sua imagem serão permanentemente deletados.

## 📄 Licença
Esse projeto utiliza a licença GNU GPL-3.0 &ndash; veja o arquivo `COPYING` para mais detalhes.

Em resumo: é uma licença que permite fazer quase tudo com o projeto, com exceção de distribuir versões de código fechado (closed source).