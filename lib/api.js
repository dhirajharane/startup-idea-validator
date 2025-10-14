export async function generateReport(startupIdea) {
  const response = await fetch('/api/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ startupIdea }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate report');
  }

  return response.json();
}