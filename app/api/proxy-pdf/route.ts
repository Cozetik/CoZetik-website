import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL manquante" },
      { status: 400 }
    );
  }

  try {
    // Décoder l'URL
    const decodedUrl = decodeURIComponent(url);
    console.log("📄 Proxy PDF - URL reçue:", decodedUrl);
    
    // Extraire le public_id depuis l'URL Cloudinary
    // Format: https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{folder}/{public_id}
    const urlMatch = decodedUrl.match(/res\.cloudinary\.com\/[^/]+\/(image|raw|video)\/upload(?:\/v\d+)?\/(.+)/);
    
    let pdfBuffer: ArrayBuffer;
    
    if (urlMatch && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_SECRET) {
      const resourceType = urlMatch[1] || "raw";
      const publicIdWithFolder = urlMatch[2];
      
      console.log("📄 Proxy PDF - Public ID:", publicIdWithFolder);
      console.log("📄 Proxy PDF - Resource Type:", resourceType);
      
      // Utiliser l'API Cloudinary pour télécharger directement le fichier avec les credentials
      try {
        // Construire l'URL de téléchargement avec signature
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        
        if (cloudName && apiKey && apiSecret) {
          // Utiliser cloudinary.utils.api_sign_request pour signer l'URL
          const timestamp = Math.round(new Date().getTime() / 1000);
          const signature = cloudinary.utils.api_sign_request(
            {
              timestamp: timestamp,
              public_id: publicIdWithFolder,
            },
            apiSecret
          );
          
          // Utiliser cloudinary.api.resource pour obtenir l'URL secure_url
          const resourceInfo = await cloudinary.api.resource(publicIdWithFolder, {
            resource_type: resourceType,
          });
          
          console.log("📄 Proxy PDF - secure_url obtenu:", resourceInfo.secure_url);
          
          // Télécharger depuis secure_url
          const downloadResponse = await fetch(resourceInfo.secure_url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "Accept": "application/pdf,application/octet-stream,*/*",
            },
            redirect: "follow",
          });
          
          if (downloadResponse.ok) {
            pdfBuffer = await downloadResponse.arrayBuffer();
            console.log("✅ PDF récupéré via API Cloudinary, taille:", pdfBuffer.byteLength, "bytes");
            
            return new NextResponse(pdfBuffer, {
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=document.pdf",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Cache-Control": "public, max-age=3600",
                "X-Content-Type-Options": "nosniff",
              },
            });
          } else {
            console.warn("⚠️ Erreur téléchargement depuis secure_url:", downloadResponse.status);
          }
        }
      } catch (apiError) {
        console.warn("⚠️ Erreur avec API Cloudinary, tentative directe:", apiError);
        // Fallback: essayer directement
      }
    }
    
    // Fallback: Récupérer le PDF directement depuis l'URL
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/pdf,application/octet-stream,*/*",
      },
      redirect: "follow",
    });

    console.log("📄 Proxy PDF - Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur Cloudinary:", response.status);
      console.error("❌ Détails:", errorText.substring(0, 500));
      
      // Si c'est une erreur 401, essayer avec les credentials Cloudinary
      if (response.status === 401 && process.env.CLOUDINARY_CLOUD_NAME) {
        console.log("🔄 Tentative avec credentials Cloudinary...");
        // Essayer de construire une URL signée ou utiliser l'API Cloudinary
        // Pour l'instant, on retourne l'erreur mais on pourrait améliorer ça
      }
      
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head><title>Erreur de chargement</title></head>
<body style="font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f5f5f5;">
  <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="color: #dc2626; margin-bottom: 20px;">Erreur ${response.status}</h1>
    <p style="color: #666; margin-bottom: 30px;">Impossible de récupérer le PDF depuis Cloudinary.</p>
    <p style="color: #999; font-size: 12px;">Vérifiez que le fichier est bien accessible publiquement.</p>
  </div>
</body>
</html>`,
        {
          status: response.status,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    pdfBuffer = await response.arrayBuffer();
    console.log("✅ PDF récupéré avec succès, taille:", pdfBuffer.byteLength, "bytes");

    // Retourner le PDF avec les bons headers pour l'affichage
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=document.pdf",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors du proxy PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><title>Erreur</title></head>
<body style="font-family: Arial; padding: 20px; text-align: center;">
  <h1>Erreur de chargement</h1>
  <p>Erreur lors de la récupération du PDF: ${errorMessage}</p>
</body>
</html>`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }
}

