import { Component, OnInit } from '@angular/core';
import { Gpt3Service } from '../../services/gpt3.service';

@Component({
  selector: 'app-tactibot',
  templateUrl: './tactibot.component.html',
  styleUrls: ['./tactibot.component.scss'],
})
export class TactibotComponent implements OnInit {
  userMessage: string = '';
  chatHistory: {message: string, sender: 'user' | 'bot'}[] = [];

  constructor(private gpt3Service: Gpt3Service) { }

  ngOnInit() {
    this.chatHistory.push({ message: "¡Hola, soy TactiBot!, ¿tienes alguna pregunta sobre fútbol? Normativas... tácticas... consejos...", sender: 'bot' });
  }

  async sendMessage() {
    if (this.userMessage.trim() === '') {
      return;
    }

    this.chatHistory.push({ message: this.userMessage, sender: 'user' });

    try {
      const response = await this.gpt3Service.sendMessage(this.userMessage, this.chatHistory);
      this.chatHistory.push({ message: response, sender: 'bot' });
    } catch (error) {
      console.error('Error al comunicarse con OpenAI', error);
      this.chatHistory.push({ message: 'Error al comunicarse con el servidor.', sender: 'bot' });
    }

    this.userMessage = '';
  }

  goBack() {
    window.history.back();
  }
}
