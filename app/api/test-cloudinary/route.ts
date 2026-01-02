import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const config = {
      cloudName: cloudName ? `${cloudName.substring(0, 4)}...` : "❌ NON CONFIGURÉ",
      apiKey: apiKey ? `${apiKey.substring(0, 4)}...` : "❌ NON CONFIGURÉ",
      apiSecret: apiSecret ? "✅ CONFIGURÉ (masqué)" : "❌ NON CONFIGURÉ",
    };

    // Si toutes les variables sont présentes, tester la connexion
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      // Tester la connexion en récupérant les infos du compte
      try {
        // Utiliser usage() pour tester la connexion (plus fiable que ping)
        const usage = await cloudinary.api.usage();
        return NextResponse.json({
          status: "✅ Configuration Cloudinary OK",
          config: config,
          connection: "✅ Connexion réussie",
          details: {
            plan: usage.plan || "N/A",
            credits: usage.credits || {},
            bandwidth: usage.bandwidth || {},
          },
        });
      } catch (error: any) {
        console.error("❌ Erreur Cloudinary:", error);
        console.error("❌ Détails:", JSON.stringify(error, null, 2));
        
        // Extraire plus de détails de l'erreur
        const errorDetails: any = {
          message: error.message || "Erreur inconnue",
          http_code: error.http_code || null,
          name: error.name || null,
        };

        // Ajouter les détails de l'erreur si disponibles
        if (error.response) {
          errorDetails.response = error.response;
        }
        if (error.error) {
          errorDetails.error = error.error;
        }

        // Messages d'aide selon le code d'erreur
        let suggestions = [
          "Vérifiez que vos credentials sont corrects dans .env.local",
          "Vérifiez que votre compte Cloudinary est actif",
          "Essayez de vous connecter sur https://cloudinary.com/console pour vérifier votre compte",
        ];

        if (error.http_code === 401) {
          suggestions.unshift("❌ Erreur 401: Vos credentials sont incorrects ou invalides");
        } else if (error.http_code === 403) {
          suggestions.unshift("❌ Erreur 403: Votre compte n'a pas les permissions nécessaires");
        } else if (error.http_code === 404) {
          suggestions.unshift("❌ Erreur 404: Le cloud name est incorrect");
        }

        return NextResponse.json({
          status: "⚠️ Variables configurées mais erreur de connexion",
          config: config,
          connection: "❌ Échec de la connexion",
          error: errorDetails,
          suggestions: suggestions,
        });
      }
    } else {
      return NextResponse.json({
        status: "❌ Configuration Cloudinary incomplète",
        config: config,
        connection: "❌ Impossible de tester (variables manquantes)",
        message: "Vérifiez que CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sont définis dans votre fichier .env.local",
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "❌ Erreur lors de la vérification",
      error: error.message || "Erreur inconnue",
    });
  }
}

