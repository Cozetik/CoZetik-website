export interface CandidatureUserEmailParams {
  firstName: string;
  packName?: string | null;
  formationTitle: string;
  additionalFormationTitles?: string[];
}

export function emailCandidatureUser({
  firstName,
  packName,
  formationTitle,
  additionalFormationTitles = [],
}: CandidatureUserEmailParams): { subject: string; html: string } {
  const pack = (packName || "").toLowerCase();

  if (pack.includes("expert")) {
    const formations = [
      formationTitle,
      ...additionalFormationTitles.filter((t) => t && t.trim() !== ""),
    ];

    const formationsLines = formations
      .map((title, index) => `${index + 1}. ${title}`)
      .join("\n");

    const subject = "✅ Votre candidature Cozétik est bien reçue — Pack Expert";

    const html = `<!DOCTYPE html>
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
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;">Cozétik</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;color:#333333;font-size:14px;line-height:1.6;">
              <p>Bonjour ${firstName},</p>

              <p>Merci d'avoir candidaté à Cozétik.</p>

              <p>Nous avons bien reçu votre demande d'inscription aux formations suivantes :</p>

              <p><strong>📚 Formations sélectionnées :</strong><br />
              ${formationsLines.replace(/\n/g, "<br />")}</p>

              <p>
                <strong>💶 Pack Expert — 3 formations : 4 500 € TTC</strong><br />
                (au lieu de 4 500 € plein tarif)<br />
                Financement : éligible CPF (Compte Personnel de Formation)<br />
                Reste à charge : 100 € minimum par formation (règle CPF depuis mai 2024)
              </p>

              <p>
                Vous avez choisi notre parcours le plus complet. Le Pack Expert vous permet de couvrir trois axes clés de votre développement professionnel, avec un accompagnement sur-mesure tout au long de votre parcours. C'est un investissement fort dans vos compétences — et nous serons là à chaque étape.
              </p>

              <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />

              <p><strong>QUELLES SONT LES PROCHAINES ÉTAPES ?</strong></p>

              <p>
                <strong>1. Entretien de positionnement approfondi</strong><br />
                Notre équipe vous contactera dans les 48 heures pour un entretien de 30 à 45 minutes. Nous construirons ensemble le calendrier idéal de vos 3 formations, en tenant compte de votre rythme et de vos objectifs professionnels.
              </p>

              <p>
                <strong>2. Audit de votre solde CPF</strong><br />
                Avant notre appel, vérifiez votre solde sur <a href="https://www.moncompteformation.gouv.fr" target="_blank" rel="noopener noreferrer">www.moncompteformation.gouv.fr</a> (connexion via France Connect). Pour un pack 3 formations, nous analysons avec vous les possibilités d'abondement (employeur, Conseil régional, France Travail) si votre solde ne suffit pas à couvrir l'ensemble.
              </p>

              <p>
                <strong>3. Plan d'inscription personnalisé</strong><br />
                Chaque formation est inscrite séparément sur Mon Compte Formation. Nous vous remettons un plan de formation personnalisé avec les dates prévisionnelles de chaque parcours et un suivi dédié tout au long de l'année.
              </p>

              <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />

              <p><strong>NOS 5 FORMATIONS DISPONIBLES à la carte :</strong><br />
                • Intelligence Artificielle : boostez votre productivité avec l'IA<br />
                • Conduire un projet de création d'entreprise (RS7004 — certifiant CPF)<br />
                • Conduire un projet de création de micro-entreprise<br />
                • Créer et gérer le site internet de sa TPE à l'aide d'un CMS<br />
                • Communiquer sur les réseaux sociaux pour promouvoir sa TPE
              </p>

              <p>
                Découvrez toutes nos formations sur <a href="https://www.cozetik.fr/formations" target="_blank" rel="noopener noreferrer">www.cozetik.fr/formations</a>
              </p>

              <p>
                Cozétik est un CFA certifié Qualiopi. Nos parcours sont disponibles en format mixte : e-learning à votre rythme + classes virtuelles en direct avec votre formateur.
              </p>

              <p>
                Des questions ? Répondez directement à cet email ou contactez-nous sur <a href="https://www.cozetik.fr/contact" target="_blank" rel="noopener noreferrer">www.cozetik.fr/contact</a>
              </p>

              <p style="margin-top:24px;">
                À très vite,<br />
                <strong>Nicolas MORBY</strong><br />
                Fondateur & Président<br />
                COZÉTIK — CFA certifié Qualiopi<br />
                41 rue Paul Berthelot, 33300 Bordeaux<br />
                nicolas.morby@gmail.com · <a href="https://www.cozetik.fr" target="_blank" rel="noopener noreferrer">www.cozetik.fr</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:16px 24px;text-align:center;border-top:1px solid #e9ecef;font-size:11px;color:#999999;">
              © ${new Date().getFullYear()} Cozétik. Tous droits réservés.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return { subject, html };
  }

  // Pack Découverte ou Premium (par défaut on bascule sur Découverte)
  const isPremium = pack.includes("premium");
  const subject = isPremium
    ? "✅ Votre candidature Cozétik est bien reçue — Pack Premium"
    : "✅ Votre candidature Cozétik est bien reçue — Pack Découverte";

  const packLine = isPremium
    ? "💶 Pack Premium — 2 formations (détails communiqués lors de l'entretien)"
    : "💶 Pack Découverte — 1 formation : 1 500 € TTC";

  const premiumAdditionalBlock =
    isPremium && additionalFormationTitles.length > 0
      ? `\n              <p>\n                <strong>📚 Formations complémentaires :</strong><br />\n                ${additionalFormationTitles
          .filter((title) => title && title.trim() !== "")
          .map((title) => `• ${title}`)
          .join("<br />")}\n              </p>\n`
      : "";

  const html = `<!DOCTYPE html>
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
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;">Cozétik</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;color:#333333;font-size:14px;line-height:1.6;">
              <p>Bonjour ${firstName},</p>

              <p>Merci d'avoir candidaté à Cozétik.</p>

              <p>Nous avons bien reçu votre demande d'inscription à la formation suivante :</p>

              <p>
                <strong>📚 Formation sélectionnée :</strong><br />
                ${formationTitle}
              </p>

              ${premiumAdditionalBlock}

              <p>
                <strong>${packLine}</strong><br />
                Financement : éligible CPF (Compte Personnel de Formation)<br />
                Reste à charge : 100 € minimum (règle CPF depuis mai 2024)
              </p>

              <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />

              <p><strong>QUELLES SONT LES PROCHAINES ÉTAPES ?</strong></p>

              <p>
                <strong>1. Entretien de positionnement</strong><br />
                Notre équipe vous contactera dans les 48 heures pour organiser un entretien téléphonique de 20 à 30 minutes. Cet échange nous permettra de valider l'adéquation de votre projet avec la formation choisie et de vous présenter les modalités de financement CPF.
              </p>

              <p>
                <strong>2. Vérification de vos droits CPF</strong><br />
                Avant l'entretien, nous vous invitons à vérifier votre solde CPF sur <a href="https://www.moncompteformation.gouv.fr" target="_blank" rel="noopener noreferrer">www.moncompteformation.gouv.fr</a> (connexion via France Connect). Si votre solde est insuffisant, des solutions de financement complémentaires existent — nous en discuterons ensemble.
              </p>

              <p>
                <strong>3. Inscription officielle</strong><br />
                Si l'entretien est concluant, nous vous enverrons le lien d'inscription sur Mon Compte Formation. À compter de votre inscription, un délai de rétractation de 11 jours ouvrés s'applique automatiquement. La formation débutera à l'issue de ce délai.
              </p>

              <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />

              <p><strong>Votre formation en quelques mots</strong></p>

              <p>
                Cozétik est un CFA (Centre de Formation d'Apprentis) certifié Qualiopi, basé à Asnières-sur-Seine. Nos formations sont disponibles en format mixte : modules e-learning accessibles à votre rythme + classes virtuelles en direct avec votre formateur.
              </p>

              <p>
                Des questions ? Répondez directement à cet email ou contactez-nous sur <a href="https://www.cozetik.fr/contact" target="_blank" rel="noopener noreferrer">www.cozetik.fr/contact</a>
              </p>

              <p style="margin-top:24px;">
                À très vite,<br />
                <strong>Nicolas MORBY</strong><br />
                Fondateur & Président<br />
                COZÉTIK — CFA certifié Qualiopi<br />
                41 rue Paul Berthelot, 33300 Bordeaux<br />
                nicolas.morby@gmail.com · <a href="https://www.cozetik.fr" target="_blank" rel="noopener noreferrer">www.cozetik.fr</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:16px 24px;text-align:center;border-top:1px solid #e9ecef;font-size:11px;color:#999999;">
              © ${new Date().getFullYear()} Cozétik. Tous droits réservés.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
