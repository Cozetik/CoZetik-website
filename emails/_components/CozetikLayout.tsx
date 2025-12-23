import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Hr,
} from '@react-email/components';

interface CozetikLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const CozetikLayout = ({ children, previewText }: CozetikLayoutProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      {previewText && (
        <Text style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0 }}>
          {previewText}
        </Text>
      )}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header Noir Cozetik */}
          <Section style={headerStyle}>
            <Row>
              <Column>
                <Text style={logoTextStyle}>Cozetik</Text>
              </Column>
            </Row>
          </Section>

          {/* Contenu principal */}
          <Section style={contentStyle}>
            {children}
          </Section>

          {/* Footer Noir Cozetik */}
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
        </Container>
      </Body>
    </Html>
  );
};

// ============================================
// STYLES - Charte Cozetik 2025
// ============================================

const bodyStyle: React.CSSProperties = {
  margin: '0',
  padding: '0',
  backgroundColor: '#FDFDFD', // Blanc cassé Cozetik
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '0', // Carré Cozetik signature
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};

// Header Noir
const headerStyle: React.CSSProperties = {
  backgroundColor: '#262626', // Noir Cozetik
  padding: '40px 30px',
  textAlign: 'center' as const,
};

const logoTextStyle: React.CSSProperties = {
  margin: '0',
  color: '#FFFFFF',
  fontSize: '32px',
  fontWeight: 'bold',
  fontFamily: 'Borel, cursive',
  letterSpacing: '1px',
};

// Contenu
const contentStyle: React.CSSProperties = {
  padding: '40px 30px',
  backgroundColor: '#FFFFFF',
};

// Footer Noir
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
};

const footerSeparatorStyle: React.CSSProperties = {
  display: 'inline-block',
  margin: '0 10px',
  color: '#666666',
  fontSize: '13px',
};

export default CozetikLayout;
