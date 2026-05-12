const API_KEY = 'tqhpfyvy9cz9ebr05mftilz2rlysynjr';
const BASE_URL = 'https://manage.sportapp.io/api/sportapp/v1/public';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Route requests based on path
  if (path.includes('/tournaments')) {
    return handleTournaments();
  } else if (path.includes('/matches')) {
    const tournament = url.searchParams.get('tournament');
    return handleMatches(tournament);
  } else if (path.includes('/standings')) {
    const tournament = url.searchParams.get('tournament');
    return handleStandings(tournament);
  }

  return new Response('Not Found', { status: 404 });
}

async function handleTournaments() {
  try {
    const response = await fetch(`${BASE_URL}/tournaments?apikey=${API_KEY}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `API error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

async function handleMatches(tournament) {
  try {
    const response = await fetch(`${BASE_URL}/matches?tournament=${tournament}&apikey=${API_KEY}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `API error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

async function handleStandings(tournament) {
  try {
    const response = await fetch(`${BASE_URL}/standings?tournament=${tournament}&apikey=${API_KEY}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `API error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
