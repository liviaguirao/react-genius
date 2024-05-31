import React from 'react';
import styles from "./GeniusButton.module.css";
import { motion } from 'framer-motion';

export default function GeniusButton({ color, lightColor, onClick, roundedCorner, disabled, Blink }) {
  const variants = {
    normal: {
      backgroundColor: color,
      transition: { duration: 0.2 }
    },
    blinking: {
      backgroundColor: 'white',
      transition: { duration: 0.2, yoyo: Infinity }
    }
  };
  return (
    <motion.button
      variants={variants}
      initial="normal"
      id={color} // Adiciona o ID correspondente à cor
      className={`${styles.geniusButton} ${disabled ? styles.disabled : ''}`}
      data-rounded-corner={roundedCorner}
      onClick={() => !disabled && onClick(color)} // Ignora cliques se desabilitado
      animate={Blink ? "blinking" : "normal"}
    />
  );
}
