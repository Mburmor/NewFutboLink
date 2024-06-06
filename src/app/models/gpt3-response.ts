export interface GPT3Response {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      text: string;
      index: number;
      logprobs: any;
      finish_reason: string;
    }>;
  }
  