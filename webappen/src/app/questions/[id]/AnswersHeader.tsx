'use client'

import {Select, SelectItem} from "@heroui/select";

type Props = {
    answerCount : number;
}

export default function AnswersHeader({ answerCount }: Props) {
    return (
        <div className="flex items-center justify-between w-full pt-3 px-6">
            <div className="text-2xl">
                {answerCount} {answerCount === 1 ? 'answer' : 'answers'}
            </div>
            <div className='flex items-center gap-3 justify-end w-[50%] ml-auto' >
                <Select 
                    aria-label = 'Select Sorting'
                    defaultSelectedKeys={['highScore']}
                >
                    <SelectItem key='highScore'>Highest Score (default)</SelectItem>
                    <SelectItem key='created'>Date Created</SelectItem>
                </Select>
            </div>
        </div>
    );
}