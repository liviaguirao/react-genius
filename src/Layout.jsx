import React, { useState, useEffect } from 'react';
import GeniusButton from "./GeniusButton";
import styles from "./Layout.module.css";

function Layout() {
  const [sequence, setSequence] = useState([]);
  const [nivel, setNivel] = useState(1);
  const [nivelMaximo, setNivelMaximo] = useState(1);

  useEffect(() => {
    // Gera uma nova sequência quando o componente é montado
    generateSequence();
  }, []);

  const generateSequence = () => {
    const newSequence = Array.from({ length: 20 }, () => Math.floor(Math.random() * 4));
    setSequence(newSequence);
  };

  const startGame = () => {
    generateSequence();
    setTimeout(playSequence, 1000);
  };

  const playSequence = async () => {
    for (let i = 0; i < sequence.length; i++) {
      // Obtém a cor correspondente ao número na sequência
      const color = getColorFromNumber(sequence[i]);
      // Aguarda 1 segundo antes de mudar para a próxima cor
      await sleep(1000);
      // Faz o botão piscar durante 1 segundo
      await blinkButton(color);
    }
  };

  const getColorFromNumber = (number) => {
    switch (number) {
      case 0:
        return 'red';
      case 1:
        return 'blue';
      case 2:
        return 'yellow';
      case 3:
        return 'green';
    }
  };

  const blinkButton = async (color) => {
    // Define a cor clara com base na cor original
    const lightColor = getLightColor(color);
    const button = document.getElementById(color);
    // Alterna a cor do botão para a cor clara durante 500ms
    button.style.backgroundColor = lightColor;
    await sleep(500);
    button.style.backgroundColor = color;
  };

  const getLightColor = (color) => {
    switch (color) {
      case 'red':
        return '#ff9999'; // Vermelho claro
      case 'blue':
        return '#99ccff'; // Azul claro
      case 'yellow':
        return '#ffff99'; // Amarelo claro
      case 'green':
        return '#99ff99'; // Verde claro
    }
  };

  const sleep = (ms) => {
    // Função de utilidade para aguardar um determinado número de milissegundos
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  return (
    <div>
      <h1>GENIUS</h1>
      <button className={styles.botaoStart} onClick={startGame}>Start</button>
      <div className={styles.jogo}>
        <div className={styles.circulo}>
          <div>
            <GeniusButton color={"red"} roundedCorner={"top-left"} />
            <GeniusButton color={"blue"} roundedCorner={"top-right"} />
          </div>
          <div>
            <GeniusButton color={"yellow"} roundedCorner={"bottom-left"} />
            <GeniusButton color={"green"} roundedCorner={"bottom-right"} />
          </div>
        </div>
      </div>

      <div className={styles.status}>
        <span>Nível: {nivel}</span>
        <span>Nível máximo: {nivelMaximo}</span>
      </div>
    </div>
  );
}

export default Layout;
