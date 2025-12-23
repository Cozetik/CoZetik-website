import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
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
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      {previewText && (
        <Text style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0 }}>
          {previewText}
        </Text>
      )}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Ligne vert subtile top */}
          <Section style={topBorderStyle} />

          {/* Header blanc minimaliste */}
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Cozetik</Text>
          </Section>

          {/* Contenu principal */}
          <Section style={contentStyle}>
            {children}
          </Section>

          {/* Footer blanc minimaliste */}
          <Hr style={footerDividerStyle} />
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © {currentYear} Cozetik
            </Text>
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
// STYLES - Design Épuré 2025 (Bricolage Grotesque)
// ============================================

const bodyStyle: React.CSSProperties = {
  margin: '0',
  padding: '0',
  backgroundColor: '#FFFFFF',
  fontFamily: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '0',
  overflow: 'hidden',
};

// Ligne vert subtile top
const topBorderStyle: React.CSSProperties = {
  height: '2px',
  backgroundColor: '#5E985E',
  margin: '0',
};

// Header blanc minimaliste
const headerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '40px 30px 20px',
  textAlign: 'center' as const,
};

const logoTextStyle: React.CSSProperties = {
  margin: '0',
  color: '#262626',
  fontSize: '28px',
  fontWeight: '400',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  letterSpacing: '0.5px',
};

// Contenu
const contentStyle: React.CSSProperties = {
  padding: '30px 40px 50px',
  backgroundColor: '#FFFFFF',
};

// Footer blanc minimaliste
const footerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '20px 30px 40px',
  textAlign: 'center' as const,
};

const footerTextStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
  color: '#999999',
  fontSize: '14px',
  lineHeight: '1.5',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  fontWeight: '400',
};

const footerDividerStyle: React.CSSProperties = {
  borderColor: '#E5E7EB',
  borderWidth: '1px',
  margin: '32px 0 20px',
};

const socialLinksStyle: React.CSSProperties = {
  marginTop: '8px',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#666666',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '400',
  fontFamily: '"Bricolage Grotesque", sans-serif',
};

const footerSeparatorStyle: React.CSSProperties = {
  display: 'inline-block',
  margin: '0 12px',
  color: '#999999',
  fontSize: '14px',
};

export default CozetikLayout;
