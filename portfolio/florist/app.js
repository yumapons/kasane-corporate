(()=>{'use strict';
const toggle=document.querySelector('#menu-toggle'),nav=document.querySelector('#site-nav');
if(toggle&&nav){const close=()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');};toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});}
const form=document.querySelector('#order-form');if(!form)return;
const item=form.elements.item,date=form.elements.date,review=document.querySelector('#order-review'),error=document.querySelector('#form-error'),status=document.querySelector('#review-status');
const products={small:'小さな花束 / 3,300円（税込）',standard:'季節の花束 / 5,500円（税込）',arrangement:'アレンジメント / 6,600円（税込）'};
const preset=new URLSearchParams(location.search).get('item');if(Object.hasOwn(products,preset))item.value=preset;
const localDay=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
function minDate(now=new Date()){const d=localDay(now);let count=0;while(count<3){d.setDate(d.getDate()+1);if(![2,3].includes(d.getDay()))count++;}return d;}
function iso(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}date.min=iso(minDate());
let memo='';
form.addEventListener('submit',e=>{e.preventDefault();error.textContent='';date.setCustomValidity('');if(!form.reportValidity())return;const requested=new Date(date.value+'T00:00:00');if([2,3].includes(requested.getDay())||requested<minDate()){error.textContent='受取日は、火・水曜を除く3営業日以上先の日を選んでください。';date.focus();return;}
const rows=[['商品',products[item.value]],['用途',form.elements.purpose.value],['色の希望',form.elements.color.value],['受取希望',date.value+' / '+form.elements.time.value],['伝えたいこと',form.elements.note.value.trim()||'特になし']];
const dl=document.querySelector('#review-details');dl.replaceChildren();for(const [label,value]of rows){const box=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;box.append(dt,dd);dl.append(box);}memo='花屋しおり 相談内容の控え（デモ・未送信）\n\n'+rows.map(([a,b])=>a+'：'+b).join('\n')+'\n\nこの控えでは注文・予約は成立していません。';form.hidden=true;review.hidden=false;status.textContent='';review.focus();});
document.querySelector('#edit-note').addEventListener('click',()=>{review.hidden=true;form.hidden=false;item.focus();});
document.querySelector('#save-note').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([memo],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='shiori-order-demo.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='控えの保存を開始しました。お店には送信されていません。';});
})();
