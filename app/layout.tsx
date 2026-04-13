import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Kishan Patel — Mobile Application Developer',
  description:
    'Portfolio of Kishan Patel, an IT Mobile Application Developer with 8+ years of experience in Flutter, iOS, Android, and React Native.',
  keywords: [
    'Kishan Patel',
    'Mobile Developer',
    'Flutter',
    'iOS',
    'Android',
    'React Native',
    'Portfolio',
  ],
  openGraph: {
    title: 'Kishan Patel — Mobile Application Developer',
    description: '8+ years of experience in mobile app development. Specializing in Flutter, iOS, Android, and React Native.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
          }}
        />
      </body>
    </html>
  );
}
