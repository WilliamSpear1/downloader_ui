import z from "zod";

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

export type Schema = z.infer<typeof formSchema>;
