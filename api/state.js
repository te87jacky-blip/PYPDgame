export default async function handler(req, res) {
  const room = req.query.room || 'default';

  const URL = process.env.UPSTASH_REDIS_REST_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!URL ||!TOKEN) {
    return res.status(500).json({error: 'Redis env not found'});
  }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${URL}/get/${room}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const data = await r.json();
      let value = {players:[],round:0,totalRounds:4,title:'🏆 Beyblade X 瑞士制',bgUrl:''};
      if (data.result) {
        try { value = JSON.parse(data.result); } catch(e){}
      }
      return res.status(200).json(value);
    }

    if (req.method === 'POST') {
      const body = JSON.stringify(req.body);
      const r = await fetch(`${URL}/set/${room}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: body
      });
      const data = await r.json();
      return res.status(200).json({ok: true, upstash: data});
    }
    return res.status(405).json({error: 'Method not allowed'});
  } catch (e) {
    return res.status(500).json({error: e.message});
  }
}
