import { useState, useEffect } from "react";
import Mapa from "./components/Mapa";
import CartaoClima from "./components/CartaoClima";

function App() {
  const [cidade, setCidade] = useState("");
  const [clima, setClima] = useState(null);
  const [coordenadas, setCoordenadas] = useState(null);
  const [erro, setErro] = useState("");
  const [mostrarErro, setMostrarErro] = useState(false);

  const API_KEY = "cbd5531fde7c0ddfa1671407a656a0f6";

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("ultimaBusca");
    if (dadosSalvos) {
      const parsed = JSON.parse(dadosSalvos);
      setClima(parsed.clima);
      setCoordenadas([parsed.clima.coord.lat, parsed.clima.coord.lon]);
    }
  }, []);

  // Fade + slide-up do erro
  useEffect(() => {
    if (erro) {
      setMostrarErro(true);
      const timer = setTimeout(() => setMostrarErro(false), 4500);
      const limpar = setTimeout(() => setErro(""), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(limpar);
      };
    }
  }, [erro]);

  const buscarClima = async () => {
    if (!cidade) return;

    try {
      setErro("");
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt`
      );

      if (!res.ok) {
        setErro("Local não encontrada!");
        return;
      }

      const dados = await res.json();
      setClima(dados);
      setCoordenadas([dados.coord.lat, dados.coord.lon]);

      localStorage.setItem("ultimaBusca", JSON.stringify({ clima: dados }));
    } catch {
      setErro("Erro ao buscar os dados. Tente novamente.");
    }
  };

  const buscarMinhaLocalizacao = () => {
    if (!navigator.geolocation) {
      setErro("Geolocalização não suportada!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt`
          );
          if (!res.ok) {
            setErro("Não foi possível obter o clima da localização.");
            return;
          }
          const dados = await res.json();
          setClima(dados);
          setCoordenadas([latitude, longitude]);
          localStorage.setItem("ultimaBusca", JSON.stringify({ clima: dados }));
        } catch {
          setErro("Erro ao buscar os dados da localização.");
        }
      },
      () => setErro("Permissão de geolocalização negada!")
    );
  };

  return (
    <div className="p-4">
       <h1>⛅ GeoClima</h1>
        <h6>Verifique o clima e a geolocalização de uma cidade</h6>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Digite o local..."
          className="border mr-1 p-2 rounded w-64"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
        <button
          onClick={buscarClima}
          className="bg-blue-500 text-white mr-1 px-4 py-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
        <button
          onClick={buscarMinhaLocalizacao}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Minha localização
        </button>
      </div>

      {erro && (
        <div
          className={`max-w-md mx-auto mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded shadow transition-all duration-500 ease-in-out ${
            mostrarErro ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          {erro}
        </div>
      )}

      {clima && <CartaoClima clima={clima} />}
      <Mapa coords={coordenadas} />
      <footer className="text-center">
	<p>Desenvolvido por <a href="https://auzanojoaquim.vercel.app">Auzano Joaquim</a> — 2025</p>
      </footer>
    </div>
  );
}

export default App;
