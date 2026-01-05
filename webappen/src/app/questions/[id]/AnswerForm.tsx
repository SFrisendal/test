'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {answerSchema, AnswerSchema} from "@/lib/schemas/answerSchema";
import {Controller, useForm} from "react-hook-form";
import {useTransition} from "react";
import {postAnswer} from "@/lib/actions/question-actions";
import {Answer} from "@/lib/types";
import {handleError} from "@/lib/util";
import {Form} from "@heroui/form";
import RichTextEditor from "@/components/rte/RichTextEditor";
import { Button } from "@heroui/react";

type Props = {
    answer?: Answer;
    questionId: string;
}

export default function AnswerForm({answer, questionId}: Props) {
    const [pending, startTrasition] = useTransition();
    const {control, handleSubmit, reset,formState} = useForm<AnswerSchema>({
        mode: 'onTouched',
        resolver: zodResolver(answerSchema)
    })
    
    const onSubmit = (data: AnswerSchema) => {
        startTrasition(async () => {
            const {error} = await postAnswer(data, questionId);
            if (error) handleError(error);
            reset();
        })
    }
    
    return (
        <div className='flex flex-col gap-3 items-start my-4 w-full px-6'>
            <h3 className='text-2xl font-semibold'>
                Your Answer
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full gap-3'>
                <Controller 
                    control={control}
                    name='content'
                    render={({field: {onChange, onBlur, value}, fieldState}) => (
                        <>
                            <RichTextEditor
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value || ''}
                                errorMessage={fieldState.error?.message}
                            />
                            {fieldState.error?.message && (
                                <span className='text-xs text-danger -mt-1'>
                                    {fieldState.error.message}
                                </span>
                            )}
                        </>
                    )}
                />
                <Button
                    className='w-fit'
                    isDisabled={!formState.isValid || pending}
                    isLoading={pending}
                    color='primary'
                    type='submit'
                >
                    Post Your Answer
                </Button>
            </form>
        </div>
    );
}