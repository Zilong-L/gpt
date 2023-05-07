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
        <div className="transform-gpu hscreen_for_mobile grid grid-cols-1  grid-rows-2 items-end justify-items-center">
            <div>
                <h1>ChatGPT</h1>
                <ul>
                    <li>数据只更新到2021年9月，之后的事情一概不知</li>
                    <li>可能会给出错误的答案，请自行判断</li>
                    <li>仅限学习工作使用，不要透露隐私信息</li>
                    <li>英文效果可能好一点</li>

                </ul>
            </div>
            <InputBar sendPrompt={sendPrompt} />
        </div>
    );
}
