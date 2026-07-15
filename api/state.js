import { kv } from '@vercel/kv';

export default async function handler(req,res){
  const room = req.query.room || 'default';

  if(req.method==='GET'){
    const data = await kv.get(room);
    return res.json(data || {players:[],round:0,totalRounds:4,title:'🏆 Beyblade X 瑞士制',bgUrl:''});
  }

  if(req.method==='POST'){
    await kv.set(room,req.body);
    return res.json({ok:true});
  }
}