import * as React from 'react';
import { Section, Text, Link, Row, Column, Hr } from '@react-email/components';

export const CozetikFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Section style={footerStyle}>
      <Text style={footerTextStyle}>
        © {currentYear} Cozetik. Tous droits réservés.
      </Text>
      <Hr style={footerDividerStyle} />
      <Row style={socialLinksStyle}>
        <Column align="center">
          <Link href="https://cozetik.fr" style={footerLinkStyle}>
            Site web
          </Link>
          <Text style={footerSeparatorStyle}>•</Text>
          <Link href="https://cozetik.fr/contact" style={footerLinkStyle}>
            Contact
          </Link>
          <Text style={footerSeparatorStyle}>•</Text>
          <Link href="https://cozetik.fr/formations" style={footerLinkStyle}>
            Formations
          </Link>
        </Column>
      </Row>
    </Section>
  );
};

// ============================================
// STYLES - Footer Noir Cozetik
// ============================================

const footerStyle: React.CSSProperties = {
  backgroundColor: '#262626', // Noir Cozetik
  padding: '30px 30px 20px',
  textAlign: 'center' as const,
};

const footerTextStyle: React.CSSProperties = {
  margin: '0 0 15px 0',
  color: '#999999',
  fontSize: '12px',
  lineHeight: '1.5',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const footerDividerStyle: React.CSSProperties = {
  borderColor: '#404040',
  margin: '15px 0',
};

const socialLinksStyle: React.CSSProperties = {
  marginTop: '10px',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: '500',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const footerSeparatorStyle: React.CSSProperties = {
  display: 'inline-block',
  margin: '0 10px',
  color: '#666666',
  fontSize: '13px',
};

export default CozetikFooter;
