export default async function handler(req, res) {
  const room = req.query.room || 'default';

  const URL = process.env.UPSTASH_REDIS_REST_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 沒有環境變數就直接回報
  if (!URL || !TOKEN) {
    return res.status(500).json({
      error: 'Redis env not found',
      hasUrl: !!URL,
      hasToken: !!TOKEN
    });
  }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${URL}/get/${room}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const data = await r.json();

      // Upstash GET回來可能是null或字串
      let value = {players:[],round:0,totalRounds:4,title:'🏆 Beyblade X 瑞士制',bgUrl:''};
      if (data.result) {
        try {
          value = JSON.parse(data.result);
        } catch (e) {
          console.log('JSON parse fail:', data.result);
        }
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
    return res.status(500).json({error: e.message, stack: e.stack});
  }
}
