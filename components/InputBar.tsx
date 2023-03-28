import React, { useEffect, useState, useRef } from "react";
import { FaRegPaperPlane } from "react-icons/fa";

const MAXROWS = 6; // maximum number of visible lines

interface Props {
    sendPrompt: Function;
}

export default function TextEditor({ sendPrompt }: Props) {
    const [value, setValue] = useState("");
    const textAreaRef: React.Ref<HTMLTextAreaElement> = useRef(null);
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, []);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key == "Enter" && !event.shiftKey) {
            sendPrompt(value);
            event.preventDefault();
            setValue("");
            console.log("enter");
        }
    };
    const handleClick = () => {
        sendPrompt(value);
        setValue("");
        console.log("click");
    };
    useEffect(() => {
        adjustTextareaHeight();
    }, [value]);
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    };
    function adjustTextareaHeight() {
        const textarea: HTMLElement | null =
            document.getElementById("textArea");
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height =
            Math.min(
                textarea.scrollHeight,
                MAXROWS * parseInt(getComputedStyle(textarea).lineHeight)
            ) + "px";
    }

    return (
        <div className="fixed bottom-[20px] left-0 right-0 ml-auto mr-auto grid w-5/6  grid-cols-6 rounded border border-gray-300 bg-white py-2 shadow-lg transition-shadow duration-200 focus-within:shadow-sm  hover:shadow-sm md:grid-cols-12">
            <div className="col-span-5 w-full md:col-span-11">
                <textarea
                    ref={textAreaRef}
                    title="textarea"
                    id={"textArea"}
                    className="my-0  w-full resize-none px-4  pt-2 leading-normal focus:border-none focus:outline-none"
                    value={value}
                    onChange={(event) => handleChange(event)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />
            </div>
            <div
                className="self-end justify-self-center p-3 hover:cursor-pointer hover:bg-slate-300"
                onClick={handleClick}
            >
                <FaRegPaperPlane />
            </div>
        </div>
    );
}
