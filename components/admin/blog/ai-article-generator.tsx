"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AIGeneratorProps {
  onGenerated: (data: {
    markdown: string;
    expertise_report: any;
    sources: string[];
  }) => void;
}

export function AIArticleGenerator({ onGenerated }: AIGeneratorProps) {
  const [subject, setSubject] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast.error("Veuillez entrer un sujet");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const data = await response.json();
      onGenerated(data);
      toast.success("Article généré avec succès !");
      setSubject("");
    } catch (error) {
      toast.error("Erreur lors de la génération de l'article");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-dashed border-purple-300">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">Générateur AI</h3>
      </div>
      <div className="space-y-3">
        <div>
          <Label htmlFor="ai-subject">Sujet de l'article</Label>
          <Input
            id="ai-subject"
            placeholder="Ex: L'importance de la cybersécurité pour les PME"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer avec l'IA
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
