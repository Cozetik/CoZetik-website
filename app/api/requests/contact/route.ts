import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

const contactRequestSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

// GET - Récupérer toutes les demandes de contact
export async function GET() {
  try {
    const requests = await prisma.contactRequest.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle demande de contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactRequestSchema.parse(body);

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        status: "NEW",
      },
    });

    return NextResponse.json(contactRequest, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating contact request:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
