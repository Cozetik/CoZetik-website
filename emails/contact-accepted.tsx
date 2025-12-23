import * as React from 'react';
import { CozetikLayout } from './_components/CozetikLayout';
import { CozetikButton } from './_components/CozetikButton';
import { Text, Section } from '@react-email/components';

interface ContactAcceptedProps {
  name: string;
}

export const ContactAccepted = ({ name = 'Utilisateur' }: ContactAcceptedProps) => {
  return (
    <CozetikLayout previewText={`Bonjour ${name}, votre demande a été acceptée`}>
      {/* Badge Success */}
      <Section style={badgeSectionStyle}>
        <div style={badgeStyle}>
          <span style={checkIconStyle}>✓</span>
        </div>
      </Section>

      {/* Titre principal */}
      <Text style={titleStyle} className="title">
        Demande acceptée
      </Text>

      <Text style={subtitleStyle} className="text">
        Excellente nouvelle !
      </Text>

      {/* Greeting */}
      <Text style={greetingStyle} className="text">
        Bonjour <strong>{name}</strong>,
      </Text>

      {/* Message principal */}
      <Text style={paragraphStyle} className="text">
        Nous sommes ravis de vous informer que votre demande de contact a été <strong>acceptée avec succès</strong> par notre équipe.
      </Text>

      {/* Card Prochaines étapes */}
      <Section style={cardStyle} className="card">
        <Text style={cardTitleStyle} className="text">
          <span style={iconStyle}>→</span> Prochaines étapes
        </Text>
        <div style={listStyle}>
          <Text style={listItemStyle} className="text">
            <span style={bulletStyle}>•</span> Nous vous recontacterons sous 48 heures
          </Text>
          <Text style={listItemStyle} className="text">
            <span style={bulletStyle}>•</span> Un conseiller dédié vous sera assigné
          </Text>
          <Text style={listItemStyle} className="text">
            <span style={bulletStyle}>•</span> Préparez vos questions pour notre échange
          </Text>
        </div>
      </Section>

      {/* CTA Button */}
      <Section style={ctaSectionStyle}>
        <CozetikButton href="https://cozetik.fr/contact">
          Consulter ma demande →
        </CozetikButton>
      </Section>

      {/* Closing */}
      <Text style={closingStyle} className="text">
        Cordialement,
        <br />
        <strong style={{ color: '#5E985E' }}>L'équipe Cozetik</strong>
      </Text>
    </CozetikLayout>
  );
};

// ============================================
// STYLES - Design Moderne Cozetik
// ============================================

const badgeSectionStyle: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#DCFCE7',
  border: '3px solid #5E985E',
  lineHeight: '56px',
  textAlign: 'center' as const,
};

const checkIconStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#5E985E',
};

const iconStyle: React.CSSProperties = {
  color: '#5E985E',
  fontWeight: '600',
  marginRight: '8px',
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: '34px',
  fontWeight: '700',
  color: '#262626',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.2',
  textAlign: 'center' as const,
  letterSpacing: '-0.5px',
};

const subtitleStyle: React.CSSProperties = {
  margin: '0 0 30px 0',
  fontSize: '18px',
  fontWeight: '500',
  color: '#5E985E',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  textAlign: 'center' as const,
};

const greetingStyle: React.CSSProperties = {
  margin: '0 0 20px 0',
  fontSize: '17px',
  fontWeight: '400',
  color: '#374151',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.7',
};

const paragraphStyle: React.CSSProperties = {
  margin: '0 0 30px 0',
  fontSize: '17px',
  fontWeight: '400',
  color: '#6B7280',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.8',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#F9FAFB',
  borderLeft: '4px solid #5E985E',
  borderRadius: '8px',
  padding: '25px',
  marginBottom: '35px',
};

const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 18px 0',
  fontSize: '18px',
  fontWeight: '600',
  color: '#262626',
  fontFamily: '"Bricolage Grotesque", sans-serif',
};

const listStyle: React.CSSProperties = {
  margin: '0',
  padding: '0',
};

const listItemStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
  fontSize: '16px',
  fontWeight: '400',
  color: '#4B5563',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.7',
  paddingLeft: '20px',
};

const bulletStyle: React.CSSProperties = {
  color: '#5E985E',
  fontWeight: '700',
  marginRight: '10px',
  fontSize: '18px',
};

const ctaSectionStyle: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '35px 0',
};

const closingStyle: React.CSSProperties = {
  margin: '30px 0 0 0',
  fontSize: '16px',
  fontWeight: '400',
  color: '#6B7280',
  fontFamily: '"Bricolage Grotesque", sans-serif',
  lineHeight: '1.8',
};

export default ContactAccepted;
