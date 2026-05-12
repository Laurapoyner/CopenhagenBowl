const API_KEY = 'tqhpfyvy9cz9ebr05mftilz2rlysynjr';
const BASE_URL = 'https://manage.sportapp.io/api/sportapp/v1/public';

export async function onRequest(context) {
  try {
    const response = await fetch(`${BASE_URL}/tournaments?apikey=${API_KEY}`);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tournaments', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
