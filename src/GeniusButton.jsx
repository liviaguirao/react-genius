import styles from "./GeniusButton.module.css";
export default function GeniusButton({ color, onClick, roundedCorner }) {
  return (
    <button
      id={color} // Adiciona o ID correspondente à cor
      className={styles.geniusButton}
      data-color={color} data-rounded-corner={roundedCorner}
      onClick={() => onClick(color)}
    />
  );
}
