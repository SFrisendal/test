import {Button} from "@heroui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className='h-full flex items-center justify-center'>
            <div className='text-center space-y-6'>
                <h1 className='text-5xl font-bold '>
                    404 - Page not found
                </h1>
                <p className='text-lg text-foreground-500'>
                    Sorry, the page is not here at the moment.
                </p>
                <Button as={Link} href='/' color='secondary'>
                    Go home
                </Button>
                    
            </div>
        </div>
    );
}