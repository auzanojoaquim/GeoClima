import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CloudSun, Search, MapPin, LocateFixed, Sun, Moon, Wind, Droplets,
  Thermometer, Eye, Gauge, RefreshCw, Heart, Clock3, Sunrise, Sunset,
  CloudRain, AlertCircle, X, Compass
} from "lucide-react";
import Mapa from "./components/Mapa";
import CartaoClima from "./components/CartaoClima";

const CHAVE_HISTORICO = "geoclima:historico";
const CHAVE_FAVORITOS = "geoclima:favoritos";
const CHAVE_TEMA = "geoclima:tema";

function lerArmazenamento(chave, valorInicial) {
  try {
    const valorGuardado = localStorage.getItem(chave);
    return valorGuardado ? JSON.parse(valorGuardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function formatarHora(segundos, fuso = 0) {
  if (!segundos) return "--:--";
  return new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date((segundos + fuso) * 1000));
}

function App() {
  const [localidade, definirLocalidade] = useState("");
  const [clima, definirClima] = useState(null);
  const [previsao, definirPrevisao] = useState([]);
  const [coordenadas, definirCoordenadas] = useState(null);
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState("");
  const [tema, definirTema] = useState(() => localStorage.getItem(CHAVE_TEMA) || "claro");
  const [historico, definirHistorico] = useState(() => lerArmazenamento(CHAVE_HISTORICO, []));
  const [favoritos, definirFavoritos] = useState(() => lerArmazenamento(CHAVE_FAVORITOS, []));
  const [separadorAtivo, definirSeparadorAtivo] = useState("previsao");

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    localStorage.setItem(CHAVE_TEMA, tema);
  }, [tema]);

  useEffect(() => localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico)), [historico]);
  useEffect(() => localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos)), [favoritos]);

  const consultarClima = useCallback(async (consulta, tipo = "q") => {
    definirCarregando(true);
    definirErro("");
    try {
      const parametros = new URLSearchParams({ tipo: "tempo" });
      if (tipo === "q") parametros.set("q", consulta);
      else {
        parametros.set("lat", String(consulta.latitude));
        parametros.set("lon", String(consulta.longitude));
      }
      const respostaClima = await fetch(`/api/clima?${parametros}`);
      const dadosClima = await respostaClima.json();
      if (!respostaClima.ok) {
        const mensagem = dadosClima.erro === "cidade_nao_encontrada"
          ? "Não encontrámos essa localidade. Verifique o nome e tente novamente."
          : dadosClima.erro === "chave_invalida"
            ? "A chave da OpenWeather não foi aceite. Confirme a variável API_KEY na Vercel."
            : dadosClima.erro === "configuracao_em_falta"
              ? "A variável API_KEY não está configurada no ambiente da Vercel."
              : "Não foi possível obter o clima. Tente novamente.";
        throw new Error(mensagem);
      }
      const parametrosPrevisao = new URLSearchParams({
        tipo: "previsao",
        lat: String(dadosClima.coord.lat),
        lon: String(dadosClima.coord.lon)
      });
      const respostaPrevisao = await fetch(`/api/clima?${parametrosPrevisao}`);
      const dadosPrevisao = respostaPrevisao.ok ? await respostaPrevisao.json() : { list: [] };
      definirClima(dadosClima);
      definirCoordenadas([dadosClima.coord.lat, dadosClima.coord.lon]);
      definirPrevisao(dadosPrevisao.list || []);
      definirHistorico((anterior) => [
        { nome: dadosClima.name, pais: dadosClima.sys?.country, latitude: dadosClima.coord.lat, longitude: dadosClima.coord.lon },
        ...anterior.filter((item) => item.nome !== dadosClima.name || item.pais !== dadosClima.sys?.country),
      ].slice(0, 6));
      definirLocalidade("");
    } catch (falha) {
      definirErro(falha.message || "Ocorreu um erro de ligação. Verifique a internet.");
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    let desmontado = false;
    const ultimoLocal = lerArmazenamento("geoclima:ultimo", null);

    const carregarUltimoLocal = () => {
      if (!desmontado && ultimoLocal) consultarClima(ultimoLocal, "coords");
    };

    if (!navigator.geolocation) {
      carregarUltimoLocal();
      if (!ultimoLocal) definirErro("Este navegador não permite obter a localização automaticamente. Pesquise uma cidade ou use um navegador compatível.");
      return () => { desmontado = true; };
    }

    // Ao abrir, tenta obter a localização atual; se falhar, recupera a última localidade consultada.
    definirCarregando(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!desmontado) consultarClima({ latitude: coords.latitude, longitude: coords.longitude }, "coords");
      },
      (falha) => {
        if (desmontado) return;
        if (ultimoLocal) {
          carregarUltimoLocal();
          return;
        }
        definirCarregando(false);
        const mensagens = {
          1: "O acesso à localização foi recusado. Autorize a localização no navegador ou pesquise uma cidade.",
          2: "Não foi possível determinar a localização atual. Verifique o GPS ou a ligação à internet e tente novamente.",
          3: "A localização demorou demasiado tempo. Tente novamente ou pesquise uma cidade."
        };
        definirErro(mensagens[falha.code] || "Não foi possível obter a localização. Pesquise uma cidade para consultar o clima.");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );

    return () => { desmontado = true; };
  // A geolocalização é tentada uma vez ao iniciar a aplicação.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clima) localStorage.setItem("geoclima:ultimo", JSON.stringify({ latitude: clima.coord.lat, longitude: clima.coord.lon }));
  }, [clima]);

  const pesquisar = (evento) => {
    evento.preventDefault();
    const nomeLocal = localidade.trim();
    if (nomeLocal) consultarClima(nomeLocal);
  };

  const localizarUtilizador = () => {
    definirErro("");
    if (!window.isSecureContext) {
      definirErro("A localização só funciona em HTTPS ou em localhost. Abra a versão publicada na Vercel através de HTTPS.");
      return;
    }
    if (!navigator.geolocation) {
      definirErro("Este navegador não disponibiliza geolocalização. Pesquise uma cidade manualmente.");
      return;
    }
    definirCarregando(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => consultarClima({ latitude: coords.latitude, longitude: coords.longitude }, "coords"),
      (falha) => {
        definirCarregando(false);
        const mensagens = {
          1: "O acesso à localização foi recusado. Ative a permissão de localização nas definições do navegador e tente novamente.",
          2: "O dispositivo não conseguiu determinar a localização. Ative o GPS ou verifique a ligação à internet.",
          3: "A localização demorou demasiado tempo. Tente novamente num local com melhor sinal."
        };
        definirErro(mensagens[falha.code] || "Não foi possível obter a localização. Pesquise uma cidade para continuar.");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  };

  const alternarFavorito = () => {
    if (!clima) return;
    const favorito = { nome: clima.name, pais: clima.sys?.country, latitude: clima.coord.lat, longitude: clima.coord.lon };
    const existe = favoritos.some((item) => item.nome === favorito.nome && item.pais === favorito.pais);
    definirFavoritos(existe
      ? favoritos.filter((item) => item.nome !== favorito.nome || item.pais !== favorito.pais)
      : [favorito, ...favoritos].slice(0, 10));
  };

  const eFavorito = useMemo(
    () => clima && favoritos.some((item) => item.nome === clima.name && item.pais === clima.sys?.country),
    [clima, favoritos]
  );

  const previsaoDiaria = useMemo(() => {
    const dias = new Map();
    previsao.forEach((item) => {
      const data = item.dt_txt?.split(" ")[0];
      if (!data) return;
      if (!dias.has(data)) dias.set(data, []);
      dias.get(data).push(item);
    });
    return [...dias.entries()].slice(0, 5).map(([data, itens]) => {
      const meioDia = itens.find((item) => item.dt_txt.includes("12:00:00")) || itens[Math.floor(itens.length / 2)];
      return { data, temperatura: Math.round(meioDia.main.temp), descricao: meioDia.weather[0].description, icone: meioDia.weather[0].icon, minima: Math.round(Math.min(...itens.map((item) => item.main.temp_min))), maxima: Math.round(Math.max(...itens.map((item) => item.main.temp_max))) };
    });
  }, [previsao]);

  const horaLocal = (segundos) => formatarHora(segundos, clima?.timezone || 0);

  return (
    <main className="aplicacao">
      <header className="cabecalho">
        <a className="marca" href="#" aria-label="GeoClima - início">
          <span className="marca-icone"><CloudSun size={25} /></span>
          <span>Geo<span>Clima</span><small>O tempo, no seu mapa.</small></span>
        </a>
        <div className="acoes-cabecalho">
          <span className="estado-servico"><span /> Dados meteorológicos</span>
          <button className="botao-icone" onClick={() => definirTema(tema === "claro" ? "escuro" : "claro")} aria-label={tema === "claro" ? "Ativar modo escuro" : "Ativar modo claro"}>
            {tema === "claro" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
        </div>
      </header>

      <section className="introducao">
        <div className="introducao-texto">
          <span className="sobretitulo"><Compass size={15} /> CLIMA E GEOGRAFIA</span>
          <h1>Conheça o tempo.<br /><span>Explore o mundo.</span></h1>
          <p>Condições atuais, previsão dos próximos dias e localização num só lugar.</p>
        </div>
        <div className="ilustracao-clima" aria-hidden="true"><Sun className="sol-ilustrado" /><CloudSun className="nuvem-ilustrada" /></div>
      </section>

      <section className="pesquisa-painel" aria-label="Pesquisar localidade">
        <form className="formulario-pesquisa" onSubmit={pesquisar}>
          <Search size={21} />
          <input value={localidade} onChange={(evento) => definirLocalidade(evento.target.value)} placeholder="Pesquisar cidade, região ou país..." aria-label="Nome da localidade" />
          {localidade && <button type="button" className="limpar-pesquisa" onClick={() => definirLocalidade("")} aria-label="Limpar pesquisa"><X size={17} /></button>}
          <button className="botao-pesquisar" type="submit" disabled={carregando || !localidade.trim()}><Search size={17} /> Pesquisar</button>
        </form>
        <button className="botao-localizacao" onClick={localizarUtilizador} disabled={carregando}><LocateFixed size={17} /> Usar a minha localização</button>
      </section>

      {erro && <div className="mensagem-erro" role="alert"><AlertCircle size={19} /><span>{erro}</span><button onClick={() => definirErro("")} aria-label="Fechar mensagem"><X size={17} /></button></div>}
      {carregando && <div className="estado-carregamento"><span className="girador" /> A atualizar as condições meteorológicas...</div>}

      {!clima && !carregando && (
        <section className="estado-inicial">
          <div className="estado-inicial-icone"><MapPin size={28} /></div>
          <h2>Onde quer consultar o clima?</h2>
          <p>Pesquise uma localidade ou use a sua localização atual para começar.</p>
          {historico.length > 0 && <div className="atalhos-locais"><span><Clock3 size={15} /> Pesquisas recentes</span>{historico.slice(0, 4).map((item) => <button key={`${item.nome}-${item.pais}`} onClick={() => consultarClima(item, "coords")}>{item.nome}, {item.pais}</button>)}</div>}
        </section>
      )}

      {clima && <>
        <section className="linha-titulo">
          <div><span className="sobretitulo">CONDIÇÕES ATUAIS</span><h2>{clima.name}<span className="pais">{clima.sys?.country}</span></h2><p><MapPin size={15} /> {clima.coord.lat.toFixed(3)}°, {clima.coord.lon.toFixed(3)}°</p></div>
          <div className="acoes-clima">
            <button className={`botao-secundario ${eFavorito ? "selecionado" : ""}`} onClick={alternarFavorito}><Heart size={17} fill={eFavorito ? "currentColor" : "none"} /> {eFavorito ? "Guardado" : "Guardar local"}</button>
            <button className="botao-icone" onClick={() => consultarClima({ latitude: clima.coord.lat, longitude: clima.coord.lon }, "coords")} aria-label="Atualizar clima" disabled={carregando}><RefreshCw size={18} /></button>
          </div>
        </section>

        <section className="painel-principal">
          <CartaoClima clima={clima} />
          <div className="cartao-detalhes">
            <div className="cartao-cabecalho"><div><span className="sobretitulo">DETALHES</span><h3>Condições do momento</h3></div><span className="etiqueta-ao-vivo"><span /> AO VIVO</span></div>
            <div className="grelha-detalhes">
              <div className="detalhe"><span className="detalhe-icone temperatura"><Thermometer /></span><div><small>Sensação térmica</small><strong>{Math.round(clima.main.feels_like)}°C</strong></div></div>
              <div className="detalhe"><span className="detalhe-icone humidade"><Droplets /></span><div><small>Humidade</small><strong>{clima.main.humidity}%</strong></div></div>
              <div className="detalhe"><span className="detalhe-icone vento"><Wind /></span><div><small>Velocidade do vento</small><strong>{(clima.wind.speed * 3.6).toFixed(1)} <small>km/h</small></strong></div></div>
              <div className="detalhe"><span className="detalhe-icone pressao"><Gauge /></span><div><small>Pressão atmosférica</small><strong>{clima.main.pressure} <small>hPa</small></strong></div></div>
              <div className="detalhe"><span className="detalhe-icone visibilidade"><Eye /></span><div><small>Visibilidade</small><strong>{((clima.visibility ?? 0) / 1000).toFixed(1)} <small>km</small></strong></div></div>
              <div className="detalhe"><span className="detalhe-icone chuva"><CloudRain /></span><div><small>Nuvens</small><strong>{clima.clouds?.all ?? 0}%</strong></div></div>
            </div>
            <div className="sol-info"><div><Sunrise size={19} /><span><small>Nascer do sol</small><strong>{horaLocal(clima.sys?.sunrise)}</strong></span></div><div><Sunset size={19} /><span><small>Pôr do sol</small><strong>{horaLocal(clima.sys?.sunset)}</strong></span></div></div>
          </div>
        </section>

        <section className="secao-previsao">
          <div className="cabecalho-secao"><div><span className="sobretitulo">PLANEIE O SEU DIA</span><h2>Previsão para os próximos dias</h2></div><div className="seletor-previsao"><button className={separadorAtivo === "previsao" ? "ativo" : ""} onClick={() => definirSeparadorAtivo("previsao")}>5 dias</button><button className={separadorAtivo === "mapa" ? "ativo" : ""} onClick={() => definirSeparadorAtivo("mapa")}>Mapa</button></div></div>
          {separadorAtivo === "previsao" ? <div className="grelha-previsao">{previsaoDiaria.map((dia, indice) => <article className="cartao-dia" key={dia.data}><span>{indice === 0 ? "Hoje" : new Intl.DateTimeFormat("pt-PT", { weekday: "short" }).format(new Date(`${dia.data}T12:00:00`))}</span><small>{new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short" }).format(new Date(`${dia.data}T12:00:00`))}</small><img src={`https://openweathermap.org/img/wn/${dia.icone}@2x.png`} alt={dia.descricao} /><strong>{dia.temperatura}°C</strong><p>{dia.descricao}</p><div><span>{dia.minima}°</span><i /><span>{dia.maxima}°</span></div></article>)}</div> : <Mapa coordenadas={coordenadas} nomeLocal={clima.name} />}
        </section>

        <section className="secao-mapa"><div className="cabecalho-secao"><div><span className="sobretitulo">EXPLORE A REGIÃO</span><h2>Localização no mapa</h2></div><span className="coordenadas">{clima.coord.lat.toFixed(4)}, {clima.coord.lon.toFixed(4)}</span></div><Mapa coordenadas={coordenadas} nomeLocal={clima.name} /></section>
      </>}

      {favoritos.length > 0 && <section className="secao-favoritos"><div className="cabecalho-secao"><div><span className="sobretitulo">ACESSO RÁPIDO</span><h2>Locais guardados</h2></div></div><div className="lista-favoritos">{favoritos.map((item) => <button key={`${item.nome}-${item.pais}`} onClick={() => consultarClima(item, "coords")}><Heart size={16} fill="currentColor" /><span>{item.nome}<small>{item.pais}</small></span><span className="seta-favorito">↗</span></button>)}</div></section>}

      <footer className="rodape"><a className="marca marca-rodape" href="#"><span className="marca-icone"><CloudSun size={20} /></span><span>Geo<span>Clima</span></span></a><p>Informação meteorológica para explorar melhor o mundo.</p><span>Dados por OpenWeather · Mapas por OpenStreetMap</span><p className="credito-autor">Desenvolvido por <a href="https://auzanojoquim.vercel.app" target="_blank" rel="noreferrer">Auzano Joaquim</a></p></footer>
    </main>
  );
}

export default App;
