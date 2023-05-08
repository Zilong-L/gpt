import ReactMarkdown from "react-markdown";
import React, { useEffect, useState, useRef } from "react";
import { Message } from "pages/api/Message";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { toast } from "react-toastify";
import { VscGithubAlt } from "react-icons/vsc";
import { FiUser } from "react-icons/fi";
import gfm from "remark-gfm";
import parse from "remark-parse";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";

interface Props {
    messages: Message[];
    scrollToView?: boolean;
    container?: any;
}

function DialogList({ messages, scrollToView, container }: Props) {
    const elementRef = useRef<null | HTMLDivElement>(null);
    const { theme } = useContext(ThemeContext);
    const [copied, setCopied] = useState(false);

    function handleCopy(markdown: string) {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 400);
    }
    useEffect(() => {
        if (container && elementRef.current && scrollToView) {
            container.scrollTo({
                top:
                    elementRef.current.offsetTop +
                    elementRef.current.scrollHeight,
                behavior: "auto",
            });
        }
    });
    function handleCopyCode(event: any) {
        navigator.clipboard.writeText(
            event.target.parentElement.children[0].textContent
        );
        toast.success("Copied !", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 500,
        });
    }

    const renderers = {
        code: ({ language, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
                <div className="relative">
                    <SyntaxHighlighter
                        style={atomDark}
                        language={match ? match[1] : "cpp"}
                        {...props}
                    >
                        {children}
                    </SyntaxHighlighter>
                    <button
                        className="absolute  top-0  right-0  block rounded-bl-md bg-gray-600  p-2 text-sm text-white transition-all duration-200 hover:bg-gray-700 focus:bg-gray-700"
                        onClick={handleCopyCode}
                        title="Copy to clipboard"
                    >
                        {"Copy"}
                    </button>
                </div>
            ) : (
                <pre className="inline  ">{children}</pre>
            );
        },
    };
    if (typeof window === "undefined") {
        return <div></div>;
    }
    return (
        <div ref={elementRef}>
            {messages.map((e, i) => {
                const markdown = e.content.replace(/\n/g, "  \n");
                return (
                    <div
                        key={i}
                        className={`group  grid place-items-center py-8 text-left font-sans text-xl `}
                        style={{
                            background:
                                e.role == "assistant"
                                    ? theme.botBackground
                                    : theme.userBackground,
                        }}
                    >
                        <div
                            className="relative grid w-[90%] grid-cols-6 md:w-[80%] md:grid-cols-12 min-[1440px]:w-[1024px]"
                            style={{ color: theme.text }}
                        >
                            <div className="col-span1 relative py-2 text-3xl">
                                {e.role == "assistant" ? (
                                    <VscGithubAlt />
                                ) : (
                                    <FiUser />
                                )}
                            </div>
                            <div className=" col-span-5 leading-8 md:col-span-11">
                                <ReactMarkdown
                                    components={renderers}
                                    remarkPlugins={[parse, gfm]}
                                >
                                    {markdown}
                                </ReactMarkdown>
                                <div className="absolute top-0 right-0 h-7 w-7 opacity-0 group-hover:opacity-100">
                                    {copied ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            className="h-full w-full cursor-default"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            className="h-full w-full cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleCopy(markdown)}
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DialogList;
