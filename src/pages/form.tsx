"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { fields } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";

const formSchema = z.object({
  url: z.url(),
  number_of_pages: z.number().gt(0, "Nubmer of Pages Must be greater then 0"),
});

type FormValues = z.infer<typeof formSchema>;

const Form = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      number_of_pages: 1,
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50">
        <div className="w-full max-w-2xl min-h-[70vh] bg-white border rounded-3xl p-10 shadow-xl shadow-zinc-200/50">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Downloader
            </h2>
            <p className="text-zinc-500 mt-2">Download Videos for Collection</p>
          </header>

          {/* --- Form --- */}
          <form
            id="download-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10"
          >
            <FieldSet className="pb-4">
              <FieldLegend>Profile Information</FieldLegend>
              <FieldDescription>
                This information will appear on your public profile.
              </FieldDescription>

              <FieldGroup>
                {/* --- Full Name --- */}
                <Controller
                  name="url"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        data-invalid={fieldState.invalid}
                        htmlFor={field.name}
                        className="text-sm font-semibold uppercase tracking-wide text-zinc-500"
                      >
                        Download Url
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id={field.name}
                        placeholder="URL needed for page download"
                        className="h-14 text-lg px-4 border-zinc-200 focus:ring-2"
                        autoCapitalize="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* --- Bio --- */}
                <Controller
                  name="number_of_pages"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        data-invalid={fieldState.invalid}
                        htmlFor={field.name}
                        className="text-sm font-semibold uppercase tracking-wide text-zinc-500"
                      >
                        Number of Pages
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        id={field.name}
                        placeholder="Number of Pages that should be downloaded"
                        className="h-14 text-lg px-4 border-zinc-200 focus:ring-2"
                        autoCapitalize="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <Field>
              <Button
                type="button"
                className="pt-3"
                variant={"outline"}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="pt-3"
                variant={"outline"}
                form="profile-form"
              >
                Save
              </Button>
            </Field>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form;
