import React, { useState, useEffect } from 'react';

const palabrasIniciales = ['océano', 'elefante', 'montaña', 'bicicleta', 'computadora'];
const indiceInicial = 0;

const Game = () => {
  const [palabrasOriginales, setPalabrasOriginales] = useState(palabrasIniciales);
  const [palabraOriginal, setPalabraOriginal] = useState(palabrasOriginales[indiceInicial]);
  const [palabraDesordenada, setPalabraDesordenada] = useState('');
  const [valoresEntrada, setValoresEntrada] = useState(Array(palabraOriginal.length).fill(''));
  const [indiceEntradaActual, setIndiceEntradaActual] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [mensaje, setMensaje] = useState('');
  const [indiceActual, setIndiceActual] = useState(indiceInicial);

  useEffect(() => {
    // Desordena la palabra al cargar el componente
    const desordenarPalabra = () => {
      let palabraDesordenada = '';
      do {
        palabraDesordenada = palabraOriginal.split('').sort(() => Math.random() - 0.5).join('');
      } while (palabraDesordenada === palabraOriginal);

      setPalabraDesordenada(palabraDesordenada);
    };

    desordenarPalabra();
  }, [palabraOriginal]);

  const manejarCambioEntrada = (event) => {
    const valorActual = event.target.value;
    const valoresEntradaActualizados = [...valoresEntrada];
    valoresEntradaActualizados[indiceEntradaActual] = valorActual;
    setValoresEntrada(valoresEntradaActualizados);

    if (valorActual === palabraOriginal[indiceEntradaActual]) {
      if (indiceEntradaActual === palabraOriginal.length - 1) {
        // Adivinó la palabra, elimina la palabra del arreglo
        setMensaje(`¡Correcto! La palabra es ${palabraOriginal}`);
        const nuevasPalabras = palabrasOriginales.filter((palabra) => palabra !== palabraOriginal);
        setPalabrasOriginales(nuevasPalabras);

        if (nuevasPalabras.length > 0) {
          reiniciarJuego();
        } else {
          setMensaje('¡Felicidades, has adivinado todas las palabras!');
        }
      } else {
        setIndiceEntradaActual(indiceEntradaActual + 1);
        setMensaje('¡Letra correcta! Avanza al siguiente cuadro.');
      }
    } else {
      manejarError();
    }
  };

  const manejarError = () => {
    setVidas(vidas - 1);
    setMensaje('Intenta de nuevo. La letra no es correcta.');
    if (vidas === 1) {
      setMensaje('¡Perdiste! Te quedaste sin vidas.');
    }
  };

  const reiniciarJuego = () => {
    const nuevoIndice = Math.floor(Math.random() * palabrasOriginales.length);
    setIndiceActual(nuevoIndice);
    setPalabraOriginal(palabrasOriginales[nuevoIndice]);
    setIndiceEntradaActual(0);
    setValoresEntrada(Array(palabrasOriginales[nuevoIndice].length).fill(''));
    setMensaje('');
  };

  const manejarEliminar = () => {
    const valoresEntradaActualizados = [...valoresEntrada];
    valoresEntradaActualizados[indiceEntradaActual] = ''; // Elimina la letra
    setValoresEntrada(valoresEntradaActualizados);
  };

  const cuadrosEntrada = valoresEntrada.map((valor, indice) => (
    <div key={indice} className="relative inline-block">
      <input
        type="text"
        value={valor}
        onChange={manejarCambioEntrada}
        disabled={indice !== indiceEntradaActual || vidas === 0}
        className='w-10 text-center border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300'
      />
      {indice === indiceEntradaActual && (
        <button onClick={manejarEliminar} className=" absolute left-96 p-2 text-white bg-red-500 top-[-.5rem] rounded-md transition-all duration-300 w-36 hover:bg-red-600 focus:outline-none">
          Eliminar letra
        </button>
      )}
    </div>
  ));

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white'>
      <h1 className='text-3xl font-bold mb-6'>Adivina la Palabra Desordenada</h1>
      <div className='flex flex-row items-center justify-center w-full mb-8 space-x-4'>
        <p className='p-2 font-bold bg-opacity-80 bg-black rounded-full'>Palabra Desordenada: {palabraDesordenada}</p>
        <p className='p-2 font-bold bg-opacity-80 bg-black rounded-full'>Vidas restantes: {vidas}</p>
      </div>
      <div className="flex items-center justify-center space-x-2">
        {cuadrosEntrada}
      </div>
      <button onClick={reiniciarJuego} className='mt-8 p-3 text-white bg-yellow-400 rounded-full transition-all duration-300 hover:bg-yellow-500 focus:outline-none'>
        Reiniciar
      </button>
      <p className='mt-8 text-xl'>{mensaje}</p>
    </div>
  );
};

export default Game;
