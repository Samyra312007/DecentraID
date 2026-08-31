import type { Metadata } from 'next';
import { Literata, Nunito_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LayoutShell } from '@/components/layout/LayoutShell';

const literata = Literata({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-literata',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'DecentraID - Decentralized Identity Platform',
  description: 'Self-sovereign identity management on Polygon blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${literata.variable} ${nunitoSans.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <TooltipProvider>
          <LayoutShell>{children}</LayoutShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
