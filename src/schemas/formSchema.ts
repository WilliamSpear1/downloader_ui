import z from "zod";

/** Validates the download URL, page count, and parent directory form fields. */
export const formSchema = z.object({
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

/** Parsed download form values; the page count is represented as a number. */
export type Schema = z.infer<typeof formSchema>;
