import { Inter } from 'next/font/google';
import './globals.css';
import { ReportProvider } from '../context/ReportContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Idea Validator',
  description: 'Validate your startup ideas with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter`}
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <ReportProvider>
          <main
            style={{
              minHeight: '100vh',
              width: '100%',
              maxWidth: 900,
              margin: '0 auto',
              padding: '2rem 1rem',
            }}
          >
            {children}
          </main>
        </ReportProvider>
      </body>
    </html>
  );
}
