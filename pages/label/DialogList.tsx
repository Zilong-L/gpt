import React, { useMemo } from 'react'
import { Message } from '../api/Message'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
interface Props {
    messages: Message[]
}
function DialogList({ messages }: Props) {
    if (window == undefined) {
        return <></>
    }
    function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
        console.log(typeof event.target.parentElement.children[0].textContent)
        navigator.clipboard.writeText(event.target.parentElement.children[0].textContent)
    }
    const renderers = {
        code: ({ inline, language, children }) => {
            return (
                inline ?
                    <code className='inline '>
                        {children}
                    </code> :
                    <div className="relative bg-slate-700 text-gray-200 px-4 py-2 leading-6">
                        <code>
                            {children}
                        </code>
                        <button
                            className="absolute block top-0 right-0 p-2 text-sm text-white bg-gray-600 rounded-bl-md hover:bg-gray-700 focus:bg-gray-700 transition-all duration-200"
                            onClick={handleCopy}
                            title="Copy to clipboard"
                        >
                            {'Copy'}
                        </button>
                    </div>
            );
        }
    };
    return (
        <div>{messages.map((e, i) => <div key={i} className={`grid place-items-center text-left py-8 text-xl ${e.role == 'assistant' ? 'border bg-gray-100' : ''}`}>
            <div className='grid grid-cols-12 lg:w-[1024px] w-[80%]'>
                <div className='col-span1'>照片</div>
                <div className="col-span-11 overflow-x-auto leading-10 ">
                    <ReactMarkdown components={renderers}>{e.content}</ReactMarkdown>
                </div>
            </div>
        </div>)
        }</div >
    )
}

export default React.memo(DialogList)
