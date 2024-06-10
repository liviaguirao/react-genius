import React, { useState, useEffect, useRef } from 'react';
import GeniusButton from "./GeniusButton";
import styles from "./Jogo.module.css";

function Jogo() {
  const [sequence, setSequence] = useState([]);
  const [clickable, setClickable] = useState(false);
  const [showErrorButton, setShowErrorButton] = useState(false);
  const [BlinkRed, setBlinkRed] = useState(false);
  const [BlinkBlue, setBlinkBlue] = useState(false);
  const [BlinkYellow, setBlinkYellow] = useState(false);
  const [BlinkGreen, setBlinkGreen] = useState(false);

  const sequenceclick = useRef(0);
  const nivelRef = useRef(0);
  const nivelMaximo = useRef(1);

  const startGame = () => {
    setShowErrorButton(false);
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
        return '#ff9900';
      case 3:
        return 'green';
      default:
        return '';
    }
  };

  async function blinkButton(color) {

    if (color === 'red')
      setBlinkRed(true);
    else if (color === 'blue')
      setBlinkBlue(true);
    else if (color === 'green')
      setBlinkGreen(true);
    else { setBlinkYellow(true) };

    await sleep(500);

    setBlinkRed(false);
    setBlinkBlue(false);
    setBlinkGreen(false);
    setBlinkYellow(false);
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  function verifica(color) {
    var acertou = true;

    if (color !== getColorFromNumber(sequence[sequenceclick.current])) {
      acertou = false;
    }
    if (!acertou) {
      setShowErrorButton(true);
      sequenceclick.current = 0;
      setClickable(false); // Desativa os cliques após o erro
      return false;
    }
    return true;
  }

  function handleCombinedClick(color) {
    if (!clickable) return; // Impede cliques se não for permitido
    blinkButton(color);
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
    <body>
        <h1>GENIUS</h1>
        <div className={styles.jogo}>
          <button
            className={styles.botaoErro}
            disabled={!showErrorButton}
            onClick={startGame} >
            Você errou, clique aqui para tentar novamente
          </button>
          <div className={styles.circulo}>
            <button className={styles.botaoStart} onClick={startGame} disabled={clickable}>Start</button>
            <div>
              <GeniusButton color={"red"} onClick={() => handleCombinedClick('red')} disabled={!clickable} Blink={BlinkRed} />
              <GeniusButton color={"blue"} onClick={() => handleCombinedClick('blue')} disabled={!clickable} Blink={BlinkBlue} />
            </div>
            <div>
              <GeniusButton color={"yellow"} onClick={() => handleCombinedClick('#ff9900')} disabled={!clickable} Blink={BlinkYellow} />
              <GeniusButton color={"green"} onClick={() => handleCombinedClick('green')} disabled={!clickable} Blink={BlinkGreen} />
            </div>
          </div>
        </div>

        <div className={styles.status}>
          <span>Nível: {nivelRef.current + 1}</span>
          <span>Nível máximo: {nivelMaximo.current}</span>
        </div>
    </body>
  );
}

export default Jogo;
