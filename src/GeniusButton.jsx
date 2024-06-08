import React, { useState, useEffect, useRef } from 'react';
import styles from "./GeniusButton.module.css";
import { motion } from 'framer-motion';

export default function GeniusButton({ frequency, color, lightColor, onClick, roundedCorner, disabled, Blink }) {
  const oscillator = useRef(null);
  const gainNode = useRef(null);

  useEffect(() => {
    if (Blink) {
      startOscillator();
    } else {
      stopOscillator();
    }

    return () => {
      stopOscillator();
    };
  }, [Blink]);

  const startOscillator = () => {
    if (!oscillator.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      oscillator.current = audioContext.createOscillator();
      gainNode.current = audioContext.createGain();
      oscillator.current.frequency.value = frequency;
      oscillator.current.type = 'sine';
      oscillator.current.connect(gainNode.current);
      gainNode.current.connect(audioContext.destination);
      oscillator.current.start(0);
      gainNode.current.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
    }
  };

  const stopOscillator = () => {
    if (oscillator.current) {
      oscillator.current.stop();
      oscillator.current.disconnect();
      gainNode.current.disconnect();
      oscillator.current = null;
    }
  };

  /// Assim eu seleciono qual o css vou pegar, passando ele como classname lá em baixo.
  /// desse modo, para acessar os elementos basta usar coloClass.backgroudcolor etc
  const colorClasses = {
    red: styles.geniusButtonRED,
    blue: styles.geniusButtonBLUE,
    yellow: styles.geniusButtonYELLOW,
    green: styles.geniusButtonGREEN,
  };
  
  const colorClass = colorClasses[color] || styles.geniusButton;

  /////////////////////////////////////////////////
 
  const variants = {
    normal: {
      backgroundColor: colorClass.backgroundColor,
      transition: { duration: 0.2 }
    },
    blinking: {
      background: lightColor,
      transition: { duration: 0.2, yoyo: Infinity}
    }
  };

  

  return (
    <motion.button
      variants={variants}
      initial="normal"
      id={color}
      className={`${styles.geniusButton} ${colorClass}`}
      data-cor={color}
      disabled = {disabled}
      data-rounded-corner={roundedCorner}
      onClick={() => {onClick(color)}}
      animate={Blink ? "blinking" : "normal"}
    />
  );
}

