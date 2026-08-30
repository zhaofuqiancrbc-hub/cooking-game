const app=document.querySelector('#app');
const flow=[
 ['取番茄','把食材区的番茄拖到菜板上','tomato','board','番茄放好了'],
 ['切番茄','把菜刀拖到菜板上的番茄上','knife','board','正在切成小块……'],
 ['打鸡蛋','把鸡蛋拖到白瓷碗上','egg','bowl','咔嚌，鸡蛋打开了'],
 ['搅拌蛋液','点击筷子，自动搅拌鸡蛋','chopsticks','bowl','筷子正在搅拌……'],
 ['鸡蛋调味','把盐罐拖到蛋液碗上','salt','bowl','正在撒盐……'],
 ['开火','点击炉火开关','fire','stove','炉火已打开'],
 ['倒油','把食用油拖到炒锅里','oil','pan','正在倒油……'],
 ['先炒鸡蛋','把蛋液碗拖进锅里','eggBowl','pan','鸡蛋下锅了'],
 ['加入番茄','把番茄小块拖进锅里','tomatoBits','pan','番茄小块下锅了'],
 ['翻炒','点击锅铲，自动翻炒','spatula','pan','正在翻炒……'],
 ['装盘','把白瓷盘拖到炒锅旁','plate','pan','正在装盘……']
];
const names={tomato:'新鲜番茄',knife:'菜刀',egg:'鸡蛋',chopsticks:'筷子',salt:'盐',oil:'食用油',eggBowl:'蛋液',tomatoBits:'番茄小块',spatula:'锅铲',plate:'白瓷盘'};
let scene='order',step=0,busy=false,note='';
const header=()=>`<header><div class="logo"><b>小小厨神</b><small>真实厨房</small></div><button class="reset" data-reset>↻ <span>重新开始</span></button></header>`;
const item=(kind,active=false)=>`<button class="item ${kind} ${active?'active':''}" ${active?'draggable="true" data-use="'+kind+'"':''} aria-label="${names[kind]||kind}"><i></i><span>${names[kind]||''}</span></button>`;
function available(s){if(s<2)return['tomato','knife'];if(s<5)return['egg','chopsticks','salt'];if(s<7)return['oil','eggBowl'];if(s===7)return['eggBowl','tomatoBits'];if(s===8)return['tomatoBits','spatula'];if(s===9)return['spatula','plate'];return['plate']}
function render(){
 if(scene==='order'){app.innerHTML=`<main class="restaurant">${header()}<section class="dining"><div class="customer"><div class="avatar">客人</div><div class="thought"><div class="food"></div><b>番茄炒鸡蛋</b></div><h1>新客人入座</h1><p>客人想吃这道菜</p><button class="primary" data-start>接受点单　→</button></div></section></main>`;bind();return}
 if(scene==='serve'){app.innerHTML=`<main class="restaurant">${header()}<section class="dining"><div class="customer"><div class="avatar">笑脸客人</div><div class="thought"><div class="doneMark">✓</div><b>上菜成功！</b></div><div class="food servedFood"></div><h1>客人很满意</h1><p>你完成了番茄炒鸡蛋</p><button class="primary" data-reset>再玩一次</button></div></section></main>`;bind();return}
 const c=flow[step];
 app.innerHTML=`<main class="game">${header()}<section class="taskbar"><div class="order"><div class="food"></div><span><small>客人点单</small><b>番茄炒鸡蛋</b></span></div><div class="instruction"><i>${step+1}</i><span><b>${c[0]}</b><small>${c[1]}</small></span></div><div class="progress"><span style="width:${step/11*100}%"></span></div></section><section class="kitchen"><div class="rack"><label>食材与工具</label>${available(step).map(k=>item(k,k===c[2])).join('')}</div><div class="drop board ${c[3]==='board'?'target':''}" data-drop="board">${step===1?item('tomato'):step>1?'<div class="state diced"></div>':''}</div><div class="drop bowlZone ${c[3]==='bowl'?'target':''}" data-drop="bowl">${step>=2?`<div class="state eggState ${step>=4?'stirred':''}"></div>`:''}</div><button class="fire ${step===5?'active':''}" data-fire>♨　${step===5?'点击开火':step>5?'火已开':'炉火'}</button><div class="drop panZone ${c[3]==='pan'?'target':''}" data-drop="pan">${step>=8?`<div class="state panFood ${step>=9?'mixed':''}"></div>`:''}</div>${note?`<output class="toast">${note}</output>`:''}${busy?cinema():''}<span class="tapHint">手机可直接点击发光物品</span></section><footer><span>准备食材</span><b>→</b><span>处理鸡蛋</span><b>→</b><span>烹饪装盘</span></footer></main>`;bind()
}
function cinema(){const c=flow[step];return `<div class="cinema"><div class="shot action${step}"><div class="state"></div>${c[2]!=='fire'?item(c[2]):''}<strong>${note}</strong></div></div>`}
function act(){if(busy)return;busy=true;note=flow[step][4];render();setTimeout(()=>{if(step===10)scene='serve';else step++;busy=false;note='';render()},[1,3,7,9,10].includes(step)?2200:1200)}
function wrong(){note='放错位置了，看看上方提示';render();setTimeout(()=>{note='';render()},1100)}
function bind(){
 document.querySelectorAll('[data-reset]').forEach(x=>x.onclick=()=>{scene='order';step=0;busy=false;note='';render()});
 const start=document.querySelector('[data-start]');if(start)start.onclick=()=>{scene='kitchen';render()};
 document.querySelectorAll('[data-use]').forEach(x=>{x.onclick=()=>act();x.ondragstart=e=>e.dataTransfer.setData('kind',x.dataset.use)});
 document.querySelectorAll('[data-drop]').forEach(x=>{x.ondragover=e=>e.preventDefault();x.ondrop=e=>{e.preventDefault();e.dataTransfer.getData('kind')===flow[step][2]&&x.dataset.drop===flow[step][3]?act():wrong()}});
 const fire=document.querySelector('[data-fire]');if(fire)fire.onclick=()=>step===5&&act();
}
render();
