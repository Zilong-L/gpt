import ReactMarkdown from "react-markdown";
import React, { useEffect, useRef } from "react";
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
    function handleCopy(event: any) {
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
                        onClick={handleCopy}
                        title="Copys to clipboard"
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
                        className={`grid place-items-center py-8 text-left font-sans text-xl `}
                        style={{
                            background:
                                e.role == "assistant"
                                    ? theme.botBackground
                                    : theme.userBackground,
                        }}
                    >
                        <div
                            className="grid w-[90%]  grid-cols-6 md:w-[80%] md:grid-cols-12 min-[1440px]:w-[1024px]"
                            style={{ color: theme.text }}
                        >
                            <div className="col-span1 relative py-2 text-3xl">
                                {e.role == "assistant" ? (
                                    <VscGithubAlt />
                                ) : (
                                    <FiUser />
                                )}
                            </div>
                            <div className="col-span-5   leading-8 md:col-span-11">
                                <ReactMarkdown
                                    components={renderers}
                                    remarkPlugins={[parse, gfm]}
                                >
                                    {markdown}
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
