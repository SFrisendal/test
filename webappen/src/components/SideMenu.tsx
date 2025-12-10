'use client'

import {Listbox, ListboxItem} from "@heroui/listbox";
import {HomeIcon, TagIcon, UserIcon} from "@heroicons/react/24/solid"; 
import {QuestionMarkCircleIcon} from "@heroicons/react/24/outline";
import {usePathname} from "next/navigation";

    export default function SideMenu() {
    
    const pathname = usePathname();
    
    const navLinks = [
        {key: 'home', icon: HomeIcon, text: 'Home', href: '/'},
        {key: 'questions', icon: QuestionMarkCircleIcon ,href: '/questions',text: 'Questions'},
        {key: 'tags', icon: TagIcon ,href: '/tags',text: 'Tags'},
        {key: 'session', icon: UserIcon ,href: '/session',text: 'User Session'},
    ]
    
    return (
        <Listbox aria-label='nav-links' variant='faded' items={navLinks} className='sticky top-20 ml-6'  >
            {({key, href, icon: Icon, text}) => (
                <ListboxItem
                    href={href}
                    aria-labelledby={key}
                    aria-describedby={text}
                    key={key}
                    startContent={<Icon className='h-6'/>}
                    classNames ={{
                        base: pathname === href ? 'text-secondary': '',
                        title: 'text-lg'
                    }}
                >
                    {text}
                </ListboxItem>
            )}
        </Listbox>
    );
}