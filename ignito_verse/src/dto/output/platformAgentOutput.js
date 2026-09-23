/**
 * OUTPUT PARAMETER DTO: PlatformAgentOutputParameter
 * Schema for ignitoCaptiq Platform AI Agent API (`Captiq`)
 * Endpoint: POST /api/IgnitoAI/platform-agent
 */

export function parsePlatformAgentOutput(data, status = 200) {
  if (!data || typeof data !== 'object') {
    return {
      isSuccess: false,
      responseText: typeof data === 'string' ? data : '',
      errorMessage: 'Invalid response from Captiq AI Agent.',
      suggestedActions: []
    };
  }

  const isSuccess = Boolean(data.isSuccess ?? (status >= 200 && status < 300));
  const responseText = String(data.responseText || data.message || data.reply || data.output || '').trim();
  const errorMessage = data.errorMessage ? String(data.errorMessage) : (!isSuccess ? 'Failed to process request.' : null);

  const rawActions = Array.isArray(data.suggestedActions) ? data.suggestedActions : [];
  const suggestedActions = rawActions.map((action) => ({
    title: String(action?.title || action?.name || 'View').trim(),
    url: String(action?.url || action?.link || '').trim(),
    iconClass: String(action?.iconClass || action?.icon || '').trim()
  })).filter((act) => act.title.length > 0);

  return {
    isSuccess,
    responseText,
    errorMessage,
    suggestedActions
  };
}
