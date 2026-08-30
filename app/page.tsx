'use client';
import { useState } from 'react';
import { RotateCcw, Volume2, Check, Flame } from 'lucide-react';

type Kind='tomato'|'knife'|'egg'|'chopsticks'|'salt'|'oil'|'eggBowl'|'tomatoBits'|'spatula'|'plate';
const flow=[
  ['取番茄','把食材区的番茄拖到菜板上','tomato','board'],
  ['切番茄','把菜刀拖到菜板上的番茄上','knife','board'],
  ['打鸡蛋','把鸡蛋拖到白瓷碗上','egg','bowl'],
  ['搅拌蛋液','点击筷子，自动搅拌鸡蛋','chopsticks','bowl'],
  ['鸡蛋调味','把盐罐拖到蛋液碗上','salt','bowl'],
  ['开火','点击炉火开关','fire','stove'],
  ['倒油','把食用油拖到炒锅里','oil','pan'],
  ['先炒鸡蛋','把蛋液碗拖进锅里','eggBowl','pan'],
  ['加入番茄','把番茄小块拖进锅里','tomatoBits','pan'],
  ['翻炒','点击锅铲，自动翻炒','spatula','pan'],
  ['装盘','把白瓷盘拖到炒锅旁','plate','pan'],
] as const;
const labels:Record<string,string>={tomato:'新鲜番茄',knife:'菜刀',egg:'鸡蛋',chopsticks:'筷子',salt:'盐',oil:'食用油',eggBowl:'蛋液',tomatoBits:'番茄小块',spatula:'锅铲',plate:'白瓷盘'};

export default function Home(){
 const [scene,setScene]=useState<'order'|'kitchen'|'serve'>('order');
 const [step,setStep]=useState(0); const [busy,setBusy]=useState(false); const [note,setNote]=useState('');
 const current=flow[Math.min(step,10)];
 const run=()=>{ if(busy)return; setBusy(true); const msgs=['番茄放好了','正在切成小块……','咔嚌，鸡蛋打开了','筷子正在搅拌……','正在撒盐……','炉火已打开','正在倒油……','鸡蛋下锅了','番茄小块下锅了','正在翻炒……','正在装盘……']; setNote(msgs[step]);
   setTimeout(()=>{ if(step===10){setScene('serve')}else setStep(step+1); setBusy(false);setNote('')},[1,3,7,9,10].includes(step)?2200:1300)};
 const drop=(e:React.DragEvent,target:string)=>{e.preventDefault(); if(e.dataTransfer.getData('kind')===current[2]&&current[3]===target)run();else{setNote('放错位置了，看看上方提示');setTimeout(()=>setNote(''),1200)}};
 const reset=()=>{setScene('order');setStep(0);setBusy(false);setNote('')};
 if(scene==='order')return <main className="restaurant scene"><Top reset={reset}/><div className="dining-room"><div className="customer"><div className="face-photo"/><div className="thought"><div className="dish-photo"/><b>番茄炒鸡蛋</b></div><h1>新客人入座</h1><p>客人想吃这道菜</p><button onClick={()=>setScene('kitchen')}>接受点单　→</button></div><div className="tables"><span/><span/><span/></div></div></main>;
 if(scene==='serve')return <main className="restaurant scene"><Top reset={reset}/><div className="dining-room served"><div className="customer"><div className="face-photo happy"/><div className="thought done"><Check/><b>上菜成功！</b></div><div className="served-dish dish-photo"/><h1>客人很满意</h1><p>你完成了番茄炒鸡蛋</p><button onClick={reset}>再玩一次</button></div></div></main>;
 return <main className="scene"><Top reset={reset}/><div className="order-strip"><div className="mini-order"><div className="dish-photo"/><span><small>客人点单</small><b>番茄炒鸡蛋</b></span></div><div className="instruction"><i>{step+1}</i><span><b>{current[0]}</b><small>{current[1]}</small></span></div><div className="meter"><span style={{width:`${step/11*100}%`}}/></div></div>
 <section className="real-kitchen">
  <div className="ingredient-rack"><label>食材与工具</label>{itemsForStep(step).map(k=><Item key={k} kind={k} active={k===current[2]} onUse={run}/>)}</div>
  <div className={`drop board-drop ${current[3]==='board'?'target':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,'board')}>
   {step===1&&<Item kind="tomato" active={false}/>} {step>1&&<div className="state diced-tomato"/>}
   {busy&&step===1&&<Item kind="knife" active={false} extra="cutting"/>}
  </div>
  <div className={`drop bowl-drop ${current[3]==='bowl'?'target':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,'bowl')}>
   {step>=2&&<div className={`state egg-state s${Math.min(step,5)} ${busy?'working':''}`}/>} {busy&&step===3&&<Item kind="chopsticks" active={false} extra="stirring"/>}
  </div>
  <button className={`fire-switch ${step===5?'active':''}`} onClick={()=>step===5&&run()}><Flame/><span>{step<5?'炉火':step===5?'点击开火':'火已开'}</span></button>
  <div className={`drop pan-drop ${current[3]==='pan'?'target':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,'pan')}><div className={`state pan-food p${step} ${busy?'working':''}`}/></div>
  {note&&<output className="note">{note}</output>}
  {busy&&<div className="cinema"><div className={`action-shot action-${step}`}><div className="state action-food"/><Item kind={current[2] as Kind} active={false}/><b>{note}</b></div></div>}
 </section>
 <footer><span>准备食材</span><b>→</b><span>处理鸡蛋</span><b>→</b><span>烹饪装盘</span></footer></main>
}

function Top({reset}:{reset:()=>void}){return <header><div className="logo"><b>小小厨神</b><small>真实厨房</small></div><nav><button aria-label="声音"><Volume2/></button><button onClick={reset}><RotateCcw/><span>重新开始</span></button></nav></header>}
function Item({kind,active,onUse,extra=''}:{kind:Kind,active:boolean,onUse?:()=>void,extra?:string}){return <button draggable={active} onDragStart={e=>e.dataTransfer.setData('kind',kind)} onClick={()=>active&&onUse?.()} className={`item item-${kind} ${active?'active':''} ${extra}`} aria-label={labels[kind]}><i/><span>{labels[kind]}</span></button>}
function itemsForStep(step:number):Kind[]{if(step<2)return ['tomato','knife'];if(step<5)return ['egg','chopsticks','salt'];if(step===5)return ['oil','eggBowl'];if(step===6)return ['oil','eggBowl'];if(step===7)return ['eggBowl','tomatoBits'];if(step===8)return ['tomatoBits','spatula'];if(step===9)return ['spatula','plate'];return ['plate']}
