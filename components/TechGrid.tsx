import {
  SiFlutter, SiDart, SiReact, SiKotlin, SiSwift, SiJetpackcompose, SiFirebase, SiSupabase,
  SiNodedotjs, SiGooglecloud, SiOpenai, SiGooglegemini, SiAnthropic, SiTensorflow, SiFastlane,
  SiGithubactions, SiAppstore, SiGoogleplay, SiFigma, SiGit, SiAndroid,
} from 'react-icons/si';
import { TbApi, TbBrandKotlin } from 'react-icons/tb';
import { IconType } from 'react-icons';
import { TECH_GROUPS } from '@/lib/site';
import styles from './TechGrid.module.css';

const ICONS: Record<string, [IconType, string]> = {
  Flutter: [SiFlutter, '#54C5F8'],
  Dart: [SiDart, '#0FB6D6'],
  'React Native': [SiReact, '#61DAFB'],
  'Kotlin Multiplatform': [TbBrandKotlin, '#B57BFF'],
  Kotlin: [SiKotlin, '#B57BFF'],
  Java: [SiAndroid, '#3DDC84'],
  Swift: [SiSwift, '#FA7343'],
  'Jetpack Compose': [SiJetpackcompose, '#4285F4'],
  Firebase: [SiFirebase, '#FFCA28'],
  Supabase: [SiSupabase, '#3ECF8E'],
  'REST APIs': [TbApi, '#a3a8b8'],
  'Node.js': [SiNodedotjs, '#5FA04E'],
  'Google Cloud': [SiGooglecloud, '#4285F4'],
  OpenAI: [SiOpenai, '#ffffff'],
  Gemini: [SiGooglegemini, '#8E75FF'],
  Claude: [SiAnthropic, '#D97757'],
  'TensorFlow Lite': [SiTensorflow, '#FF8F00'],
  Fastlane: [SiFastlane, '#00F200'],
  'GitHub Actions': [SiGithubactions, '#2088FF'],
  'App Store': [SiAppstore, '#0D96F6'],
  'Google Play': [SiGoogleplay, '#34A853'],
  Figma: [SiFigma, '#F24E1E'],
  Git: [SiGit, '#F05032'],
};

export function TechIcon({ name, size = 22 }: { name: string; size?: number }) {
  const [Icon, color] = ICONS[name] || [TbApi, '#a3a8b8'];
  return <Icon size={size} color={color} aria-hidden />;
}

export default function TechGrid({ compact = false }: { compact?: boolean }) {
  if (compact) {
    const all = TECH_GROUPS.flatMap((g) => g.items);
    return (
      <div className={styles.flat}>
        {all.map((t) => (
          <div key={t} className={styles.tile}>
            <TechIcon name={t} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={styles.groups}>
      {TECH_GROUPS.map((g) => (
        <div key={g.label} className={styles.group}>
          <h3 className={styles.groupLabel}>{g.label}</h3>
          <div className={styles.flat}>
            {g.items.map((t) => (
              <div key={t} className={styles.tile}>
                <TechIcon name={t} size={26} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
