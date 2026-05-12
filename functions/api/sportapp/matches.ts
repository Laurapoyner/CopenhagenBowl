const API_KEY = 'tqhpfyvy9cz9ebr05mftilz2rlysynjr';
const BASE_URL = 'https://manage.sportapp.io/api/sportapp/v1/public';

export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const tournament = searchParams.get('tournament');
  
  if (!tournament) {
    return new Response(JSON.stringify({ error: 'Missing tournament ID' }), { status: 400 });
  }

  try {
    const url = `${BASE_URL}/matches?tournament=${tournament}&apikey=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: `API error: ${response.status}`, details: text }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal fetch failed', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
