// import api from '../lib/api';

import api from "./auth.service";

export interface SupportContactInput {
  name: string;
  email: string;
  subject: 'BUG' | 'FEEDBACK' | 'HELP' | 'OTHER';
  message: string;
  clientTimestamp?: string;
}

export const supportService = {
  /**
   * Send a support/contact message
   */
  async sendContactMessage(data: SupportContactInput) {
    const response = await api.post('/support/contact', data);
    return response.data;
  }
};
