import {Button} from "@heroui/button";
import {ArrowDownCircleIcon, ArrowUpCircleIcon, CheckIcon} from "@heroicons/react/24/outline";

type Props = {
    accepted?: boolean;
}

export default function VotingButtons({accepted}: Props) {
    return (
        <div className="hrink-0 flex flex-col gap-3 items-center justify-start mt-4">
            <Button
                isIconOnly
                variant='light'
            >
                <ArrowUpCircleIcon  className="w-12"  />
                <span className='text-xl font-semibold'>0</span>
            </Button>
            <Button
                isIconOnly
                variant='light'
            >
                <ArrowDownCircleIcon  className="w-12"  />
                <span className='text-xl font-semibold'>0</span>
            </Button>
            {accepted && (
                <Button
                    isIconOnly
                    variant='light'
                >
                    <CheckIcon className='size-12 text-success' strokeWidth={4} />
                </Button>
            )}
        </div>
    );
}