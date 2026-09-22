const questions = [
  {word:"TIMER", clue:"What do we set to control the charging duration?", category:"ChargeCut Basics", options:["TIMER","BATTERY","SOCKET","ADAPTER"]},
  {word:"DISCONNECT", clue:"What happens when the timer reaches zero?", category:"How It Works", options:["Disconnect","Recharge","Restart","Increase"]},
  {word:"OVERCHARGING", clue:"What does ChargeCut help prevent?", category:"Safety", options:["Overcharging","Overheating","Low Signal","Slow Internet"]},
  {word:"SAFETY", clue:"What is the main purpose of ChargeCut?", category:"Product Purpose", options:["Safety","Gaming","Lighting","Storage"]},
  {word:"INCREASE", clue:"Which button can be used to add more time?", category:"Controls", options:["Increase","Decrease","Reset","Power"]},
  {word:"DECREASE", clue:"Which button can be used to reduce the time?", category:"Controls", options:["Decrease","Increase","Start","Save"]},
  {word:"749", clue:"Can you crack our product prize? 30 × 25 + 50 − 51", category:"Challenge", options:["749","7490","739","759"]},
  {word:"29", clue:"Can you guess the discount? It's the founder of Freshworks' birth date.", category:"Challenge", options:["29","19","25","30"]},
  {word:"JUNE 7, 2017", clue:"On what date was Freshworks renamed from Freshdesk?", category:"Freshworks Challenge", options:["June 7, 2017","June 7, 2016","July 7, 2017","June 17, 2017"]}
];

let current = 0, revealed = 0, correctAnswers = 0, selected = null, locked = false;
const tiles = document.getElementById("tiles");
for(let i=0;i<9;i++){ const t=document.createElement("div"); t.className="tile"; tiles.appendChild(t); }

function render(){
  const q=questions[current];
  document.getElementById("qNo").textContent=current+1;
  document.getElementById("title").textContent="Crack the clue.";
  document.getElementById("clue").textContent=q.clue;
  document.getElementById("category").textContent=q.category;
  document.getElementById("status").textContent="";
  document.getElementById("status").className="status";
  selected=null; locked=false;
  const box=document.getElementById("options"); box.innerHTML="";
  const shuffledOptions = [...q.options].sort(()=>Math.random()-0.5);
  shuffledOptions.forEach((option,i)=>{
    const b=document.createElement("button");
    b.className="option"; b.dataset.value=option;
    b.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span>${option}</span>`;
    b.onclick=()=>selectOption(b,option);
    box.appendChild(b);
  });
  document.getElementById("submitBtn").disabled=false;
}
function selectOption(btn,value){
  if(locked)return;
  selected=value;
  document.querySelectorAll(".option").forEach(x=>x.classList.remove("selected"));
  btn.classList.add("selected");
}
function check(){
  if(locked)return;
  if(!selected){
    const s=document.getElementById("status");
    s.textContent="Choose an option first.";
    s.className="status bad";
    return;
  }

  locked=true;
  const q=questions[current];
  const buttons=[...document.querySelectorAll(".option")];
  const isCorrect=selected.toUpperCase()===q.word.toUpperCase();

  buttons.forEach(b=>{
    b.disabled=true;
    if(b.dataset.value.toUpperCase()===q.word.toUpperCase()) b.classList.add("correct");
  });

  if(isCorrect){
    correctAnswers++;
    document.getElementById("status").textContent="Correct! Mystery tile unlocked.";
    document.getElementById("status").className="status good";
    fireBolt(true);
    revealTile();
  }else{
    const picked=buttons.find(b=>b.dataset.value===selected);
    if(picked)picked.classList.add("wrong");
    document.getElementById("status").textContent="Wrong answer — skipping this question.";
    document.getElementById("status").className="status bad";
    fireBolt(false);
  }

  // Every question is used exactly once. A wrong answer is skipped,
  // so there is no retry and it cannot reveal a tile.
  setTimeout(()=>{
    current++;
    if(current>=questions.length){
      finish();
    }else{
      render();
    }
  },850);
}
function fireBolt(isCorrect){
  const overlay=document.getElementById("boltOverlay");
  overlay.innerHTML="";
  const flash=document.createElement("div");
  flash.className="bolt-flash "+(isCorrect?"correct":"wrong");
  overlay.appendChild(flash);
  const svgNS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(svgNS,"svg");
  svg.setAttribute("viewBox","0 0 100 140");
  svg.classList.add("bolt-svg", isCorrect?"correct":"wrong");
  const path=document.createElementNS(svgNS,"path");
  path.setAttribute("class","bolt-shape");
  path.setAttribute("d","M62 4 L18 76 H46 L36 136 L86 56 H56 Z");
  path.setAttribute("fill","currentColor");
  svg.appendChild(path);
  overlay.appendChild(svg);
  overlay.classList.add("active");
  clearTimeout(overlay._t);
  overlay._t=setTimeout(()=>{overlay.classList.remove("active"); overlay.innerHTML="";},900);
}
function revealTile(){
  if(revealed>=9)return;
  const tile=tiles.children[revealed];
  tile.classList.add("revealed"); revealed++;
  document.getElementById("progressText").textContent=`${revealed} / 9`;
  document.getElementById("progressBar").style.width=(revealed/9*100)+"%";
  sparkle();
}
function sparkle(){
  for(let i=0;i<10;i++){
    const s=document.createElement("span"); s.className="confetti";
    s.style.left=(45+Math.random()*10)+"%";
    s.style.setProperty("--x",(Math.random()*260-130)+"px");
    s.style.animationDuration=(.7+Math.random()*.8)+"s";
    s.style.background=Math.random()>.5?"#ffe500":"#fff";
    document.body.appendChild(s); setTimeout(()=>s.remove(),1700);
  }
}
function calculateDiscount(price, percent){
  const discountAmount = price * (percent / 100);
  const finalPrice = price - discountAmount;
  return {
    price,
    percent,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100
  };
}
function finish(){
  const originalPrice = 749; // the product price cracked in Question 7

  // Full score = 20% discount. Each correct answer earns an equal share.
  // Wrong answers are skipped and contribute 0% to the final discount.
  const maxDiscount = 20;
  const discountPercent = Math.round((correctAnswers / questions.length) * maxDiscount);
  const result = calculateDiscount(originalPrice, discountPercent);

  document.getElementById("finalText").innerHTML =
    `Quiz complete! You got <strong>${correctAnswers}/${questions.length}</strong> correct.<br>` +
    `${questions.length - correctAnswers} question(s) were skipped because of wrong answers.<br><br>` +
    `🎉 Your final reward is a <strong>${result.percent}% discount</strong>:<br>` +
    `Original Price: ₹${result.price.toFixed(2)}<br>` +
    `Discount (${result.percent}%): −₹${result.discountAmount.toFixed(2)}<br>` +
    `<strong>Final Price: ₹${result.finalPrice.toFixed(2)}</strong>`;

  document.getElementById("overlay").classList.add("show");
  for(let i=0;i<55;i++) setTimeout(sparkle,i*18);
}
document.getElementById("submitBtn").onclick=check;
document.addEventListener("keydown",e=>{if(e.key==="Enter")check()});
render();
