import React, { useEffect, useState, useRef } from "react";
import { FaRegPaperPlane } from 'react-icons/fa'

const MAXROWS = 6; // maximum number of visible lines

interface Props{
  sendPrompt:Function,
}

export default function TextEditor({ sendPrompt }:Props){
  const [value, setValue] = useState("");
  const textAreaRef = useRef(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key == 'Enter' && !event.shiftKey) {
      sendPrompt(value)
      event.preventDefault()
      setValue('')
      console.log('enter')
    }
  }
  const handleClick = () => {
    sendPrompt(value)
    setValue('')
    console.log('click')
  }
  useEffect(() => { adjustTextareaHeight() }, [value])
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }
  function adjustTextareaHeight() {
    const textarea: HTMLElement | null = document.getElementById('textArea')
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, MAXROWS * parseInt(getComputedStyle(textarea).lineHeight)) + 'px';
  }


  return (
    <div className="absolute  bg-white bottom-[20px] left-0 right-0 ml-auto mr-auto py-2 w-5/6 border shadow-lg border-gray-300 rounded hover:shadow-sm focus-within:shadow-sm transition-shadow duration-200  grid grid-cols-12">
      <div className="w-full col-span-11">
        <textarea
          title="textarea"
          id={'textArea'}
          className="leading-normal  pt-2 px-4 my-0  resize-none w-full focus:border-none focus:outline-none"
          value={value}
          onChange={(event) => handleChange(event)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
      </div>
      <div className="justify-self-center self-end hover:bg-slate-300 p-3 hover:cursor-pointer"onClick={handleClick}><FaRegPaperPlane /></div>
    </div>
  );
}