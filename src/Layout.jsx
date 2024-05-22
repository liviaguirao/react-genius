import React, { useState, useEffect, useRef } from 'react';
import GeniusButton from "./GeniusButton";
import styles from "./Layout.module.css";

function Layout() {
  const [sequence, setSequence] = useState([]);
  const [clickable, setClickable] = useState(false);
  const sequenceclick = useRef(0);
  const nivelRef = useRef(0);
  const nivelMaximo = useRef(1);

  const startGame = () => {
    nivelRef.current = 0;
    const newSequence = generateSequence();
    console.log('Sequência a:', newSequence);
    setTimeout(() => playSequence(newSequence), 1000);
  };

  const playSequence = async (sequence) => {
    console.log('piscando');
    setClickable(false); // Desativa os cliques
    const baseInterval = 1000;
    const numButtons = nivelRef.current + 1;
    const interval = baseInterval / Math.sqrt(numButtons);

    for (let i = 0; i <= nivelRef.current; i++) {
      const color = getColorFromNumber(sequence[i]);
      await sleep(interval);
      await blinkButton(color);
    }
    setClickable(true); // Ativa os cliques após a sequência
  };

  const generateSequence = () => {
    let newSequence;
    do {
      newSequence = Array.from({ length: 200 }, () => Math.floor(Math.random() * 4));
    } while (newSequence.every(num => num === 0));
    console.log('Sequência atual:', newSequence);
    setSequence(newSequence);
    return newSequence;
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
      default:
        return '';
    }
  };

  const blinkButton = async (color) => {
    const lightColor = getLightColor(color);
    const button = document.getElementById(color);
    button.style.backgroundColor = lightColor;
    await sleep(500);
    button.style.backgroundColor = color;
  };

  const getLightColor = (color) => {
    switch (color) {
      case 'red':
        return '#ff9999';
      case 'blue':
        return '#99ccff';
      case 'yellow':
        return '#ffff99';
      case 'green':
        return '#99ff99';
      default:
        return '';
    }
  };

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  function verifica(color) {
    console.log(" sequenceclick " + sequenceclick.current);
    var acertou = true;

    if (color !== getColorFromNumber(sequence[sequenceclick.current])) {
      acertou = false;
      console.log('cor selecionada: ' + color + ' alternativa correta: ' + getColorFromNumber(sequence[sequenceclick.current]));
    }
    if (!acertou) {
      alert('Você errou a sequência! Tente novamente.');
      sequenceclick.current = 0;
      setClickable(false); // Desativa os cliques após o erro
      return false;
    }
    return true;
  }

  function handleCombinedClick(color) {
    if (!clickable) return; // Impede cliques se não for permitido

    if (verifica(color)) {
      sequenceclick.current++;
      
      if (sequenceclick.current > nivelRef.current) {
        if (nivelRef.current >= nivelMaximo.current) {
          nivelMaximo.current++;
        }
        nivelRef.current++;
        sequenceclick.current = 0;
        setTimeout(() => playSequence(sequence), 1000);
      }
    }
  }

  return (
    <div>
      <h1>GENIUS</h1>
      <button className={styles.botaoStart} onClick={startGame}>Start</button>
      <div className={styles.jogo}>
        <div className={styles.circulo}>
          <div>
            <GeniusButton color={"red"} roundedCorner={"top-left"} onClick={() => handleCombinedClick('red')} disabled={!clickable} />
            <GeniusButton color={"blue"} roundedCorner={"top-right"} onClick={() => handleCombinedClick('blue')} disabled={!clickable} />
          </div>
          <div>
            <GeniusButton color={"yellow"} roundedCorner={"bottom-left"} onClick={() => handleCombinedClick('yellow')} disabled={!clickable} />
            <GeniusButton color={"green"} roundedCorner={"bottom-right"} onClick={() => handleCombinedClick('green')} disabled={!clickable} />
          </div>
        </div>
      </div>

      <div className={styles.status}>
        <span>Nível: {nivelRef.current + 1}</span>
        <span>Nível máximo: {nivelMaximo.current}</span>
      </div>
    </div>
  );
}

export default Layout;
