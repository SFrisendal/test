import {stripHtmlTags} from "@/lib/util";
import z from "zod";


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
export const answerSchema = z.object({
    
    content: contentField
    
});

export type AnswerSchema = z.input<typeof answerSchema>;