import ReactMarkdown from "react-markdown";
import React, { useEffect, useRef } from "react";
import { Message } from "pages/api/Message";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
    messages: Message[];
    scrollToView?: boolean;
}
function DialogList({ messages, scrollToView }: Props) {
    if (typeof window === "undefined") {
        return <div></div>;
    }
    const elementRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (elementRef.current && scrollToView) {
            console.log(scrollToView);
            elementRef.current.scrollIntoView();
        }
    });
    function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
        console.log(typeof event.target.parentElement.children[0].textContent);
        navigator.clipboard.writeText(
            event.target.parentElement.children[0].textContent
        );
    }
    const renderers = {
        code: ({ inline, language, children }) => {
            return inline ? (
                <code className="inline ">{children}</code>
            ) : (
                <div className="relative bg-slate-700 px-4 py-2 leading-6 text-gray-200">
                    <code>{children}</code>
                    <button
                        className="absolute  top-0  right-0  block rounded-bl-md bg-gray-600  p-2 text-sm text-white transition-all duration-200 hover:bg-gray-700 focus:bg-gray-700"
                        onClick={handleCopy}
                        title="Copy to clipboard"
                    >
                        {"Copy"}
                    </button>
                </div>
            );
        },
    };
    return (
        <div ref={elementRef}>
            {messages.map((e, i) => {
                console.log("calculate");
                return (
                    <div
                        key={i}
                        className={`grid place-items-center py-8 text-left text-xl ${
                            e.role == "assistant" ? "border bg-gray-100" : ""
                        }`}
                    >
                        <div className="grid w-[80%] grid-cols-12 lg:w-[1024px]">
                            <div className="col-span1">照片</div>
                            <div className="col-span-11 overflow-x-auto leading-10 ">
                                <ReactMarkdown components={renderers}>
                                    {e.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DialogList;
