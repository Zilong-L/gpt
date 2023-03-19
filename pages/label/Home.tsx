import React from 'react'
import InputBar from './InputBar'
import { defaultHistory } from '../api/Message'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid';
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
export default function Home() {
  const router = useRouter()
  
  function sendPrompt(prompt:string){
    const items = localStorage.getItem('gpt-labels')
    if (items == null) {
      return;
    }
    const oldItems = JSON.parse(items)
    const id = uuidv4()
    oldItems['data'].unshift({ id: id,label:'New Chat'})
    localStorage.setItem('gpt-labels', JSON.stringify(oldItems))
    
    localStorage.setItem(id, JSON.stringify(defaultHistory))
    router.push(`/label/${id}`)
  }
  return (
    <div className='grid grid-cols-1 grid-rows-2  justify-items-center items-end h-screen'>
          <div>
              <h1>ChatGPT</h1>
            <ul>
              <li>按Enter或者飞机发送</li>
              <li>shift+Enter换行</li>
            </ul>
          </div>
          <InputBar sendPrompt={sendPrompt}/>
      </div>
  )
}
