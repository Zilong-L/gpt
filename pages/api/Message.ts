class Message {
  public role: string;
  public content: string;
  constructor() {
    this.role = '';
    this.content = '';
  }
}
class Messages {
  public history: Message[];

  constructor() {
    this.history = [];
  }

  public add(role: string, content: string): void {
    const message: Message = { role, content };
    this.history.push(message);
  }

  public removeLast(): void {
    this.history.pop();
  }
  public clear(): void {
    this.history = [];
  }

  public get messages(): Message[] {
    return this.history;
  }

}
const defaultHistory = [{ 'role': 'system', 'content': 'you are a helpful assistant that can help user with any questions.' },
{ 'role': 'user', 'content': 'who are you?' },
{ 'role': 'assistant', 'content': 'I am a helpful assistant that can help you with any questions. How may I help you today?' }]
export { Messages, Message, defaultHistory }