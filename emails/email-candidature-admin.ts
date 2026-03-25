export interface CandidatureAdminEmailParams {
  civility: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  categoryName: string;
  formationTitle: string;
  educationLevel: string;
  currentSituation: string;
  startDate?: string | null;
  pack?: string | null;
  cpfAmount?: number | null;
  motivation: string;
  additionalFormations?: string[];
  cvUrl?: string | null;
  coverLetterUrl?: string | null;
  otherDocumentUrl?: string | null;
}

export const emailCandidatureAdmin = ({
  civility,
  firstName,
  lastName,
  email,
  phone,
  birthDate,
  categoryName,
  formationTitle,
  educationLevel,
  currentSituation,
  startDate,
  pack,
  cpfAmount,
  motivation,
  additionalFormations = [],
  cvUrl,
  coverLetterUrl,
  otherDocumentUrl,
}: CandidatureAdminEmailParams) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#9A80B8 0%,#6C5CE7 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;">📥 Nouvelle candidature</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;color:#333333;font-size:14px;line-height:1.6;">
              <p style="margin:0 0 12px 0;">Une nouvelle candidature vient d'être reçue via le formulaire.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr>
                  <td style="padding:16px;background-color:#F8F9FA;border-radius:8px;">
                    <p style="margin:0 0 8px 0;"><strong>👤 Candidat :</strong> ${civility} ${firstName} ${lastName}</p>
                    <p style="margin:0 0 8px 0;"><strong>📧 Email :</strong> <a href="mailto:${email}" style="color:#9A80B8;text-decoration:none;">${email}</a></p>
                    <p style="margin:0 0 8px 0;"><strong>📱 Téléphone :</strong> ${phone}</p>
                    <p style="margin:0 0 0 0;"><strong>🎂 Date de naissance :</strong> ${birthDate}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr>
                  <td style="padding:16px;background-color:#F3EFFF;border-radius:8px;border-left:4px solid #9A80B8;">
                    <p style="margin:0 0 8px 0;"><strong>📂 Catégorie :</strong> ${categoryName}</p>
                    <p style="margin:0 0 8px 0;"><strong>📚 Formation :</strong> ${formationTitle}</p>
                    ${pack ? `<p style="margin:0 0 8px 0;"><strong>🎯 Pack choisi :</strong> ${pack}</p>` : ""}
                    <p style="margin:0 0 8px 0;"><strong>🎓 Niveau d'études :</strong> ${educationLevel}</p>
                    <p style="margin:0 0 8px 0;"><strong>💼 Situation actuelle :</strong> ${currentSituation}</p>
                    ${startDate ? `<p style="margin:0 0 0 0;"><strong>📅 Date de début souhaitée :</strong> ${startDate}</p>` : ""}
                  </td>
                </tr>
              </table>

              ${
                additionalFormations.length > 0
                  ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr>
                  <td style="padding:16px;background-color:#F8F9FA;border-radius:8px;">
                    <p style="margin:0 0 8px 0;"><strong>➕ Formations complémentaires :</strong></p>
                    <ul style="margin:0;padding-left:18px;">
                      ${additionalFormations
                        .filter((f) => f && f.trim() !== "")
                        .map((f) => `<li style="margin-bottom:4px;">${f}</li>`)
                        .join("")}
                    </ul>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr>
                  <td style="padding:16px;background-color:#FFF8E1;border-radius:8px;border-left:4px solid #FFC107;">
                    <p style="margin:0 0 8px 0;"><strong>💶 Informations CPF :</strong></p>
                    <p style="margin:0 0 0 0;">Montant CPF indiqué : ${
                      typeof cpfAmount === "number"
                        ? `${cpfAmount} €`
                        : "Non spécifié"
                    }</p>
                  </td>
                </tr>
              </table>

              <div style="margin:20px 0;padding:16px;background-color:#FFFFFF;border-radius:8px;border:1px solid #E0E0E0;">
                <p style="margin:0 0 8px 0;"><strong>📝 Motivation :</strong></p>
                <p style="margin:0;white-space:pre-wrap;">${motivation}</p>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr>
                  <td style="padding:16px;background-color:#F8F9FA;border-radius:8px;">
                    <p style="margin:0 0 8px 0;"><strong>📎 Documents joints :</strong></p>
                    ${cvUrl ? `<p style="margin:0 0 4px 0;">• CV : <a href="${cvUrl}" style="color:#9A80B8;">Télécharger</a></p>` : ""}
                    ${coverLetterUrl ? `<p style="margin:0 0 4px 0;">• Lettre de motivation : <a href="${coverLetterUrl}" style="color:#9A80B8;">Télécharger</a></p>` : ""}
                    ${otherDocumentUrl ? `<p style="margin:0 0 0 0;">• Autre document : <a href="${otherDocumentUrl}" style="color:#9A80B8;">Télécharger</a></p>` : ""}
                    ${!cvUrl && !coverLetterUrl && !otherDocumentUrl ? `<p style="margin:0;">Aucun document fourni.</p>` : ""}
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}" style="display:inline-block;padding:12px 28px;background-color:#2C2C2C;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;">Répondre au candidat</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:16px 24px;text-align:center;border-top:1px solid #e9ecef;font-size:11px;color:#999999;">
              © ${new Date().getFullYear()} Cozetik - Notification automatique
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
