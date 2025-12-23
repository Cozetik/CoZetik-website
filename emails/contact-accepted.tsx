import * as React from 'react';
import { CozetikLayout } from './_components/CozetikLayout';
import { CozetikButton } from './_components/CozetikButton';
import { Text, Section, Hr } from '@react-email/components';

interface ContactAcceptedProps {
  name: string;
}

export const ContactAccepted = ({ name = 'Utilisateur' }: ContactAcceptedProps) => {
  return (
    <CozetikLayout previewText={`Bonjour ${name}, votre demande a été acceptée`}>
      {/* Titre principal */}
      <Text style={titleStyle}>Votre demande a été acceptée</Text>

      {/* Ligne séparatrice */}
      <Hr style={dividerStyle} />

      {/* Greeting */}
      <Text style={greetingStyle}>Bonjour {name},</Text>

      {/* Message principal */}
      <Text style={paragraphStyle}>
        Nous sommes ravis de vous informer que votre demande de contact a été acceptée par notre équipe.
      </Text>

      {/* Card Prochaines étapes */}
      <Section style={cardStyle}>
        <Text style={cardTitleStyle}>Prochaines étapes</Text>
        <Text style={listItemStyle}>
          • Nous vous recontacterons sous 48 heures
        </Text>
        <Text style={listItemStyle}>
          • Un conseiller dédié vous sera assigné prochainement
        </Text>
      </Section>

      {/* CTA Button */}
      <Section style={ctaSectionStyle}>
        <CozetikButton href="https://cozetik.fr/contact">
          → Consulter ma demande
        </CozetikButton>
      </Section>

      {/* Closing */}
      <Text style={closingStyle}>
        Cordialement,<br />
        L'équipe Cozetik
      </Text>
    </CozetikLayout>
  );
};

// ============================================
// STYLES - Design Épuré (Bricolage Grotesque)
// ============================================

const titleStyle: React.CSSProperties = {
  margin: '0 0 20px 0',
  fontSize: '32px',
  fontWeight: '500',
  color: '#262626',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.2',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#E5E7EB',
  borderWidth: '1px',
  margin: '0 0 32px 0',
};

const greetingStyle: React.CSSProperties = {
  margin: '0 0 24px 0',
  fontSize: '17px',
  fontWeight: '400',
  color: '#262626',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.7',
};

const paragraphStyle: React.CSSProperties = {
  margin: '0 0 32px 0',
  fontSize: '17px',
  fontWeight: '400',
  color: '#666666',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.7',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  borderLeft: '2px solid #5E985E',
  padding: '24px',
  marginBottom: '32px',
  borderRadius: '0',
};

const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 16px 0',
  fontSize: '17px',
  fontWeight: '500',
  color: '#262626',
  fontFamily: '"Bricolage Grotesque", sans-serif',
};

const listItemStyle: React.CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: '16px',
  fontWeight: '400',
  color: '#666666',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.7',
  paddingLeft: '0',
};

const ctaSectionStyle: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const closingStyle: React.CSSProperties = {
  margin: '32px 0 0 0',
  fontSize: '17px',
  fontWeight: '400',
  color: '#666666',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.7',
};

export default ContactAccepted;
