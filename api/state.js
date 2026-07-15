export default async function handler(req, res) {
  const room = req.query.room || 'default';

  const URL = process.env.UPSTASH_REDIS_REST_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!URL || !TOKEN) {
    return res.status(500).json({error: 'Redis env not found'});
  }

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${URL}/get/${room}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const data = await r.json();
      // Upstash回傳是string，要自己JSON.parse
      const value = data.result ? JSON.parse(data.result) : {players:[],round:0,totalRounds:4,title:'🏆 Beyblade X 瑞士制',bgUrl:''};
      return res.json(value);
    } catch (e) {
      return res.status(500).json({error: e.message});
    }
  }

  if (req.method === 'POST') {
    try {
      await fetch(`${URL}/set/${room}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });
      return res.json({ok:true});
    } catch (e) {
      return res.status(500).json({error: e.message});
    }
  }
}
