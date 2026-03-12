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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DownloadAlert } from "./alert_page";
import axios from "axios";
import { cn } from "@/lib/utils";
import { SpinnerCustom } from "@/components/ui/spinner";
import { formSchema, type Schema } from "@/schemas/formSchema";
import server from "@/api/axiosInstance";

const Form = () => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      number_of_pages: 1,
      parent_directory: "",
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleOnSubmit = async (data: Schema) => {
    setIsLoading(true);

    try {
      await server.post("/download", data);
      console.log(data);
      console.log(isLoading);
      form.reset();
      setShowSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // If Flask returns a 4xx or 5xx code, it jumps here
        console.error("Server returned error code:", error.status);
        console.error("Error message:", error.response);
      } else {
        console.error("Network or Setup Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => setShowSuccess(false), 5000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  return (
    <>
      {<SpinnerCustom isLoading={isLoading} />}
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50">
        {<DownloadAlert showSuccess={showSuccess} />}
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
            {/* --- Buttons --- */}
            <Field>
              <Button
                type="button"
                className="pt-3 hover:scale-105 bg-white/50"
                variant={"outline"}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className={cn(
                  "pt-3",
                  isLoading && "opacity-50 cursor-not-allowed",
                  !isLoading && "hover:scale-105",
                )}
                variant={"outline"}
                form="download-form"
                disabled={isLoading}
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
