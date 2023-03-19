// import { fetch,Body,ResponseType } from '@tauri-apps/api/http';
import { Messages, Message } from './Message'

const url = "https://api.openai.com/v1/chat/completions"
// const api_key = "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"
const api_key = "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"
// const api_key = "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"
const Model = "gpt-3.5-turbo"
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${api_key}`
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
async function getData(history: Message[]) {
    const data = {
        "model": Model,
        "messages": history.slice(-11),
        "temperature": 0.7,
        "stream": true
    }
    console.log(data)
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        });
        return response

    }
    catch (e) {
        throw (e)
    }
}

export { getData }