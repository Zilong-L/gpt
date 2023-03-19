import React from 'react'
import { Message } from '../api/Message'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
interface Props {
    messages: Message[]
}
export default function DialogList({ messages }: Props) {
    if (messages == undefined) {
        return <></>
    }

    messages = messages.slice(1)
    return (
        <div>{messages.map((e, i) => <div key={i} className={`grid place-items-center text-left py-8 text-xl ${e.role == 'assistant' ? 'border bg-gray-100' : ''}`}>
            <div className='grid grid-cols-12 lg:w-[1024px] w-[80%]'>
                <div className='col-span1'>照片</div>
                <div className="col-span-11 overflow-x-auto"><ReactMarkdown wrap={20} components={{ code: CodeBlock }}>{e.content}</ReactMarkdown></div>
            </div>
        </div>)
        }</div >
    )
}

interface CodeProps {
    node: Node;
    inline: boolean;
    className: string;
    children: React.ReactNode;
}

const Code: React.FC<CodeProps> = ({ node, inline, className, children, ...props }) => {
    if (inline) {
        return <code {...props} style={{ backgroundColor: '#eee', padding: '2px 4px', borderRadius: '4px' }}>{children}</code>;
    }
    return (
        <pre className='bg-white  '>
            <code {...props} className={className} >
                {children}
            </code>
        </pre>
    );
};
interface CodeBlockProps {
    node: Element;
    inline: boolean;
    className: string;
    children: string;
}
const CodeBlock: React.FC<CodeBlockProps> = ({ node, inline, className, children }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
        <SyntaxHighlighter language={match[1]} style={dark}>
            {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
    ) : (
        <code className={className}>{children}</code>
    );
};