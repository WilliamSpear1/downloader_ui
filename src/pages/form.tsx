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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { DownloadAlert } from "./alert";

const Form = () => {
  const formSchema = z.object({
    url: z.url(),
    number_of_pages: z
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .positive()
          .min(1, "Number of Pages Must be greater then 0"),
      ),
    parent_directory: z.string(),
  });

  type Schema = z.infer<typeof formSchema>;

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      number_of_pages: 1,
      parent_directory: "",
    },
  });

  const server = axios.create({
    baseURL: "http://localhost:5000",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOnSubmit = async (data: Schema) => {
    try {
      await server.post("/download", data);
      form.reset();
      setShowSuccess(true);
      console.log("Set show success to true");
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      // If Flask returns a 4xx or 5xx code, it jumps here
      if (error.response) {
        console.error("Server returned error code:", error.response.status);
        console.error("Error message:", error.response.data);
      } else {
        console.error("Network or Setup Error:", error.message);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50">
        {showSuccess && <DownloadAlert />}
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
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="space-y-10"
          >
            <FieldSet className="pb-4">
              <FieldLegend>Download Information</FieldLegend>
              <FieldDescription>
                This information will trigger downloading of videos from site.
              </FieldDescription>

              <FieldGroup>
                {/* --- URL --- */}
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

                {/* --- number of pages --- */}
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
                {/* --- parent directory --- */}
                <Controller
                  name="parent_directory"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        data-invalid={fieldState.invalid}
                        htmlFor={field.name}
                        className="text-sm font-semibold uppercase tracking-wide text-zinc-500"
                      >
                        Parent Directory
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id={field.name}
                        placeholder="Directory Parent"
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
                form="download-form"
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
