import React, { useState, useEffect, useRef } from 'react';
import GeniusButton from "./GeniusButton";
import styles from "./Layout.module.css";

function Layout() {
  const [sequence, setSequence] = useState([]);
  const [clickable, setClickable] = useState(false);
  const [showErrorButton, setShowErrorButton] = useState(false);
  const sequenceclick = useRef(0);
  const nivelRef = useRef(0);
  const nivelMaximo = useRef(1);
  const audioContext = useRef(null);
  const oscillator = useRef(null);
  const gainNode = useRef(null);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const startOscillator = (frequency) => {
    oscillator.current = audioContext.current.createOscillator();
    gainNode.current = audioContext.current.createGain();
    oscillator.current.frequency.value = frequency;
    oscillator.current.type = 'sine';
    oscillator.current.connect(gainNode.current);
    gainNode.current.connect(audioContext.current.destination);
    oscillator.current.start(0);
    gainNode.current.gain.exponentialRampToValueAtTime(0.00001, audioContext.current.currentTime + 0.5);
  };

  const stopOscillator = () => {
    if (oscillator.current) {
      oscillator.current.stop();
      oscillator.current.disconnect();
      gainNode.current.disconnect();
    }
  };

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

  const getFrequencyFromColor = (color) => {
    switch (color) {
      case 'red':
        return 250;
      case 'blue':
        return 500;
      case '#ff9900':
        return 800;
      case 'green':
        return 1100;
      default:
        return 440.0;
    }
  };

  const blinkButton = async (color) => {
    const lightColor = getLightColor(color);
    const button = document.getElementById(color);
    const frequency = getFrequencyFromColor(color);
    startOscillator(frequency);
    button.style.background = lightColor;
    await sleep(500);
    button.style.background = color;
    stopOscillator();
  };

  const getLightColor = (color) => {
    switch (color) {
      case 'red':
        return 'radial-gradient(96.6% 60.29% at 50% 50%, rgba(255, 255, 255, 0.50) 0%, rgba(233, 0, 0, 0.50) 100%), #F30000';
      case 'blue':
        return 'radial-gradient(103% 67.48% at 50% 50%, rgba(222, 221, 255, 0.50) 0%, rgba(4, 0, 191, 0.50) 100%), #0400D0';
      case '#ff9900':
        return 'radial-gradient(69.01% 47.53% at 50% 50%, rgba(255, 255, 185, 0.86) 0%, rgba(255, 255, 0, 0.86) 51%, rgba(255, 214, 0, 0.86) 100%), #FFD600';
      case 'green':
        return 'radial-gradient(96.54% 52.86% at 50.22% 49.83%, rgba(255, 255, 255, 0.50) 0%, rgba(148, 255, 131, 0.50) 38%, rgba(95, 216, 75, 0.50) 69%, rgba(27, 191, 0, 0.50) 99%), #1BBF00';
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
            <GeniusButton color={"red"} roundedCorner={"top-left"} onClick={() => handleCombinedClick('red')} disabled={!clickable} />
            <GeniusButton color={"blue"} roundedCorner={"top-right"} onClick={() => handleCombinedClick('blue')} disabled={!clickable} />
          </div>
          <div>
            <GeniusButton color={"#ff9900"} roundedCorner={"bottom-left"} onClick={() => handleCombinedClick('#ff9900')} disabled={!clickable} />
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
