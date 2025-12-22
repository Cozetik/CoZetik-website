export const emailInscriptionAccepted = (name: string, formationTitle: string, sessionDate?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✅ Inscription Acceptée</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Félicitations ${name} ! 🎉</h2>
              
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Excellente nouvelle ! Votre inscription à la formation a été acceptée. Nous sommes ravis de vous accueillir !
              </p>
              
              <!-- Formation Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="margin: 0 0 12px 0; color: #333333; font-size: 16px;">
                      <strong style="color: #059669;">📚 Formation :</strong><br>
                      <span style="font-size: 18px; color: #333;">${formationTitle}</span>
                    </p>
                    ${sessionDate ? `
                    <p style="margin: 0; color: #333333; font-size: 16px;">
                      <strong style="color: #059669;">📅 Date de session :</strong><br>
                      <span style="font-size: 18px; color: #333;">${sessionDate}</span>
                    </p>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                  <strong>📧 Prochaines étapes :</strong><br>
                  Vous recevrez prochainement un email avec tous les détails pratiques (lieu, horaires, documents à prévoir).<br>
                  Notre équipe est à votre disposition pour toute question.
                </p>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Nous avons hâte de vous accompagner dans votre parcours de formation !<br><br>
                <strong style="color: #10b981;">L'équipe Cozetik</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} Cozetik. Tous droits réservés.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
