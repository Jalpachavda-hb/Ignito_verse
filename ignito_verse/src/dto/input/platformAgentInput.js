/**
 * INPUT PARAMETER DTO: PlatformAgentInputParameter
 * Schema for ignitoCaptiq Platform AI Agent API (`Captiq`)
 * Endpoint: POST /api/IgnitoAI/platform-agent
 */

export function buildPlatformAgentInput(query, options = {}) {
  const {
    currentPageUrl = typeof window !== 'undefined' ? (window.location.pathname + window.location.hash || 'Home') : 'Home',
    userRole = 'Guest',
    studentId = 0,
    conversationHistory = []
  } = options;

  // Format conversationHistory items to ensure schema compliance: { role: 'user' | 'assistant', content: string }
  const sanitizedHistory = Array.isArray(conversationHistory)
    ? conversationHistory.slice(-10).map((item) => ({
        role: item.role === 'assistant' || item.sender === 'bot' ? 'assistant' : 'user',
        content: String(item.content || item.text || '').trim()
      })).filter((item) => item.content.length > 0)
    : [];

  return {
    query: String(query || '').trim(),
    currentPageUrl: currentPageUrl || 'Home',
    userRole: userRole || 'Guest',
    studentId: Number(studentId) || 0,
    conversationHistory: sanitizedHistory
  };
}
