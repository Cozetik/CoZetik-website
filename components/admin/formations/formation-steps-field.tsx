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
import { 
  Clock, 
  FileText, 
  Hash, 
  ListChecks, 
  Plus, 
  Trash2,
  GraduationCap
} from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

interface FormationStepsFieldProps {
  form: UseFormReturn<any>;
}

export function FormationStepsField({ form }: FormationStepsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const addStep = () => {
    append({
      title: "",
      description: "",
      order: fields.length + 1,
      keyPoints: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-100 p-2">
            <GraduationCap className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bricolage font-semibold text-gray-900">
              Étapes du programme
            </h2>
            <p className="text-sm text-gray-500">
              Définissez les modules détaillés de votre formation
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={addStep}
          variant="outline"
          size="sm"
          className="border-amber-200 hover:bg-amber-50 text-amber-600 font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une étape
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune étape définie pour le moment</p>
          <Button
            type="button"
            variant="link"
            onClick={addStep}
            className="text-amber-600 mt-1"
          >
            Cliquez ici pour ajouter la première étape
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500" />
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bricolage font-bold text-gray-900">
                      Étape #{index + 1}
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
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <FormField
                      control={form.control}
                      name={`steps.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-10">
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            Titre de l&apos;étape
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Introduction au Design" {...field} className="focus:ring-amber-500/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`steps.${index}.order`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                            <Hash className="h-3 w-3" />
                            Ordre
                          </FormLabel>
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

                  <FormField
                    control={form.control}
                    name={`steps.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez le contenu de cette étape..." 
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`steps.${index}.keyPoints`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                          <ListChecks className="h-3 w-3" />
                          Points clés (un par ligne)
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Comprendre les bases&#10;Pratiquer les outils..." 
                            className="min-h-[100px] font-mono text-sm resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[10px]">
                          Ces points apparaîtront comme une liste à puces sur la page de la formation.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            onClick={addStep}
            variant="outline"
            className="border-dashed border-2 py-6 px-12 hover:bg-amber-50 text-amber-600 border-amber-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Ajouter une autre étape
          </Button>
        </div>
      )}
    </div>
  );
}
