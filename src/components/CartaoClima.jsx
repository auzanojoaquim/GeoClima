import { ArrowUpRight, CloudSun } from "lucide-react";

function CartaoClima({ clima }) {
  if (!clima) return null;

  const icone = clima.weather?.[0]?.icon;
  const descricao = clima.weather?.[0]?.description || "Condições indisponíveis";

  return (
    <article className="cartao-temperatura">
      <div className="temperatura-topo"><span>AGORA</span><span className="temperatura-ponto"><i /> Atualizado</span></div>
      <div className="temperatura-centro">
        <div><strong className="valor-temperatura">{Math.round(clima.main.temp)}<sup>°</sup></strong><p>Temperatura atual</p></div>
        {icone ? <img className="icone-condicao" src={`https://openweathermap.org/img/wn/${icone}@4x.png`} alt={descricao} /> : <CloudSun className="icone-condicao" />}
      </div>
      <h3 className="descricao-clima">{descricao}</h3>
      <div className="temperaturas-extremas"><span>Máxima <strong>{Math.round(clima.main.temp_max)}°</strong></span><span>·</span><span>Mínima <strong>{Math.round(clima.main.temp_min)}°</strong></span></div>
      <div className="cartao-temperatura-rodape"><span>Feels like</span><strong>{Math.round(clima.main.feels_like)}°C</strong><ArrowUpRight size={17} /></div>
    </article>
  );
}

export default CartaoClima;
