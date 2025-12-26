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
    <CozetikLayout previewText={`Félicitations ${name}, votre inscription a été confirmée`}>
      {/* Titre principal */}
      <Text style={titleStyle} className="title">Inscription confirmée</Text>

      {/* Ligne séparatrice */}
      <Hr style={dividerStyle} />

      {/* Greeting */}
      <Text style={greetingStyle} className="text">Félicitations {name},</Text>

      {/* Message principal */}
      <Text style={paragraphStyle} className="text">
        Votre inscription a été validée avec succès. Nous sommes ravis de vous accueillir.
      </Text>

      {/* Table Formation Info */}
      <Section style={tableContainerStyle} className="card">
        <Row style={tableRowStyle}>
          <Column style={tableLabelColumnStyle}>
            <Text style={tableLabelStyle} className="text">Formation</Text>
          </Column>
          <Column style={tableValueColumnStyle}>
            <Text style={tableValueStyle} className="text">{formationTitle}</Text>
          </Column>
        </Row>

        {sessionDate && (
          <>
            <Hr style={tableRowDividerStyle} />
            <Row style={tableRowStyle}>
              <Column style={tableLabelColumnStyle}>
                <Text style={tableLabelStyle} className="text">Date de session</Text>
              </Column>
              <Column style={tableValueColumnStyle}>
                <Text style={tableValueStyle} className="text">{sessionDate}</Text>
              </Column>
            </Row>
          </>
        )}
      </Section>

      <Hr style={sectionDividerStyle} />

      {/* Prochaines étapes */}
      <Text style={sectionTitleStyle} className="text">Prochaines étapes :</Text>

      <Text style={listItemStyle} className="text">
        • Vous recevrez un email détaillé dans les prochaines 48h
      </Text>
      <Text style={listItemStyle} className="text">
        • Accès immédiat à votre espace personnel de formation
      </Text>
      <Text style={listItemStyle} className="text">
        • Support disponible 7j/7 pour toute question
      </Text>

      {/* CTA Button */}
      <Section style={ctaSectionStyle}>
        <CozetikButton href="https://cozetik.fr/formations">
          → Accéder à mon espace
        </CozetikButton>
      </Section>

      {/* Closing */}
      <Text style={closingStyle} className="text">
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

// Table styles
const tableContainerStyle: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  padding: '24px',
  marginBottom: '32px',
  borderRadius: '0',
  border: '1px solid #E5E7EB',
};

const tableRowStyle: React.CSSProperties = {
  padding: '8px 0',
};

const tableLabelColumnStyle: React.CSSProperties = {
  width: '40%',
  verticalAlign: 'top',
};

const tableValueColumnStyle: React.CSSProperties = {
  width: '60%',
  verticalAlign: 'top',
};

const tableLabelStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '16px',
  fontWeight: '500',
  color: '#666666',
  fontFamily: '"Bricolage Grotesque", sans-serif',
};

const tableValueStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '17px',
  fontWeight: '400',
  color: '#262626',
  fontFamily: '"Bricolage Grotesque", sans-serif',
};

const tableRowDividerStyle: React.CSSProperties = {
  borderColor: '#E5E7EB',
  borderWidth: '1px',
  margin: '12px 0',
};

const sectionDividerStyle: React.CSSProperties = {
  borderColor: '#E5E7EB',
  borderWidth: '1px',
  margin: '32px 0',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: '0 0 20px 0',
  fontSize: '17px',
  fontWeight: '500',
  color: '#262626',
  fontFamily: '"Bricolage Grotesque", sans-serif',
};

const listItemStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
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

export default InscriptionAccepted;
