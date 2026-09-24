import { AiGuideRequest, AiGuideResponse } from '../types/aiGuide';
import { generateExpertGuidance } from '../utils/aiGuideExpertEngine';

export async function askAiGuide(request: AiGuideRequest): Promise<AiGuideResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

    const res = await fetch('/api/ai-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data: AiGuideResponse = await res.json();
      return data;
    }
  } catch {
    // Network failure or server timeout -> fallback to local expert engine
  }

  // Graceful local expert fallback
  return generateExpertGuidance(request.message, request.contextPage);
}
