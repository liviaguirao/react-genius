import React, { useState, useEffect, useRef } from 'react';
import GeniusButton from "./GeniusButton";
import styles from "./Layout.module.css";

function Layout() {
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

    if(color === 'red')
      setBlinkRed(true);
    else if(color === 'blue')
      setBlinkBlue(true);
    else if(color === 'green')
      setBlinkGreen(true);
    else {setBlinkYellow(true)};

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
    console.log(" sequenceclick " + sequenceclick.current);
    var acertou = true;

    if (color !== getColorFromNumber(sequence[sequenceclick.current])) {
      acertou = false;
      console.log('cor selecionada: ' + color + ' alternativa correta: ' + getColorFromNumber(sequence[sequenceclick.current]));
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
    <div className={styles.body}>
      <h1>GENIUS</h1>
      <div className={styles.jogo}>
          <button
            className={styles.botaoErro}
            disabled = {!showErrorButton}
            onClick={startGame} >
            Você errou, clique aqui para tentar novamente
          </button>
        <div className={styles.circulo}>
          <button className={styles.botaoStart} onClick={startGame}>Start</button>
          <div>
            <GeniusButton frequency={250} color={"red"} lightColor={'radial-gradient(96.6% 60.29% at 50% 50%, rgba(255, 255, 255, 0.50) 0%, rgba(233, 0, 0, 0.50) 100%), #F30000'} roundedCorner={"top-left"} onClick={() => handleCombinedClick('red')} disabled={!clickable} Blink={BlinkRed}/>
            <GeniusButton frequency={500} color={"blue"} lightColor={'radial-gradient(103% 67.48% at 50% 50%, rgba(222, 221, 255, 0.50) 0%, rgba(4, 0, 191, 0.50) 100%), #0400D0'} roundedCorner={"top-right"} onClick={() => handleCombinedClick('blue')} disabled={!clickable} Blink={BlinkBlue}/>
          </div>
          <div>
            <GeniusButton frequency={800} color={"#ff9900"} lightColor={'radial-gradient(69.01% 47.53% at 50% 50%, rgba(255, 255, 185, 0.86) 0%, rgba(255, 255, 0, 0.86) 51%, rgba(255, 214, 0, 0.86) 100%), #FFD600'} roundedCorner={"bottom-left"} onClick={() => handleCombinedClick('#ff9900')} disabled={!clickable} Blink={BlinkYellow}/>
            <GeniusButton frequency={1100} color={"green"} lightColor={'radial-gradient(96.54% 52.86% at 50.22% 49.83%, rgba(255, 255, 255, 0.50) 0%, rgba(148, 255, 131, 0.50) 38%, rgba(95, 216, 75, 0.50) 69%, rgba(27, 191, 0, 0.50) 99%), #1BBF00'} roundedCorner={"bottom-right"} onClick={() => handleCombinedClick('green')} disabled={!clickable} Blink={BlinkGreen}/>
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
