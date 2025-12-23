import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
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
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body { margin: 0; padding: 0; width: 100% !important; }
          table { border-collapse: collapse; }

          @media only screen and (max-width: 600px) {
            .header { padding: 30px 20px !important; }
            .logo { font-size: 28px !important; }
            .content { padding: 30px 20px !important; }
            .title { font-size: 26px !important; }
            .text { font-size: 16px !important; }
            .card { padding: 20px !important; }
            .button { padding: 14px 30px !important; font-size: 15px !important; }
            .footer { padding: 25px 20px !important; }
          }
        `}</style>
      </Head>
      {previewText && (
        <Text style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0, maxHeight: 0, maxWidth: 0 }}>
          {previewText}
        </Text>
      )}
      <Body style={bodyStyle}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Ligne verte top */}
          <tr>
            <td>
              <div style={topBorderStyle} />
            </td>
          </tr>

          {/* Header */}
          <tr>
            <td align="center" style={headerStyle} className="header">
              <Text style={logoTextStyle} className="logo">Cozetik</Text>
            </td>
          </tr>

          {/* Contenu */}
          <tr>
            <td align="center">
              <Container style={containerStyle}>
                <Section style={contentStyle} className="content">
                  {children}
                </Section>
              </Container>
            </td>
          </tr>

          {/* Ligne séparation */}
          <tr>
            <td align="center">
              <Hr style={dividerStyle} />
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td align="center" style={footerStyle} className="footer">
              <Text style={footerTextStyle}>
                © {currentYear} Cozetik — Tous droits réservés
              </Text>
              <div style={{ marginTop: '12px' }}>
                <Link href="https://cozetik.fr" style={footerLinkStyle}>Site web</Link>
                <Text style={footerSeparatorStyle}>•</Text>
                <Link href="https://cozetik.fr/contact" style={footerLinkStyle}>Contact</Link>
                <Text style={footerSeparatorStyle}>•</Text>
                <Link href="https://cozetik.fr/formations" style={footerLinkStyle}>Formations</Link>
              </div>
            </td>
          </tr>

          {/* Ligne verte bottom */}
          <tr>
            <td>
              <div style={bottomBorderStyle} />
            </td>
          </tr>
        </table>
      </Body>
    </Html>
  );
};

// ============================================
// STYLES - Design Moderne Cozetik 2025
// ============================================

const bodyStyle: React.CSSProperties = {
  margin: '0',
  padding: '0',
  backgroundColor: '#F8F9FA',
  fontFamily: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  width: '100%',
};

const topBorderStyle: React.CSSProperties = {
  height: '6px',
  background: 'linear-gradient(90deg, #5E985E 0%, #4A7A4A 100%)',
  width: '100%',
  margin: '0',
};

const bottomBorderStyle: React.CSSProperties = {
  height: '6px',
  background: 'linear-gradient(90deg, #5E985E 0%, #4A7A4A 100%)',
  width: '100%',
  margin: '0',
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '40px 20px 30px',
  borderBottom: '1px solid #E5E7EB',
};

const logoTextStyle: React.CSSProperties = {
  margin: '0',
  color: '#262626',
  fontSize: '36px',
  fontWeight: '700',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  letterSpacing: '-0.5px',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  width: '100%',
};

const contentStyle: React.CSSProperties = {
  padding: '50px 30px',
  backgroundColor: '#FFFFFF',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#E5E7EB',
  borderWidth: '1px',
  width: '90%',
  margin: '0 auto',
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  padding: '35px 20px',
  borderTop: '1px solid #E5E7EB',
};

const footerTextStyle: React.CSSProperties = {
  margin: '0',
  color: '#6B7280',
  fontSize: '13px',
  lineHeight: '1.6',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  fontWeight: '400',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#5E985E',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: '500',
  fontFamily: '"Bricolage Grotesque", sans-serif',
};

const footerSeparatorStyle: React.CSSProperties = {
  display: 'inline-block',
  margin: '0 8px',
  color: '#D1D5DB',
  fontSize: '13px',
};

export default CozetikLayout;
