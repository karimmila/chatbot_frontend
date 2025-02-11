const API_BASE_URL = 'https://chatbot-backend1-hag9a7ebe0c2fqgz.centralus-01.azurewebsites.net';

export interface ChatRequest {
  input: {
    query: string;
  };
}

export interface ChatResponse {
  output: {
    result: string;
  };
  metadata: {
    run_id: string;
    feedback_tokens: string[];
  };
}

export async function sendChatMessage(query: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/query/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        input: {
          query
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    
    if (data.output?.result) {
      return data.output.result;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
} 