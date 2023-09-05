import { useEffect, useState } from "preact/hooks";
import styles from "./Buttons.module.css";

export function DivButtons() {
  const [inView, setInView] = useState(0);

  return !inView ? (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div className={styles.button} onClick={() => setInView(num)}>
          #{num}
        </div>
      ))}
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.button} onClick={() => setInView(0)}>
        #{inView} details (click to return)
      </div>
    </div>
  );
}

export function PlainButtons() {
  const [inView, setInView] = useState(0);

  return !inView ? (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <button className={styles.button} onClick={() => setInView(num)}>
          #{num}
        </button>
      ))}
    </div>
  ) : (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => setInView(0)}>
        #{inView} details (click to return)
      </button>
    </div>
  );
}

export function FancyButtons() {
  const [inView, setInView] = useState(0);

  return !inView ? (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <button
          className={styles["fancy-button"]}
          onClick={() => setInView(num)}
        >
          #{num}
        </button>
      ))}
    </div>
  ) : (
    <div className={styles.container}>
      <button className={styles["fancy-button"]} onClick={() => setInView(0)}>
        #{inView} details (click to return)
      </button>
    </div>
  );
}
