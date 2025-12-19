export const emailContactAdmin = (name: string, email: string, message: string) => `
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
            <td style="background-color: #9A80B8; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔔 Nouvelle Demande</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #2C2C2C; font-size: 24px; font-weight: bold;">Nouveau contact reçu</h2>
              
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Une nouvelle demande de contact a été soumise sur le site.
              </p>
              
              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="padding: 20px; background-color: #EFEFEF; border-radius: 8px;">
                    <p style="margin: 0 0 15px 0; color: #2C2C2C; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #2C2C2C; font-size: 14px;">Nom :</strong> <span style="color: #2C2C2C;">${name}</span>
                    </p>
                    <p style="margin: 0 0 15px 0; color: #2C2C2C; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #2C2C2C; font-size: 14px;">Email :</strong> <a href="mailto:${email}" style="color: #9A80B8; text-decoration: none;">${email}</a>
                    </p>
                    <p style="margin: 0; color: #2C2C2C; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #2C2C2C; font-size: 14px;">Message :</strong>
                    </p>
                    <div style="margin-top: 10px; padding: 15px; background-color: #ffffff; border-radius: 4px; border: 1px solid #e0e0e0;">
                      <p style="margin: 0; color: #2C2C2C; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                        ${message}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}" style="display: inline-block; padding: 14px 30px; background-color: #2C2C2C; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; text-transform: uppercase;">
                      Répondre par email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} Cozetik - Notification automatique
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