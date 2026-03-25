"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Box, 
  Euro, 
  FileText, 
  Hash, 
  ListChecks, 
  Plus, 
  Star, 
  Trash2, 
  TrendingDown,
  GripVertical
} from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

interface FormationPacksFieldProps {
  form: UseFormReturn<any>;
}

export function FormationPacksField({ form }: FormationPacksFieldProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "packs",
  });

  const addPack = () => {
    append({
      name: "",
      description: "",
      price: 0,
      originalPrice: null,
      savings: "",
      features: "",
      isPopular: false,
      order: fields.length,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-2">
            <Box className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bricolage font-semibold text-gray-900">
              Packs tarifaires
            </h2>
            <p className="text-sm text-gray-500">
              Définissez les différentes offres pour cette formation
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={addPack}
          variant="outline"
          size="sm"
          className="border-blue-200 hover:bg-blue-50 text-blue-600 font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un pack
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Box className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucun pack défini pour le moment</p>
          <Button
            type="button"
            variant="link"
            onClick={addPack}
            className="text-blue-600 mt-1"
          >
            Cliquez ici pour ajouter le premier pack
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bricolage font-bold text-gray-900">
                      Pack #{index + 1}
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`packs.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase">Nom du pack</FormLabel>
                          <FormControl>
                            <Input placeholder="Découverte, Premium..." {...field} className="focus:ring-blue-500/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`packs.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase">Prix TTC (€)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1500" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="focus:ring-green-500/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`packs.${index}.order`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase">Ordre d&apos;affichage</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`packs.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase">Sous-titre / Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Idéal pour démarrer" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`packs.${index}.savings`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase">Texte économie</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 400€ d'économies" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`packs.${index}.features`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                          <ListChecks className="h-3 w-3" />
                          Inclusions (un par ligne)
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="1 formation&#10;30h de formation..." 
                            className="min-h-[100px] font-mono text-sm resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-wrap gap-4 items-center justify-between pt-2 border-t border-gray-100 mt-2">
                     <FormField
                      control={form.control}
                      name={`packs.${index}.originalPrice`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[200px]">
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase">Prix barré (optionnel)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="3000" 
                              {...field} 
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`packs.${index}.isPopular`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border border-yellow-200 p-3 bg-yellow-50">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs font-bold text-yellow-800 uppercase flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-600 text-yellow-600" />
                              Offre populaire
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            onClick={addPack}
            variant="outline"
            className="border-dashed border-2 py-6 px-12 hover:bg-gray-50 text-gray-500"
          >
            <Plus className="mr-2 h-5 w-5" />
            Ajouter un autre pack
          </Button>
        </div>
      )}
    </div>
  );
}
