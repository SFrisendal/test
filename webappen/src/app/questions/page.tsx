

import {getQuestions} from "@/lib/actions/question-actions";
import QuestionCard from "@/app/questions/QuestionCard";
import QuestionsHeader from "@/app/questions/QuestionsHeader";
import {SearchParams} from "next/dist/server/request/search-params";

export default async function QuestionsPage({searchParams}: {searchParams?: Promise<{tag?: string}>}) {
    const params = await searchParams;
    
    const {data: questions, error} = await getQuestions(params?.tag);    
    
    if (error) throw error;
    
    return (
        <>
            <QuestionsHeader total={questions?.length} tag={params?.tag}/>
            {questions?.map(question => (
                <div key={question.id} className='py-4 not-last:border-b w-full flex'>
                    <QuestionCard key={question.id} question={question} />
                </div>
                ))}
        </>
    );
}