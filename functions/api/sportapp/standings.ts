const API_KEY = 'tqhpfyvy9cz9ebr05mftilz2rlysynjr';
const BASE_URL = 'https://manage.sportapp.io/api/sportapp/v1/public';

export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const tournament = searchParams.get('tournament');
  
  if (!tournament) {
    return new Response(JSON.stringify({ error: 'Missing tournament ID' }), { status: 400 });
  }

  try {
    const response = await fetch(`${BASE_URL}/standings?tournament=${tournament}&apikey=${API_KEY}`);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch standings' }), { status: 500 });
  }
}
