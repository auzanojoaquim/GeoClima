<div align="center">

# 🌦️ GeoClima

### O tempo, no seu mapa.

Consulte as condições meteorológicas, compare a previsão dos próximos dias e explore localidades num mapa interativo — numa experiência responsiva, simples e moderna.

![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-f7df1e?style=flat-square&logo=javascript&logoColor=222)
![OpenWeather](https://img.shields.io/badge/Dados-OpenWeather-orange?style=flat-square)
![Licença MIT](https://img.shields.io/badge/licença-MIT-28a745?style=flat-square)

</div>

---

## ✨ Sobre o projeto

O **GeoClima** é uma aplicação meteorológica que reúne pesquisa de localidades, condições atuais, previsão de cinco dias, geolocalização e mapa interativo. A interface adapta-se a computadores e dispositivos móveis e permite alternar entre os temas claro e escuro.

## Funcionalidades

- **Pesquisa de localidades:** consulta por nome de cidade ou localidade.
- **Geolocalização:** consulta baseada na localização atual, mediante autorização do navegador.
- **Condições atuais:** temperatura, sensação térmica, humidade, vento, pressão atmosférica, visibilidade e nebulosidade.
- **Previsão para cinco dias:** temperaturas previstas, mínimas, máximas e descrição das condições.
- **Nascer e pôr do sol:** horários apresentados para a localidade consultada.
- **Mapa interativo:** visualização da localização e das coordenadas.
- **Favoritos:** guarda até dez localidades para acesso rápido.
- **Histórico recente:** facilita a repetição de pesquisas anteriores.
- **Tema claro e escuro:** preferência guardada no dispositivo.
- **Persistência local:** conserva favoritos, histórico, tema e última localidade no navegador.
- **Interface responsiva:** navegação adaptada a ecrãs pequenos e grandes.
- **Estados de carregamento e erro:** feedback durante as consultas meteorológicas.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React 19 | Interface e componentes |
| Vite 7 | Servidor de desenvolvimento e compilação |
| JavaScript ES Modules | Lógica da aplicação |
| Tailwind CSS | Base de estilos e configuração CSS |
| Lucide React | Ícones da interface |
| Leaflet e React Leaflet | Mapa interativo |
| OpenWeather API | Condições meteorológicas e previsão |
| OpenStreetMap | Cartografia |
| Local Storage | Preferências, histórico e favoritos |

## Requisitos

- Node.js compatível com a versão do Vite instalada (Node.js 20.19+ ou 22.12+ recomendado).
- npm.
- Uma chave API da [OpenWeather](https://openweathermap.org/api).
- Ligação à Internet para consultar o clima, carregar os ícones meteorológicos e apresentar o mapa.

## Instalação e execução

1. Clona o repositório e entra na pasta do projeto:

   ```bash
   git clone https://github.com/auzanojoaquim/GeoClima.git
   cd GeoClima
   ```

2. Instala as dependências:

   ```bash
   npm install
   ```

3. Cria um ficheiro `.env` na raiz, ao lado de `package.json`, e adiciona a chave da API:

   ```env
   VITE_API_KEY=coloca_a_tua_chave_aqui
   ```

4. Inicia o servidor local:

   ```bash
   npm run dev
   ```

5. Abre o endereço apresentado no terminal, normalmente `http://localhost:5173`.

O ficheiro `.env.example` serve como modelo de configuração. Não publiques chaves privadas em repositórios públicos.

## Comandos disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run lint     # Analisa o código com ESLint
npm run build    # Gera a versão de produção em dist/
npm run preview  # Pré-visualiza a compilação de produção
```

Antes de publicar, executa `npm run lint` e `npm run build` e resolve eventuais erros reportados.

## Estrutura do projeto

```text
GeoClima/
├── public/                  # Recursos públicos
├── screenshots/             # Capturas de ecrã do projeto
├── src/
│   ├── assets/               # Recursos importados pela aplicação
│   ├── components/
│   │   ├── CartaoClima.jsx   # Cartão das condições atuais
│   │   └── Mapa.jsx          # Mapa e marcador da localidade
│   ├── App.jsx               # Estado e funcionalidades principais
│   ├── App.css               # Estilos da aplicação
│   ├── index.css             # Estilos globais e temas
│   └── main.jsx              # Ponto de entrada React
├── .env.example              # Modelo das variáveis de ambiente
├── index.html                # Documento HTML principal
├── package.json              # Dependências e comandos
└── vite.config.js             # Configuração do Vite
```

## Privacidade e segurança

- A geolocalização só é consultada após uma ação do utilizador e depende da permissão do navegador.
- O histórico, os favoritos, o tema e a última localidade são guardados no `localStorage` do navegador.
- Como as variáveis `VITE_*` são incorporadas no código enviado ao navegador, a chave da OpenWeather não é secreta. Para um ambiente público, configura restrições de utilização na plataforma da API ou encaminha os pedidos através de um backend.
- Evita incluir ficheiros `.env` com credenciais no controlo de versões.

## Fontes de dados

- **Meteorologia:** [OpenWeather](https://openweathermap.org/).
- **Mapas:** [OpenStreetMap](https://www.openstreetmap.org/), apresentado através do Leaflet.

A disponibilidade e a precisão dos dados dependem dos serviços externos e da cobertura da localidade consultada.

## Autor

**Desenvolvido por Auzano Joaquim**

- Portfólio: [auzanojoquim.vercel.app](https://auzanojoquim.vercel.app)
- GitHub: [@auzanojoaquim](https://github.com/auzanojoaquim)

## Licença

Este projeto está distribuído sob a licença MIT. Consulta o ficheiro [`LICENSE`](./LICENSE) para conhecer os termos.
