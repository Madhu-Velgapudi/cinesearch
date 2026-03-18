import { useToast } from '../context/ToastContext';
import styles from './Toast.module.css';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

export default function Toast() {
  const { toasts } = useToast();
  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          <span>{ICONS[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}