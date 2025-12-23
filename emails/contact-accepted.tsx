import * as React from 'react';
import { CozetikLayout } from './_components/CozetikLayout';
import { CozetikButton } from './_components/CozetikButton';
import { Text, Section, Hr } from '@react-email/components';

interface ContactAcceptedProps {
  name: string;
}

export const ContactAccepted = ({ name = 'Utilisateur' }: ContactAcceptedProps) => {
  return (
    <CozetikLayout previewText={`Bonjour ${name}, votre demande a été acceptée !`}>
      {/* Hero Title */}
      <Section style={heroSectionStyle}>
        <Text style={titleStyle}>✅ Demande Acceptée</Text>
      </Section>

      {/* Greeting */}
      <Text style={greetingStyle}>Bonjour {name} ! 🎉</Text>

      {/* Message */}
      <Text style={paragraphStyle}>
        Excellente nouvelle ! Votre demande de contact a été acceptée par notre équipe.
      </Text>

      {/* Info Box Beige */}
      <Section style={infoBoxStyle}>
        <Text style={infoTitleStyle}>📧 Prochaines étapes</Text>
        <Text style={infoTextStyle}>
          Nous allons vous contacter dans les plus brefs délais pour discuter de votre demande en détail.
        </Text>
      </Section>

      <Hr style={dividerStyle} />

      {/* CTA Button */}
      <Section style={ctaSectionStyle}>
        <CozetikButton href="https://cozetik.fr/contact">
          Consulter ma demande
        </CozetikButton>
      </Section>

      <Hr style={dividerStyle} />

      {/* Closing */}
      <Text style={paragraphStyle}>
        Nous avons hâte de vous accompagner dans votre projet !
      </Text>

      <Text style={signatureStyle}>
        <strong style={{ color: '#5E985E' }}>L'équipe Cozetik</strong>
      </Text>
    </CozetikLayout>
  );
};

// ============================================
// STYLES - Charte Cozetik 2025
// ============================================

const heroSectionStyle: React.CSSProperties = {
  backgroundColor: '#F2E7D8', // Beige Cozetik
  padding: '30px 20px',
  textAlign: 'center' as const,
  marginBottom: '30px',
  borderRadius: '0', // Carré Cozetik
};

const titleStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#262626', // Noir Cozetik
  fontFamily: 'Borel, cursive',
};

const greetingStyle: React.CSSProperties = {
  margin: '0 0 20px 0',
  fontSize: '24px',
  fontWeight: '600',
  color: '#262626',
  fontFamily: 'Borel, cursive',
};

const paragraphStyle: React.CSSProperties = {
  margin: '0 0 20px 0',
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#666666',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: '#F2E7D8', // Beige Cozetik
  borderLeft: '4px solid #5E985E', // Vert Cozetik
  padding: '20px',
  marginTop: '20px',
  marginBottom: '20px',
  borderRadius: '0', // Carré
};

const infoTitleStyle: React.CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#262626',
  fontFamily: 'Inter, sans-serif',
};

const infoTextStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333333',
  fontFamily: 'Inter, sans-serif',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#E5E5E5',
  margin: '30px 0',
};

const ctaSectionStyle: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const signatureStyle: React.CSSProperties = {
  margin: '20px 0 0 0',
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#666666',
  fontFamily: 'Inter, sans-serif',
};

export default ContactAccepted;
