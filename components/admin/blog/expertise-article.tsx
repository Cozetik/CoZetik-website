"use client";

import { Card } from "@/components/ui/card";

interface ExpertiseArticleProps {
  report: {
    adn_cozetik: number;
    expertise_tech: number;
    wording_humain: number;
    structure_seo: number;
    cta_impact: number;
  };
  sources?: string[];
}

export function ExpertiseArticle({ report, sources }: ExpertiseArticleProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 bg-green-100";
    if (score >= 0.7) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const metrics = [
    { label: "ADN CoZetik", value: report.adn_cozetik },
    { label: "Expertise Tech", value: report.expertise_tech },
    { label: "Wording Humain", value: report.wording_humain },
    { label: "Structure SEO", value: report.structure_seo },
    { label: "Impact CTA", value: report.cta_impact },
  ];

  const avgScore = Object.values(report).reduce((a, b) => a + b, 0) / 5;

  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Rapport d'Expertise IA</h3>
        <div className={`px-3 py-1 rounded-full ${getScoreColor(avgScore)}`}>
          Score global: {(avgScore * 100).toFixed(0)}%
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div
              className={`text-2xl font-bold ${getScoreColor(metric.value)}`}
            >
              {(metric.value * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
          </div>
        ))}
      </div>

      {sources && sources.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Sources utilisées</h4>
          <div className="space-y-2">
            {sources.slice(0, 2).map((source, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-600 bg-gray-50 p-2 rounded"
              >
                {source.substring(0, 150)}...
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
