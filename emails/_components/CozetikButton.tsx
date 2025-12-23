import * as React from 'react';
import { Button } from '@react-email/components';

interface CozetikButtonProps {
  href: string;
  children: React.ReactNode;
}

export const CozetikButton = ({ href, children }: CozetikButtonProps) => {
  return (
    <Button href={href} style={buttonStyle}>
      {children}
    </Button>
  );
};

// ============================================
// STYLES - CTA Vert Cozetik 2025
// ============================================

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '16px 32px',
  backgroundColor: '#5E985E', // Vert Cozetik
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  borderRadius: '0', // Carré Cozetik signature
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(94, 152, 94, 0.25)',
  transition: 'all 0.2s ease',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export default CozetikButton;
