# GeoClima

**O tempo, no seu mapa.** O GeoClima é uma aplicação web de meteorologia e exploração geográfica. Consulte as condições atuais, acompanhe a previsão para os próximos dias e guarde as localidades que visita com frequência.

![Estado do projeto](https://img.shields.io/badge/estado-em_desenvolvimento-3563e9?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Licença MIT](https://img.shields.io/badge/licença-MIT-2ea44f?style=for-the-badge)

## Visão geral

O GeoClima combina informação meteorológica e contexto geográfico numa interface responsiva, com tema claro e escuro. A interface mantém a identidade visual desta versão do projeto. As consultas à OpenWeather são encaminhadas por uma função de backend da Vercel para que a chave não seja enviada ao navegador.

## Funcionalidades

- Pesquisa de localidades pelo nome.
- Tentativa automática de geolocalização ao abrir a aplicação, mediante autorização do navegador.
- Recuperação da última localização consultada caso a localização automática não esteja disponível.
- Mensagens específicas para permissão recusada, localização indisponível e tempo de espera excedido.
- Condições atuais: temperatura, sensação térmica, máximas e mínimas, humidade, vento, pressão, visibilidade e nebulosidade.
- Previsão resumida para cinco dias.
- Mapa interativo.
- Até dez localidades favoritas.
- Histórico recente de pesquisas.
- Tema claro e escuro, com preferência guardada.
- Persistência local das preferências no navegador.
- Estados de carregamento e mensagens de erro.
- Rodapé com créditos e autoria.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React 19 | Interface e componentes |
| Vite 7 | Desenvolvimento e compilação do frontend |
| JavaScript | Lógica da aplicação e função de API |
| CSS | Estilos responsivos e temas |
| Leaflet / React Leaflet | Mapa interativo |
| Lucide React | Ícones |
| OpenWeather API | Condições meteorológicas e previsão |
| OpenStreetMap | Cartografia |
| Vercel Functions | Proxy de API no servidor |
| localStorage | Preferências e localidades guardadas |

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm.
- Conta e chave de API da [OpenWeather](https://openweathermap.org/api).
- Conta na Vercel para publicar a aplicação.

## Instalação local

```bash
git clone https://github.com/auzanojoaquim/GeoClima.git
cd GeoClima
npm install
```

Crie um ficheiro `.env` na raiz, usando `.env.example` como referência:

```env
API_KEY=a_sua_chave_openweather
```

Esta variável é lida pela função de backend em `api/clima.js`. Não use o prefixo `VITE_` para esta chave, porque isso tornaria o valor acessível no código do navegador.

Para testar localmente a aplicação e as funções de API da Vercel, use a CLI da Vercel:

```bash
npx vercel dev
```

Siga as instruções para associar o diretório ao projeto da Vercel. O servidor local da Vercel disponibiliza a aplicação e a rota `/api/clima`.

> `npm run dev` inicia apenas o servidor Vite. Para testar consultas meteorológicas localmente, use `npx vercel dev`, que também executa a função de backend.

## Publicação na Vercel

1. Envie o projeto para um repositório Git.
2. Na Vercel, importe esse repositório como projeto.
3. Confirme que o framework detetado é **Vite** e que o comando de compilação é `npm run build`.
4. Em **Settings → Environment Variables**, adicione `API_KEY` com a chave da OpenWeather.
5. Selecione os ambientes em que a variável deve estar disponível, pelo menos **Production** e também **Preview** se usar deployments de pré-visualização.
6. Guarde as alterações e faça um novo deployment.

A geolocalização do navegador exige HTTPS (a Vercel disponibiliza HTTPS por padrão) e autorização do utilizador. Se o pedido automático for recusado ou falhar, a aplicação tenta recuperar a última localização consultada; sem histórico, apresenta uma mensagem e permite pesquisar uma cidade manualmente. Para corrigir uma permissão recusada, abra as permissões do site no navegador e permita a localização. Em Android, confirme também que a localização/GPS do dispositivo está ativada.

A variável `API_KEY` tem de ser configurada no projeto correto da Vercel. Alterar as variáveis não atualiza deployments antigos: publique novamente para aplicar a configuração.

### Verificar a rota

Depois do deployment, abra `/api/clima?tipo=tempo&q=Luanda` no mesmo domínio da aplicação. Uma resposta com dados meteorológicos indica que a função e a chave estão a funcionar. Se receber um erro, consulte **Deployments → Functions / Logs** na Vercel.

- `configuracao_em_falta`: a função não encontrou `API_KEY` no ambiente publicado.
- `chave_invalida`: a OpenWeather rejeitou a chave configurada.
- `cidade_nao_encontrada`: a API não encontrou a localidade pedida.
- `servico_meteorologico_indisponivel` ou `falha_de_comunicacao`: ocorreu uma falha no serviço externo.

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

- `npm run dev`: inicia o frontend Vite.
- `npm run lint`: analisa o código com ESLint.
- `npm run build`: compila o frontend para a pasta `dist`.
- `npm run preview`: permite pré-visualizar localmente a compilação estática; para testar também a função de API, use `npx vercel dev`.

## Estrutura do projeto

```text
GeoClima/
├── api/
│   └── clima.js
├── public/
│   └── auza.jpg
├── screenshots/
├── src/
│   ├── components/
│   │   ├── CartaoClima.jsx
│   │   └── Mapa.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Privacidade e segurança

- A chave `API_KEY` é usada apenas no servidor pela função da Vercel e não deve ser incluída no código do frontend.
- A aplicação tenta obter a localização ao abrir e solicita autorização ao navegador; também disponibiliza um botão para tentar novamente manualmente.
- O navegador gere a autorização da localização.
- Favoritos, histórico, tema e última localização são guardados no `localStorage` do navegador.
- As consultas meteorológicas são enviadas à OpenWeather e os mapas são carregados a partir dos serviços cartográficos utilizados pelo projeto.

## Créditos

- Meteorologia: [OpenWeather](https://openweathermap.org/api)
- Cartografia: [OpenStreetMap](https://www.openstreetmap.org/copyright)
- Mapas: [Leaflet](https://leafletjs.com/)
- Ícones: [Lucide](https://lucide.dev/)

## Autor

Desenvolvido por [Auzano Joaquim](https://auzanojoquim.vercel.app).

## Licença

Distribuído sob a licença MIT. Consulte o ficheiro `LICENSE`.
