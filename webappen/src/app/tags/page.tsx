import {getTags} from "@/lib/actions/tag-actions";
import TagCard from "@/app/tags/TagCard";
import TagHeader from "./TagsHeader";

export default async function Page() {
    const {data:tags, error} = await getTags();
    
    if (error) throw error;
    
    return (
        <div className='w-full px-6'>
            <TagHeader />
            <div className='grid grid-cols-3 gap-4'>
                {tags?.map(tag => (
                    <TagCard key={tag.id} tag={tag}/>
                ))}
            </div>            
        </div>
    );
}