import * as React from 'react';
import { CozetikLayout } from './_components/CozetikLayout';
import { CozetikButton } from './_components/CozetikButton';
import { Text, Section, Hr, Row, Column } from '@react-email/components';

interface InscriptionAcceptedProps {
  name: string;
  formationTitle: string;
  sessionDate?: string;
}

export const InscriptionAccepted = ({
  name = 'Utilisateur',
  formationTitle = 'Formation',
  sessionDate,
}: InscriptionAcceptedProps) => {
  return (
    <CozetikLayout previewText={`Félicitations ${name}, votre inscription a été acceptée !`}>
      {/* Hero Title */}
      <Section style={heroSectionStyle}>
        <Text style={titleStyle}>✅ Inscription Acceptée</Text>
      </Section>

      {/* Greeting */}
      <Text style={greetingStyle}>Félicitations {name} ! 🎉</Text>

      {/* Message */}
      <Text style={paragraphStyle}>
        Excellente nouvelle ! Votre inscription à la formation a été acceptée. Nous sommes ravis de vous accueillir !
      </Text>

      {/* Formation Card */}
      <Section style={formationCardStyle}>
        <Row>
          <Column>
            <Text style={cardLabelStyle}>📚 Formation</Text>
            <Text style={cardValueStyle}>{formationTitle}</Text>
          </Column>
        </Row>

        {sessionDate && (
          <Row style={{ marginTop: '15px' }}>
            <Column>
              <Text style={cardLabelStyle}>📅 Date de session</Text>
              <Text style={cardValueStyle}>{sessionDate}</Text>
            </Column>
          </Row>
        )}
      </Section>

      {/* Next Steps Box Violet */}
      <Section style={nextStepsBoxStyle}>
        <Text style={nextStepsTitleStyle}>📧 Prochaines étapes</Text>
        <Text style={nextStepsTextStyle}>
          ✓ Vous recevrez prochainement un email avec tous les détails pratiques<br />
          ✓ Lieu, horaires, et documents à prévoir<br />
          ✓ Notre équipe est à votre disposition pour toute question
        </Text>
      </Section>

      <Hr style={dividerStyle} />

      {/* CTA Button */}
      <Section style={ctaSectionStyle}>
        <CozetikButton href="https://cozetik.fr/formations">
          Accéder à mon espace
        </CozetikButton>
      </Section>

      <Hr style={dividerStyle} />

      {/* Closing */}
      <Text style={paragraphStyle}>
        Nous avons hâte de vous accompagner dans votre parcours de formation !
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

// Formation Card (Border vert gauche)
const formationCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderLeft: '4px solid #5E985E', // Vert Cozetik
  padding: '20px',
  marginTop: '25px',
  marginBottom: '25px',
  borderRadius: '0', // Carré
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
};

const cardLabelStyle: React.CSSProperties = {
  margin: '0 0 5px 0',
  fontSize: '14px',
  fontWeight: '600',
  color: '#5E985E', // Vert Cozetik
  fontFamily: 'Inter, sans-serif',
};

const cardValueStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '18px',
  fontWeight: '600',
  color: '#262626',
  fontFamily: 'Inter, sans-serif',
};

// Next Steps Box Violet
const nextStepsBoxStyle: React.CSSProperties = {
  backgroundColor: '#F3E8FF', // Violet clair
  borderLeft: '4px solid #C792DF', // Violet Cozetik
  padding: '20px',
  marginTop: '20px',
  marginBottom: '20px',
  borderRadius: '0', // Carré
};

const nextStepsTitleStyle: React.CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#262626',
  fontFamily: 'Inter, sans-serif',
};

const nextStepsTextStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '14px',
  lineHeight: '1.8',
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

export default InscriptionAccepted;
