const URL_BASE = "https://api.openweathermap.org/data/2.5";

export default async function tratarClima(requisicao, resposta) {
  resposta.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const chaveApi = process.env.API_KEY;
  if (!chaveApi) {
    return resposta.status(500).json({ erro: "configuracao_em_falta" });
  }

  const parametros = requisicao.query || {};
  const tipo = parametros.tipo === "previsao" ? "forecast" : "weather";
  const consulta = new URLSearchParams({
    appid: chaveApi,
    units: "metric",
    lang: "pt"
  });

  if (tipo === "weather" && parametros.q) {
    consulta.set("q", String(parametros.q));
  } else if (parametros.lat !== undefined && parametros.lon !== undefined) {
    consulta.set("lat", String(parametros.lat));
    consulta.set("lon", String(parametros.lon));
  } else {
    return resposta.status(400).json({ erro: "parametros_invalidos" });
  }

  try {
    const respostaServico = await fetch(`${URL_BASE}/${tipo}?${consulta.toString()}`);
    const dados = await respostaServico.json();

    if (!respostaServico.ok) {
      if (respostaServico.status === 404) {
        return resposta.status(404).json({ erro: "cidade_nao_encontrada" });
      }
      if (respostaServico.status === 401) {
        return resposta.status(502).json({ erro: "chave_invalida" });
      }
      return resposta.status(502).json({ erro: "servico_meteorologico_indisponivel" });
    }

    return resposta.status(200).json(dados);
  } catch {
    return resposta.status(502).json({ erro: "falha_de_comunicacao" });
  }
}
