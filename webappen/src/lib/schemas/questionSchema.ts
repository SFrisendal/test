import {z} from "zod";
import {stripHtmlTags} from "@/lib/util";

const required = (name: string) => 
    z.string().trim().min(1, {message: `${name} is required`});

const contentField = z.union([z.string(), z.undefined()])
    .transform(value => value ?? '')
    .refine(value => value.trim().length > 0, {
        message: 'Content is required'
    })
    .refine(
        (value) => stripHtmlTags(value).length >= 10, {
            message: "Content must be at least 10 characters"
        }
    );

export const questionSchema = z.object({
    title: required("Title"),
    content: contentField,
    tags: z.array(z.string(), {message: "At least one tag is required"}) 
        .min(1, {message: "At least one tag is required"})
        .max(5, {message: "Maximum of 5 tags allowed"})
});

export type QuestionSchema = z.input<typeof questionSchema>;