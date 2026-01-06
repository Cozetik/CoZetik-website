"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const valueSchema = z.object({
  order: z
    .number({ message: "L'ordre est requis" })
    .int({ message: "L'ordre doit être un nombre entier" })
    .min(0, { message: "L'ordre doit être positif ou zéro" }),
  title: z.string().min(1, "Le titre est requis").max(200, "Titre trop long"),
  description: z
    .string()
    .min(10, "Description trop courte (min. 10 caractères)")
    .max(500),
});

type FormValues = z.infer<typeof valueSchema>;

interface Value {
  id: string;
  order: number;
  title: string;
  description: string;
  visible: boolean;
}

export default function EditValueDialog({ value }: { value: Value }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(valueSchema),
    defaultValues: {
      order: value.order,
      title: value.title,
      description: value.description,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/values/${value.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: values.order,
          title: values.title,
          description: values.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la modification");
      }

      toast.success("Valeur modifiée avec succès");
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-bricolage text-2xl">
            Modifier la valeur
          </DialogTitle>
          <DialogDescription className="font-sans">
            Modifiez les informations de cette valeur
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans">Titre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Innovation"
                      className="font-sans"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="font-sans" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez cette valeur..."
                      className="min-h-[100px] resize-none font-sans"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="font-sans" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans">Ordre</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="font-sans"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="font-sans text-xs">
                    Plus le nombre est petit, plus la valeur apparaît en premier
                  </FormDescription>
                  <FormMessage className="font-sans" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="font-sans"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-sans"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
