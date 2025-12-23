import * as React from 'react';
import { Button } from '@react-email/components';

interface CozetikButtonProps {
  href: string;
  children: React.ReactNode;
}

export const CozetikButton = ({ href, children }: CozetikButtonProps) => {
  return (
    <Button href={href} style={buttonStyle} className="button">
      {children}
    </Button>
  );
};

// ============================================
// STYLES - Bouton Moderne Cozetik
// ============================================

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '16px 40px',
  backgroundColor: '#5E985E',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(94, 152, 94, 0.25)',
  transition: 'all 0.2s ease',
  fontFamily: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  letterSpacing: '0.3px',
};

export default CozetikButton;
