import React, { useState, useEffect, useRef } from 'react';
import styles from "./GeniusButton.module.css";
import { motion } from 'framer-motion';

export default function GeniusButton({color, onClick, disabled, Blink }) {
  const oscillator = useRef(null);
  const gainNode = useRef(null);
  let frequency;
  let lightColor;
  let roundedCorner;

  switch (color) {
    case 'red':
      frequency = 250;
      lightColor='radial-gradient(96.6% 60.29% at 50% 50%, rgba(255, 255, 255, 0.50) 0%, rgba(233, 0, 0, 0.50) 100%), #F30000';
      roundedCorner="top-left";
      break;
    case 'blue':
      frequency=500;
      lightColor='radial-gradient(103% 67.48% at 50% 50%, rgba(222, 221, 255, 0.50) 0%, rgba(4, 0, 191, 0.50) 100%), #0400D0';
      roundedCorner="top-right";
      break;
    case 'yellow':
      frequency=800;
      lightColor='radial-gradient(69.01% 47.53% at 50% 50%, rgba(255, 255, 185, 0.86) 0%, rgba(255, 255, 0, 0.86) 51%, rgba(255, 214, 0, 0.86) 100%), #FFD600';
      roundedCorner="bottom-left";
    
      break;
    case 'green':
      frequency=1100;
      lightColor='radial-gradient(96.54% 52.86% at 50.22% 49.83%, rgba(255, 255, 255, 0.50) 0%, rgba(148, 255, 131, 0.50) 38%, rgba(95, 216, 75, 0.50) 69%, rgba(27, 191, 0, 0.50) 99%), #1BBF00';
      roundedCorner="bottom-right";
      break;
    default:
      frequency=0;
      lightColor='#0000';
      roundedCorner="bottom-right";
      break;
  }

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
  const variants = {
    normal: {
      backgroundColor: color,
      transition: { duration: 0.2 }
    },
    blinking: {
      background: lightColor,
      transition: { duration: 0.2, yoyo: Infinity }
    }
  };

  return (  
    <motion.button
      variants={variants}
      initial="normal"
      id={color}
      className={styles.geniusButton}
      disabled={disabled}
      data-rounded-corner={roundedCorner}
      onClick={() => { onClick(color) }}
      animate={Blink ? "blinking" : "normal"}
    />
  );
}

