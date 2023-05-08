import React, { useEffect, useState, useMemo, useRef } from "react";
import InputBar from "./InputBar";
import { useRouter } from "next/router";
import DialogList from "./DialogList";
import { Message } from "pages/api/Message";
import { toast } from "react-toastify";
import { Id } from "react-toastify/dist/types";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
export default function Dialog() {
    const router = useRouter();
    const { label } = router.query;
    const [history, setHistory]: [Message[], any] = useState([]);
    const [temp, setTemp]: [Message[], any] = useState([]);
    const [isBottom, setIsBottom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastId, setToastId]: [Id, any] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { theme } = useContext(ThemeContext);
    const abortControllerRef = useRef(null);

    const handleCancel = () => {
        if (abortControllerRef.current) {
            setHistory((history) => [
                ...history,
                {
                    role: "assistant",
                    content: temp[temp.length - 1]?.content || "",
                },
            ]);
            // Clear the temp chat
            setTemp([]);
            abortControllerRef.current.abort();
        }
    };

    const CommunicateWithGPT = () => {
        if (!loading) {
            return;
        }

        // Create an AbortController instance and store it in the ref
        abortControllerRef.current = new AbortController();
        setTemp([{ role: "assistant", content: "" }]);
        setIsBottom(true);
        fetch("/api/gpt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ history }),
            signal: abortControllerRef.current.signal, // Pass the signal to the fetch options
        })
            .then(handleResponse)
            .then(() => {})
            .catch((e) => {
                if (e.name === "AbortError") {
                    console.log("Fetch request was canceled");
                } else {
                    console.error(e);
                    toast.error(e);
                    toast.update(toastId, {
                        render: "fail to load",
                        type: "error",
                        isLoading: false,
                        autoClose: 500,
                    });
                }
            })
            .finally(() => {
                setLoading(false);

                // Clean up the abort controller
                abortControllerRef.current = null;
            });
    };

    const storeHistory = () => {
        if (history.length === 0) {
            return;
        }
        if (typeof label === "string") {
            localStorage.setItem(label, JSON.stringify(history));
        }
    };
    function handleChatChange() {
        if (typeof label != "string") {
            return;
        }
        const storageHistory = localStorage.getItem(label);
        if (storageHistory == null) {
            router.push("label");
            return;
        }
        const historyJson = JSON.parse(storageHistory);
        setHistory(historyJson);
        const lastPrompt = historyJson.slice(-1)[0];
        if (lastPrompt["role"] == "user" && !loading) {
            setLoading(true);
        }

        return () => {
            setLoading(false);
            setTemp([]);
        };
    }

    async function handleResponse(response: Response) {
        if (response.status == 200) {
            const reader = await response?.body?.getReader();
            let done, value;
            let newContent = "";
            let start = false;
            while (!done) {
                ({ value, done } =
                    (await reader?.read()) as ReadableStreamReadResult<Uint8Array>);
                if (done) {
                    break;
                }
                newContent += new TextDecoder().decode(value);
                setTemp([{ role: "assistant", content: newContent }]);

                if (containerRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } =
                        containerRef.current;
                    if (
                        !start ||
                        scrollTop + clientHeight + 50 >= scrollHeight
                    ) {
                        setIsBottom(true);
                        start = true;
                    } else {
                        setIsBottom(false);
                    }
                }
            }
            setTemp([]);
            setHistory((history: Message[]) => [
                ...history,
                { role: "assistant", content: newContent },
            ]);
        }
    }
    async function sendPrompt(prompt: string) {
        const newHistory = history.concat({ role: "user", content: prompt });
        console.log(prompt);
        setHistory(newHistory);

        setLoading(true);
    }

    const MarkdownMemo = useMemo(() => {
        return <DialogList messages={history.slice(1)} />;
    }, [history]);

    useEffect(storeHistory, [history]);
    useEffect(handleChatChange, [label]);
    useEffect(CommunicateWithGPT, [loading]);

    return (
        <div
            className="hscreen_for_mobile grid transform-gpu grid-cols-1  justify-items-center overflow-y-auto break-words "
            style={{ background: theme.userBackground }}
        >
            <div
                className="w-full  overflow-y-scroll pb-[220px] text-center"
                ref={containerRef}
            >
                {MarkdownMemo}
                <DialogList
                    messages={temp}
                    scrollToView={isBottom}
                    container={containerRef.current}
                />
            </div>
            <div
                className="fixed bottom-0 h-[100px] w-full "
                style={{
                    background: `linear-gradient(to bottom, transparent, ${theme.userBackground},${theme.userBackground})`,
                }}
            ></div>
            {!loading && <InputBar sendPrompt={sendPrompt} />}

            {loading && (
                <button
                    onClick={handleCancel}
                    className="fixed bottom-[100px] flex rounded-md border border-gray-300 bg-white py-3 px-6 font-medium text-gray-700 shadow-sm hover:bg-gray-100
"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mr-4 h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                        />
                    </svg>
                    中断生成
                </button>
            )}
        </div>
    );
}
