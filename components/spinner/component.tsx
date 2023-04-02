import styles from "./component.module.css";

export default function Spinner(): JSX.Element {
  return <div style={{ border: "thin" }} className={styles.loader}></div>;
}
