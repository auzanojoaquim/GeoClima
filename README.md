# GeoClima

**O tempo, no seu mapa.** Uma aplicação web de meteorologia e exploração geográfica construída com React, Vite e Leaflet. Consulte as condições atuais, acompanhe a previsão para os próximos cinco dias e guarde os locais que visita com frequência.

![Estado do projeto](https://img.shields.io/badge/estado-em_desenvolvimento-3563e9?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Licença MIT](https://img.shields.io/badge/licença-MIT-2ea44f?style=for-the-badge)

## Visão geral

O GeoClima reúne dados meteorológicos e contexto geográfico numa interface responsiva, com tema claro e escuro. A aplicação utiliza a API da OpenWeather para os dados de meteorologia e o OpenStreetMap para a cartografia.

## Funcionalidades

- **Pesquisa de localidades:** consulte uma cidade pelo nome.
- **Geolocalização:** obtenha o clima da sua posição atual, mediante autorização do navegador.
- **Condições atuais:** temperatura, sensação térmica, temperatura máxima e mínima, humidade, vento, pressão, visibilidade e nebulosidade.
- **Previsão para cinco dias:** resumo diário com temperatura, intervalo térmico e descrição das condições.
- **Mapa interativo:** visualize e explore a localização selecionada.
- **Favoritos:** guarde até dez locais para acesso rápido.
- **Histórico recente:** retome as últimas localidades consultadas.
- **Tema claro e escuro:** a preferência fica guardada no navegador.
- **Persistência local:** tema, favoritos, histórico e última localização ficam disponíveis entre sessões no mesmo navegador.
- **Interface adaptável:** experiência ajustada a computadores, tablets e telemóveis.
- **Estados de carregamento e erro:** mensagens para falhas de pesquisa, ligação ou geolocalização.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React 19 | Interface e componentes |
| Vite 7 | Desenvolvimento e compilação |
| JavaScript com módulos ES | Lógica da aplicação |
| CSS | Interface responsiva e temas |
| Tailwind CSS | Base de utilitários disponível no projeto |
| Leaflet e React Leaflet | Mapa interativo |
| Lucide React | Ícones |
| OpenWeather API | Condições atuais e previsão |
| OpenStreetMap | Camadas cartográficas |
| localStorage | Preferências e locais guardados |

## Requisitos

- Node.js compatível com a versão do Vite instalada (Node.js 20.19+ ou 22.12+ recomendado).
- npm.
- Chave de API da OpenWeather.
- Ligação à Internet para consultar meteorologia, mapas e recursos externos.

## Instalação

```bash
git clone https://github.com/auzanojoaquim/GeoClima.git
cd GeoClima
npm install
```

Crie uma chave gratuita no portal da [OpenWeather](https://openweathermap.org/api). Na raiz do projeto, crie um ficheiro `.env` com o conteúdo:

```env
API_KEY=a_sua_chave_openweather
```

Também pode copiar o ficheiro de exemplo:

```bash
cp .env.example .env
```

Substitua o valor de exemplo pela sua chave real. Reinicie o servidor de desenvolvimento depois de alterar as variáveis de ambiente.

> **Nota de segurança:** as variáveis com prefixo `VITE_` são incorporadas no código enviado ao navegador. A chave utilizada nesta aplicação é, portanto, visível no cliente. Configure os limites e a utilização da chave no painel da OpenWeather e não reutilize aqui credenciais privadas. Para ocultar a chave num ambiente de produção, implemente um serviço de backend como intermediário.

## Executar em desenvolvimento

```bash
npm run dev
```

O Vite apresenta o endereço local no terminal, normalmente `http://localhost:5173`.

## Verificar e compilar

```bash
npm run lint
npm run build
npm run preview
```

- `npm run lint`: analisa o código com ESLint.
- `npm run build`: gera a versão de produção na pasta `dist`.
- `npm run preview`: serve localmente a compilação para validação.

## Estrutura do projeto

```text
GeoClima/
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
├── tailwind.config.js
└── vite.config.js
```

## Como funciona

1. A pessoa pesquisa uma localidade ou permite o acesso à localização.
2. A aplicação consulta as condições meteorológicas atuais.
3. Com as coordenadas devolvidas, solicita a previsão para os próximos dias.
4. Os dados são apresentados em cartões e no mapa interativo.
5. A localidade consultada pode ser guardada nos favoritos ou recuperada no histórico.

## Privacidade e permissões

- A geolocalização só é solicitada quando a pessoa escolhe essa opção.
- O navegador gere a autorização de localização.
- Os favoritos, o histórico, o tema e a última localização são armazenados no `localStorage` do próprio navegador.
- Limpar os dados do site remove essas preferências guardadas.
- As consultas meteorológicas são enviadas à OpenWeather e os mosaicos cartográficos são obtidos do OpenStreetMap.

## Limitações conhecidas

- A disponibilidade e a frequência dos dados dependem do plano e dos limites da API OpenWeather.
- A previsão apresentada depende dos dados disponibilizados pelo serviço e não substitui avisos meteorológicos oficiais.
- A previsão diária é resumida a partir dos intervalos fornecidos pela API.
- A aplicação requer ligação à Internet para novas consultas e para carregar os mapas.
- O tema e os locais guardados são específicos do navegador e do dispositivo.

## Ideias para evolução

- Backend próprio para proteger a chave de API.
- Testes automatizados de componentes e fluxos de pesquisa.
- Alertas meteorológicos e notificações configuráveis.
- Comparação entre localidades.
- Unidades configuráveis (°C/°F e km/h/m/s).
- Internacionalização da interface.
- PWA com instalação e suporte offline para os últimos dados consultados.

## Créditos

- Meteorologia: [OpenWeather](https://openweathermap.org/api)
- Cartografia: [OpenStreetMap](https://www.openstreetmap.org/copyright)
- Mapas: [Leaflet](https://leafletjs.com/)
- Ícones: [Lucide](https://lucide.dev/)

## Autor

Desenvolvido por [Auzano Joaquim](https://github.com/auzanojoaquim).

## Licença

Distribuído sob a licença MIT. Consulte o ficheiro `LICENSE` se estiver presente no repositório.
