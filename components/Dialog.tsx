import React, { useEffect, useState, useMemo, useRef } from "react";
import InputBar from "./InputBar";
import { useRouter } from "next/router";
import DialogList from "./DialogList";
import { defaultHistory, Messages, Message } from "pages/api/Message";
import { getData } from "pages/api/gpt";

export default function Dialog() {
    const router = useRouter();
    const { label } = router.query;
    const [history, setHistory]: [Message[], any] = useState([]);
    const [temp, setTemp] = useState([]);
    const [loading, setLoading] = useState(false);
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
        try {
            getData(history).then((response) => handleResponse(response));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleResponse(response: Response) {
        if (response.status == 200) {
            const reader = await response?.body?.getReader();
            let content = "";
            let chunk = "";
            let done, value;
            let i = 0;
            while (!done) {
                ({ value, done } =
                    (await reader?.read()) as ReadableStreamReadResult<Uint8Array>);
                if (done) {
                    break;
                }
                const str = new TextDecoder().decode(value);
                chunk += str;
                if (str.endsWith("\n\n")) {
                    content += parseResponse(chunk);
                    chunk = "";
                    setTemp([{ role: "assistant", content: content }]);
                }
            }
            setTemp([]);
            setHistory((history: Message[]) => [
                ...history,
                { role: "assistant", content: content },
            ]);
        } else {
            console.log("too many requests, try again later.");
        }
    }
    async function sendPrompt(prompt: string) {
        const newHistory = history.concat({ role: "user", content: prompt });
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
            ref={containerRef}
            className="grid h-screen grid-cols-1  justify-items-center "
        >
            <div className="w-full  overflow-y-scroll pb-[120px] text-center">
                {MarkdownMemo}
                <DialogList messages={temp} scrollToView />
            </div>
            <div className="absolute bottom-0 h-[100px] w-full bg-gradient-to-b from-transparent  via-white to-white"></div>
            <InputBar sendPrompt={sendPrompt} />
        </div>
    );
}

function parseResponse(chunk: string) {
    let subContent = "";
    const dataList = chunk
        .split("\n\n")
        .filter((e) => e)
        .map((e) => e.slice(6));
    for (const data of dataList) {
        if (data == "[DONE]") {
            return subContent;
        }
        const json = JSON.parse(data);
        const text = json["choices"][0]["delta"]["content"];
        if (text && text != "\n\n") {
            subContent += text;
        }
    }
    return subContent;
}
