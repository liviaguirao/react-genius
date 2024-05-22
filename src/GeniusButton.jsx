import React from 'react';
import styles from "./GeniusButton.module.css";

export default function GeniusButton({ color, onClick, roundedCorner, disabled }) {
  return (
    <button
      id={color} // Adiciona o ID correspondente à cor
      className={`${styles.geniusButton} ${disabled ? styles.disabled : ''}`}
      data-color={color} data-rounded-corner={roundedCorner}
      onClick={() => !disabled && onClick(color)} // Ignora cliques se desabilitado
    />
  );
}
