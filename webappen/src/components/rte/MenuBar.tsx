import {
    BoldIcon,
    CodeBracketIcon,
    ItalicIcon, LinkIcon,
    ListBulletIcon,
    PhotoIcon,
    StrikethroughIcon,
    UnderlineIcon
} from "@heroicons/react/20/solid";
import {Editor} from "@tiptap/core";
import {useEditorState} from "@tiptap/react";
import {Button} from "@heroui/button";
import {CldUploadButton, CloudinaryUploadWidgetResults} from "next-cloudinary";
import { errorToast } from "@/lib/util";

type Props = {
    editor: Editor | null;
}

export default function MenuBar({editor}: Props    ) {
    const editorState = useEditorState({
        editor,
        selector: ({editor}) => {
            if (!editor) return null;
            return {
                isBold: editor.isActive('bold'),
                isItalic: editor.isActive('italic'),
                isStrike: editor.isActive('strike'),
                isUnderline: editor.isActive('underline'),
                isCodeBlock: editor.isActive('codeBlock'),
                isLink: editor.isActive('link'),
            }
        }
    });
    
    if (!editor || !editorState) return  null;
    
    const onUploadImage = (result: CloudinaryUploadWidgetResults) => {
        if (result.info && typeof result.info === 'object') {
            editor.chain().focus().setImage({src: result.info.secure_url}).run();
        } else {
            errorToast({message: 'Failed to upload image'});
        }
    }
    
    const options = [
        {
            icon: <BoldIcon className="w-5 h-5" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editorState.isBold
        },
        {
            icon: <ItalicIcon className="w-5 h-5" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editorState.isItalic
        },
        {
            icon: <StrikethroughIcon className="w-5 h-5" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editorState.isStrike
        },
        {
            icon: <UnderlineIcon className="w-5 h-5" />,
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            pressed: editorState.isCodeBlock
        },
        {
            icon: <ListBulletIcon className="w-5 h-5" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editorState.isCodeBlock
        },
        {
            icon: <CodeBracketIcon className="w-5 h-5" />,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            pressed: editorState.isCodeBlock
        },
        {
            icon: <LinkIcon className="w-5 h-5" />,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            pressed: editorState.isLink
        },
        
    ]
    
    return (
        <div className="rounded-md space-x-1 pb-1 z-50">
            {options.map((option, index) => (
                <Button 
                    type='button'
                    radius= 'sm'
                    size = 'sm'
                    key={index} 
                    onPress={option.onClick} 
                    className={option.pressed ? 'bg-primary' : ''}
                    isIconOnly
                    color={option.pressed ? 'primary' : 'default'}
                >
                    {option.icon}
                </Button>
            ))}     
            <Button
                isIconOnly
                size = 'sm'
                as = {CldUploadButton}
                options = {{maxFiles : 1}}
                onSuccess = {onUploadImage}
                signatureEndpoint = '/api/sign-image'
                uploadPreset = 'overflow'
            >
                <PhotoIcon className='w-5 h-5'/>
            </Button>
        </div>
    );
}