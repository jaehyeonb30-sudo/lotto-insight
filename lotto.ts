export type Draw={number:number;date:string;balls:number[];bonus:number};
const endpoint='https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';
export async function getDraw(n:number):Promise<Draw|null>{
 if(!Number.isInteger(n)||n<1||n>3000)return null;
 try{const r=await fetch(endpoint+n,{next:{revalidate:86400},signal:AbortSignal.timeout(7000),headers:{'User-Agent':'Mozilla/5.0'}});if(!r.ok)return null;
 const d=await r.json();if(d.returnValue!=='success')return null;
 const balls=[1,2,3,4,5,6].map(i=>Number(d['drwtNo'+i]));const bonus=Number(d.bnusNo);
 if(balls.some(v=>!Number.isInteger(v)||v<1||v>45)||new Set(balls).size!==6||!Number.isInteger(bonus)||bonus<1||bonus>45||balls.includes(bonus))return null;
 return {number:n,date:String(d.drwNoDate),balls,bonus};
 }catch{return null;}
}
export function approximateLatest(){const first=Date.UTC(2002,11,7),now=Date.now();return Math.max(1,Math.floor((now-first)/(7*86400000))+1)}
export async function getRecent(count=20){const approx=approximateLatest();const candidates=Array.from({length:count+5},(_,i)=>approx+2-i).filter(n=>n>0);const result:Draw[]=[];
 // Bounded parallel retrieval; provider can throttle or change its API.
 for(let i=0;i<candidates.length;i+=8){const batch=await Promise.all(candidates.slice(i,i+8).map(getDraw));result.push(...batch.filter((d):d is Draw=>d!==null));if(result.length>=count)break;}
 return result.sort((a,b)=>b.number-a.number).slice(0,count);
}
