import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin | Abadan Haly',
  description: 'Admin dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
