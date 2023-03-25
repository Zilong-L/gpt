import React, { useEffect, useState, useMemo, useRef } from "react";
import InputBar from "./InputBar";
import { useRouter } from "next/router";
import DialogList from "./DialogList";
import { Message } from "pages/api/Message";
import { getData } from "pages/api/gpt";
import { toast } from "react-toastify";
import { Id } from "react-toastify/dist/types";
import { read } from "fs";

export default function Dialog() {
    const router = useRouter();
    const { label } = router.query;
    const [history, setHistory]: [Message[], any] = useState([]);
    const [temp, setTemp]: [Message[], any] = useState([]);
    const [isBottom, setIsBottom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastId, setToastId]: [Id, any] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
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
            setToastId(
                toast.loading("generating...", {
                    position: toast.POSITION.TOP_CENTER,
                })
            );
            setLoading(true);
        }

        return () => {
            setLoading(false);
            setTemp([]);
        };
    }

    function CommunicateWithGPT() {
        if (!loading) {
            return;
        }
        setIsBottom(true);
        fetch('/api/gpt',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({history})
        })
            .then(handleResponse)
            .then(() => {
                toast.update(toastId, {
                    render: "Done",
                    type: "success",
                    isLoading: false,
                    autoClose: 100,
                });
            })
            .catch((e) => {
                console.error(e);
                toast.error(e);
                toast.update(toastId, {
                    render: "fail to load",
                    type: "error",
                    isLoading: false,
                    autoClose: 500,
                });
            })
            .finally(() => {
                setLoading(false);
                toast.update(toastId, {
                    render: "Done",
                    type: "success",
                    isLoading: false,
                    autoClose: 100,
                });
            });
    }

    async function handleResponse(response: Response) {
        if(response.status==200){
        const reader =  await response?.body?.getReader();
        let done, value;
        let newContent = ''
        while (!done) {
            ({ value, done } =
                (await reader?.read()) as ReadableStreamReadResult<Uint8Array>);
            if (done) {
                break;
            }
            newContent = new TextDecoder().decode(value);
            setTemp([{ role: "assistant", content: newContent }]);
            if (containerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } =
                    containerRef.current;
                if (scrollTop + clientHeight + 50 >= scrollHeight) {
                    setIsBottom(true);
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
        setToastId(
            toast.loading("generating...", {
                position: toast.POSITION.TOP_CENTER,
            })
        );
        setLoading(true);
    }

    const MarkdownMemo = useMemo(() => {
        return <DialogList messages={history.slice(1)} />;
    }, [history]);

    useEffect(storeHistory, [history]);
    useEffect(handleChatChange, [label]);
    useEffect(CommunicateWithGPT, [loading]);

    return (
        <div className="grid h-screen grid-cols-1  justify-items-center ">
            <div
                className="w-full  overflow-y-scroll pb-[120px] text-center"
                ref={containerRef}
            >
                {MarkdownMemo}
                <DialogList
                    messages={temp}
                    scrollToView={isBottom}
                    container={containerRef.current}
                />
            </div>
            <div className="absolute bottom-0 h-[100px] w-full bg-gradient-to-b from-transparent  via-white to-white"></div>
            {!loading && <InputBar sendPrompt={sendPrompt} />}
        </div>
    );
}
