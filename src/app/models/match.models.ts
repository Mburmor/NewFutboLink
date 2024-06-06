export interface Match {
  id: string;
  location: string;
  time: Date;
  type: '5v5' | '7v7' | '11v11';
  players: string[];
  maxPlayers: number;
  createdBy: string;
  creatorName?: string;
  invitedPlayers?: string[];
  isPrivate?: boolean; // Añadimos el campo para indicar si el partido es privado
  password?: string; // Añadimos el campo para la contraseña del partido privado
}
