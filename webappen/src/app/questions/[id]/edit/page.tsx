import QuestionForm from "@/app/questions/ask/QuestionForm";
import {getQuestionById} from "@/lib/actions/question-actions";
import {notFound} from "next/navigation";
import {handleError} from "@/lib/util";

type Params = Promise<{id: string}>

export default async function EditQuestionPage({params}: {params: Params}) {
    const {id} = await params;
    const {data: question, error} = await getQuestionById(id);
    
    if (error) handleError(error);
    if (!question) return notFound();
    
    return (
        <div className='flex flex-col gap-4 px-6'>
            <h3 className='txt-3xl font-semibold'>
               Edit Your Questions 
            </h3>
            <QuestionForm questionToUpdate={question} />
        </div>
    );
}