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
const defaultHistory = [{ 'role': 'system', 'content': '你是一位可以帮助人解答问题的助手。' },
{ 'role': 'user', 'content': '你是谁？' },
{ 'role': 'assistant', 'content': '我是一位可以解答问题的助手。有什么可以帮您的吗？' }]
export { Messages, Message, defaultHistory }