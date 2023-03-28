import React from "react";
import InputBar from "./InputBar";
import { defaultHistory } from "pages/api/Message";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
export default function Welcome() {
    const router = useRouter();

    function sendPrompt(prompt: string) {
        const items = localStorage.getItem("gpt-labels");
        if (items == null) {
            return;
        }
        const oldItems = JSON.parse(items);
        const id = uuidv4();
        oldItems.unshift({ id: id, label: "New Chat" });
        localStorage.setItem("gpt-labels", JSON.stringify(oldItems));
        let history = [...defaultHistory];
        if (prompt) {
            history.push({ role: "user", content: prompt });
        }
        localStorage.setItem(id, JSON.stringify(history));
        router.push(`/label/${id}`);
    }
    return (
        <div className="hscreen_for_mobile grid grid-cols-1  grid-rows-2 items-end justify-items-center">
            <div>
                <h1>ChatGPT</h1>
                <ul>
                    <li>按Enter或者飞机发送</li>
                    <li>shift+Enter换行</li>
                </ul>
            </div>
            <InputBar sendPrompt={sendPrompt} />
        </div>
    );
}
