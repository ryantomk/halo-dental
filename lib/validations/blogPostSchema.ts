import { z } from "zod";

export const blogPostFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().min(10, "Content must be at least 10 characters."),
  category: z.string().default("Dental Health"),
  coverImageUrl: z.string().optional().or(z.literal("")),
  authorId: z.string().uuid().optional().or(z.literal("")).nullable(),
  seoTitle: z.string().optional().or(z.literal("")),
  seoDescription: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;
