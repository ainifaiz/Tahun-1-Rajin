const emotions=[
 {name:"SERONOK",emoji:"😄",guide:"Saya berasa seronok apabila __________.",positive:true},
 {name:"GEMBIRA",emoji:"😊",guide:"Saya berasa gembira kerana __________.",positive:true},
 {name:"PUAS HATI",emoji:"😌",guide:"Saya berasa puas hati kerana __________.",positive:true},
 {name:"SEDIH",emoji:"😟",guide:"Saya berasa sedih apabila __________.",positive:false},
 {name:"KECEWA",emoji:"😢",guide:"Saya berasa kecewa kerana __________.",positive:false}
];
const positive=["Kawan membantu saya.","Kami berjaya menyiapkan tugasan.","Kami berkongsi bahan.","Semua ahli bekerjasama.","Kawan mendengar idea saya.","Saya dapat membantu kawan.","Kami menyiapkan kerja bersama-sama."];
const negative=["Ada kawan tidak mahu berkongsi.","Saya tidak mendapat giliran.","Kami belum berjaya menyiapkan tugasan.","Kami kurang bekerjasama."];
const followups=["Mengapa kamu berasa begitu?","Siapa yang membantu kamu?","Apa yang kamu suka semasa bekerjasama?","Apa yang boleh kumpulan kamu lakukan dengan lebih baik?"];
let turn=1,total=11,soundOn=true,current=0,rotation=0,spinning=false;
const $=id=>document.getElementById(id);
const screens=["mainScreen","confirmScreen","chooseScreen","sentenceScreen","finishScreen"];
function show(id){screens.forEach(s=>$(s).classList.toggle("active",s===id));}
function updateTurn(){$("turnText").textContent=turn+" / "+total;}
function renderCards(){
 $("emotionCards").innerHTML="";
 emotions.forEach((e,i)=>{
  const b=document.createElement("button");b.className="emotion-card";
  b.innerHTML="<span>"+e.emoji+"</span>"+e.name;
  b.onclick=()=>selectEmotion(i);$("emotionCards").appendChild(b);
 });
}
function softDing(){
 if(!soundOn)return;
 try{
  const ctx=new (window.AudioContext||window.webkitAudioContext)();
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type="sine";o.frequency.setValueAtTime(740,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(980,ctx.currentTime+.12);
  g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.12,ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.22);
  o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.23);
 }catch(e){}
}
function confetti(){
 const c=$("confetti");c.innerHTML="";
 const colors=["#ffd36b","#9bd4ff","#aee3a4","#f4aecf","#cbb4ef"];
 for(let i=0;i<24;i++){const p=document.createElement("i");p.style.left=(Math.random()*100)+"vw";p.style.background=colors[i%colors.length];p.style.animationDelay=(Math.random()*.25)+"s";c.appendChild(p)}
 setTimeout(()=>c.innerHTML="",1600);
}
function spin(){
 if(spinning)return;spinning=true;$("spinBtn").disabled=true;
 const chosen=Math.floor(Math.random()*emotions.length);
 const sector=72,target=360-(chosen*sector);
 const currentMod=((rotation%360)+360)%360;
 const delta=(target-currentMod+360)%360;
 rotation+=1440+delta;
 $("wheel").style.transform="rotate("+rotation+"deg)";
 setTimeout(()=>{current=chosen;softDing();showConfirm();spinning=false;$("spinBtn").disabled=false},3650);
}
function showConfirm(){
 const e=emotions[current];$("bigEmoji").textContent=e.emoji;$("pickedName").textContent=e.name;show("confirmScreen");
}
function selectEmotion(i){
 current=i;const e=emotions[i];
 $("sentenceEmoji").textContent=e.emoji;$("sentenceTitle").textContent="SAYA BERASA "+e.name;
 $("sentenceGuide").textContent="“"+e.guide+"”";
 const list=e.positive?positive:negative;$("examples").innerHTML="";
 list.slice(0,e.positive?5:4).forEach(t=>{const s=document.createElement("span");s.className="example";s.textContent=t;$("examples").appendChild(s)});
 $("followupText").textContent=followups[Math.floor(Math.random()*followups.length)];
 show("sentenceScreen");confetti();
}
function nextStudent(){
 if(turn>=total){show("finishScreen");confetti();softDing();return}
 turn++;updateTurn();show("mainScreen");
}
function resetAll(){turn=1;rotation=0;current=0;spinning=false;updateTurn();$("wheel").style.transform="rotate(0deg)";show("mainScreen");}
$("spinBtn").onclick=spin;
$("chooseBtn").onclick=()=>show("chooseScreen");
$("resetBtn").onclick=resetAll;
$("yesBtn").onclick=()=>selectEmotion(current);
$("otherBtn").onclick=()=>show("chooseScreen");
$("backBtn").onclick=()=>show("mainScreen");
$("nextBtn").onclick=nextStudent;
$("playAgainBtn").onclick=resetAll;
$("soundBtn").onclick=()=>{
 soundOn=!soundOn;$("soundBtn").textContent=soundOn?"🔊 BUNYI ON":"🔇 BUNYI OFF";$("soundBtn").setAttribute("aria-pressed",String(soundOn));
 if(soundOn)softDing();
};
renderCards();updateTurn();
