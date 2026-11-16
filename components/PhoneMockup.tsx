import styles from './PhoneMockup.module.css';

interface Props {
  /** Real app screenshot (portrait). Falls back to the app icon on a branded screen. */
  screenshot?: string;
  icon?: string;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  tilt?: boolean;
}

export default function PhoneMockup({ screenshot, icon, title, subtitle, size = 'md', tilt }: Props) {
  return (
    <div className={`${styles.phone} ${styles[size]} ${tilt ? styles.tilt : ''}`}>
      <div className={styles.notch} />
      <div className={styles.screen}>
        {screenshot ? (
          <img src={screenshot} alt={`${title} screenshot`} className={styles.shot} loading="lazy" />
        ) : (
          <div className={styles.splash}>
            <div className={styles.glow} />
            {icon ? (
              <img src={icon} alt={`${title} icon`} className={styles.icon} loading="lazy" />
            ) : (
              <div className={styles.iconFallback}>{title.charAt(0)}</div>
            )}
            <strong className={styles.appName}>{title}</strong>
            {subtitle && <span className={styles.appSub}>{subtitle}</span>}
            <div className={styles.fakeUi}>
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
