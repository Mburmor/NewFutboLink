import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class Gpt3Service {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; // Endpoint para el modelo GPT-3.5-turbo-16k
  private apiKey = 'sk-proj-StCfpHy934IJfEBnvNTST3BlbkFJngkVtg7VAMhuMa69qAvf';

  constructor() { }

  async sendMessage(prompt: string, chatHistory: {message: string, sender: 'user' | 'bot'}[]): Promise<string> {
    try {
      const messages = chatHistory.map(chat => ({
        role: chat.sender === 'user' ? 'user' : 'assistant',
        content: chat.message
      }));
      messages.push({ role: 'user', content: prompt });

      const response = await axios.post(this.apiUrl, {
        model: 'gpt-3.5-turbo-16k',
        messages: messages,
        max_tokens: 500,
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const completion = response.data.choices[0].message.content;
      return completion;
    } catch (error: any) { // Especificar el tipo 'any' para error
      console.error('Error al comunicarse con OpenAI', error);
      if (error.response && error.response.status === 401) {
        throw new Error('Error de autenticación: Verifica tu API Key');
      } else if (error.response && error.response.status === 429) {
        throw new Error('Límite de uso alcanzado: Intenta nuevamente más tarde');
      } else {
        throw new Error('Error al comunicarse con OpenAI');
      }
    }
  }
}
