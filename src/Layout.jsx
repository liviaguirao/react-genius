import React, { useState, useEffect, useRef } from 'react';
import GeniusButton from "./GeniusButton";
import styles from "./Layout.module.css";

function Layout() {
  const [sequence, setSequence] = useState([]);
  const [sequenceclick, setSequenceClick] = useState([]);
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
    nivelRef.current = 0;
    const newSequence = generateSequence();
    console.log('Sequência a:', newSequence);
    setTimeout(() => playSequence(newSequence), 1000);
  };

  const playSequence = async (sequence) => {
    console.log('piscando');
    const baseInterval = 1000;
    const numButtons = nivelRef.current + 1;
    const interval = baseInterval / Math.sqrt(numButtons);

    for (let i = 0; i <= nivelRef.current; i++) {
      const color = getColorFromNumber(sequence[i]);
      await sleep(interval);
      await blinkButton(color);
    }
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

  const getFrequencyFromColor = (color) => {
    switch (color) {
      case 'red':
        return 250;
      case 'blue':
        return 500; 
      case 'yellow':
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
    button.style.backgroundColor = lightColor;
    await sleep(500);
    button.style.backgroundColor = color;
    stopOscillator();
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

  function handleButtonClick(color) {
    console.log(`Botão ${color} clicado`);
    const frequency = getFrequencyFromColor(color);
    startOscillator(frequency);
    setTimeout(stopOscillator, 500);
    setSequenceClick(prevClicks => [...prevClicks, color]);
  };

  function verifica() {
    console.log(" sequenceclick.length: " + sequenceclick.length);
    var acertou = true;
    for (let int = 0; int < sequenceclick.length; int++) {
      if (sequenceclick[int] !== getColorFromNumber(sequence[int])) {
        acertou = false;
        console.log('cor errada ! ' + (int) + '° cor selecionada: ' + sequenceclick[int] + ' alternativa correta: ' + getColorFromNumber(sequence[int]));
      }
    }
    if (acertou) {
      setSequenceClick([]);
      nivelRef.current++;
      if(nivelRef.current > nivelMaximo.current){
        nivelMaximo.current++;
      }
      setTimeout(() => playSequence(sequence), 1000);
    } else {
      setSequenceClick([]);
      alert('Você errou a sequência! Tente novamente.');
    }
  }

  function handleCombinedClick(color) {
    handleButtonClick(color);
    if (sequenceclick.length === nivelRef.current) {
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
        <span>Nível: {nivelRef.current + 1}</span>
        <span>Nível máximo: {nivelMaximo.current}</span>
      </div>
    </div>
  );
}

export default Layout;
