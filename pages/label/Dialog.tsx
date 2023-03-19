import React, { useEffect, useState } from 'react'
import InputBar from './InputBar'
import { useRouter } from 'next/router'
import DialogList from './DialogList'
import { defaultHistory, Messages, Message } from '../api/Message'
import { getData } from '../api/gpt'

export default function Dialog() {
  const router = useRouter()
  const { label } = router.query
  const [history, setHistory]: [Message[], any] = useState([])
  useEffect(() => {
    if (typeof label != 'string') {
      return;
    }
    const storageHistory = localStorage.getItem(label)
    if (storageHistory == null) {
      setHistory(defaultHistory)
      localStorage.setItem(label, JSON.stringify(defaultHistory))
      return;
    }
    setHistory(JSON.parse(storageHistory))
  }, [label])
  async function sendPrompt(prompt: string) {
    const newHistory = history.concat({ 'role': 'user', 'content': prompt })
    setHistory(newHistory)
    setHistory((pre: Message[]) => pre.concat({ 'role': 'assistant', 'content': '' }))
    const response = await getData(newHistory)
    if (response.status == 200) {
      const reader = await response?.body?.getReader()
      let content = ""
      let chunk = ''
      let done, value;
      while (!done) {
        ({ value, done } = await reader?.read() as ReadableStreamReadResult<Uint8Array>);
        if (done) {
          break;
        }
        const str = new TextDecoder().decode(value);
        chunk += str
        if (str.endsWith('\n\n')) {
          content += parseResponse(chunk)
          chunk = ''
          setHistory((history: Message[]) => [...history.slice(0, -1), { ...history[history.length - 1], content }])
        }
      }
    }
    else {
      console.log('too many requests, try again later.')
    }
  }
  useEffect(() => {
    if (history.length == 0) {
      return;
    }
    if (typeof label == 'string') {
      localStorage.setItem(label, JSON.stringify(history))
    }
  }, [history])
  return (
    <div className='grid grid-cols-1   justify-items-center  h-screen'>
      <div className='pb-[120px]  overflow-y-scroll w-full text-center'>
        <DialogList messages={history} />
      </div>
      <div className="absolute bottom-0 w-full h-[100px]  bg-gradient-to-b from-transparent via-white  to-white">




      </div>
      <InputBar sendPrompt={sendPrompt} />
    </div>
  )
}

function parseResponse(chunk: string) {
  let subContent = ''
  const dataList = chunk.split('\n\n').filter(e => e).map(e => e.slice(6))
  for (const data of dataList) {
    if (data == '[DONE]') {
      return subContent
    }
    const json = JSON.parse(data)
    const text = json['choices'][0]['delta']['content']
    if (text && text != '\n\n') {
      subContent += text
    }
  }
  return subContent

}