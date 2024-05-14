import React, { useState, useEffect } from 'react';
import GeniusButton from "./GeniusButton";
import styles from "./Layout.module.css";

function Layout() {
  const [sequence, setSequence] = useState([]);
  var sequenceclick = Array.from({ length: 0 });
  var nivel = 1;
  const [nivelMaximo, setNivelMaximo] = useState(1);



  const startGame = () => {
    const newSequence = generateSequence(); // Salva a nova sequência
    console.log('Sequência a:', newSequence); // Loga a nova sequência
    setTimeout(() => playSequence(newSequence), 1000); // Passa a nova sequência para playSequence após 1 segundo

  };

  const playSequence = async (sequence) => { // Recebe a sequência como argumento
    console.log('piscando');
    for (let i = 0; i < nivel; i++) {
      // Obtém a cor correspondente ao número na sequência
      const color = getColorFromNumber(sequence[i]);
      // Aguarda 1 segundo antes de mudar para a próxima cor
      await sleep(1000);
      // Faz o botão piscar durante 1 segundo
      await blinkButton(color);
    }
  };

  const generateSequence = () => {
    let newSequence;
    do {
      newSequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 4));
    } while (newSequence.every(num => num === 0)); // Verifica se todos são 0
    console.log('Sequência atual:', newSequence);
    setSequence(newSequence);
    return newSequence; // Retorna a nova sequência
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
        return 'rgb(255, 255, 246)'; // Amarelo claro
      case 'green':
        return '#99ff99'; // Verde claro
    }
  };

  const sleep = (ms) => {
    // Função de utilidade para aguardar um determinado número de milissegundos
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  let cont = 0;
  function handleButtonClick(color) {
    // Esta função será chamada quando um botão for clicado
    console.log('Botão ${color} clicado');
    sequenceclick = sequenceclick.concat(color);
    console.log(sequenceclick);
  };

  function verifica() {
    console.log(" sequenceclick.length: " + sequenceclick.length);
    var acertou = true;
    for (let int = 0; int < sequenceclick.length; int++) {
      if (sequenceclick[int] != getColorFromNumber(sequence[int])) {
        acertou = false;
        console.log('cor errada ! ' + (int) + '° cor selecionada: ' + sequenceclick[int] + ' alternativa correta: ' + getColorFromNumber(sequence[int]));
      }
    }
    if (acertou) {
      sequenceclick.splice(0, sequenceclick.length);
      nivel++;
      setTimeout(() => playSequence(sequence), 1000);
    }
    else {
      alert('Você errou a sequência! Tente novamente.');
    }
  }
  function handleCombinedClick(color) {
    handleButtonClick(color);
    if (sequenceclick.length === nivel) {
      verifica();
    }
  }
  
  return (
    <div>
      <h1>GENIUS</h1>
      <button className={styles.botaoStart} onClick={startGame}>Start</button>
      <div className={styles.jogo}>
        <div className={styles.circulo}>
          <div>
            <GeniusButton color={"red"} roundedCorner={"top-left"} onClick={handleCombinedClick} />
            <GeniusButton color={"blue"} roundedCorner={"top-right"} onClick={handleCombinedClick} />
          </div>
          <div>
            <GeniusButton color={"yellow"} roundedCorner={"bottom-left"} onClick={handleCombinedClick} />
            <GeniusButton color={"green"} roundedCorner={"bottom-right"} onClick={handleCombinedClick} />
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