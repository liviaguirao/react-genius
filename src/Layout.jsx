import GeniusButton from "./GeniusButton";
import styles from "./Layout.module.css";

function Layout() {
  const nivel = 1;
  const nivelMaximo = 1;

  return (
    <div>
      <h1>GENIUS</h1>
      <button className={styles.botaoStart}>Start</button>
      <div className={styles.jogo}>
        <div className={styles.circulo}>
          <div>
            <GeniusButton color={"red"} roundedCorner={"top-left"} />
            <GeniusButton color={"blue"} roundedCorner={"top-right"} />
          </div>
          <div>
            <GeniusButton color={"yellow"} roundedCorner={"bottom-left"} />
            <GeniusButton color={"green"} roundedCorner={"bottom-right"} />
          </div>
        </div>
      </div>

      <div className={styles.status}>
        <span>Nível: {nivel}</span>
        <span>Nível máximo: {nivelMaximo}</span>
      </div>
    </div>
  );
}
export default Layout;
