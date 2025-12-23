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
// STYLES - Bouton Outline Élégant (Bricolage Grotesque)
// ============================================

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '14px 36px',
  backgroundColor: 'transparent',
  color: '#5E985E',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  borderRadius: '6px',
  border: '2px solid #5E985E',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export default CozetikButton;
