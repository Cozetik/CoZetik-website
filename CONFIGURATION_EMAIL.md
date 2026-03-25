# 📧 Configuration Email avec Resend

## ✅ Votre domaine est vérifié !

Le domaine `cozetik.fr` est maintenant vérifié sur Resend. Pour envoyer des emails à tous les destinataires, vous devez configurer l'adresse d'envoi.

## 🔧 Configuration Locale (.env.local)

1. **Ouvrez ou créez le fichier `.env.local`** à la racine du projet

2. **Ajoutez ou modifiez cette ligne** :

   ```env
   RESEND_FROM_EMAIL=nicolas.morby@gmail.com
   ```

   Vous pouvez utiliser n'importe quelle adresse avec le domaine `cozetik.fr` :
   - `nicolas.morby@gmail.com`
   - `noreply@cozetik.fr`
   - `info@cozetik.fr`
   - etc.

3. **Redémarrez votre serveur de développement** pour que les changements soient pris en compte

## 🚀 Configuration Vercel (Production)

Si votre site est déployé sur Vercel :

1. **Allez sur votre dashboard Vercel** : [vercel.com](https://vercel.com)

2. **Sélectionnez votre projet** Cozetik

3. **Allez dans Settings → Environment Variables**

4. **Ajoutez ou modifiez** :
   - **Key** : `RESEND_FROM_EMAIL`
   - **Value** : `nicolas.morby@gmail.com`
   - **Environments** : Production, Preview, Development (cochez tous)

5. **Redeployez votre application** pour que les changements soient pris en compte

## ✅ Vérification

Une fois configuré, vous devriez pouvoir envoyer des emails à n'importe quelle adresse depuis le back office.

Les logs dans la console afficheront :

```
📧 Depuis: nicolas.morby@gmail.com
```

Au lieu de :

```
📧 Depuis: onboarding@resend.dev
```

## 🔍 Autres variables d'environnement email

Assurez-vous aussi d'avoir ces variables configurées :

```env
# Clé API Resend (obligatoire)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Adresse d'envoi (avec votre domaine vérifié)
RESEND_FROM_EMAIL=nicolas.morby@gmail.com

# Adresse de réponse (optionnel)
RESEND_REPLY_TO=nicoleoproject@gmail.com

# Email admin pour recevoir les notifications
ADMIN_EMAIL=nicoleoproject@gmail.com
```
