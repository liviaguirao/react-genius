import styles from "./GeniusButton.module.css";

export default function GeniusButton({ color, onClick, roundedCorner }) {
  return (
    <button
      className={styles.geniusButton}
      data-color={color} data-rounded-corner={roundedCorner}
      onClick={() => onClick(color)}
    />
  );
}
