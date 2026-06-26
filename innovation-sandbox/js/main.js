/* ============================================================
   Innovation Sandbox — V-MIC | main.js  (Static / GitHub Pages)
   ============================================================ */

/* ---- ตั้ง active menu จาก data-page ของ <body> ---- */
(function(){
  var cur = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav-link-pill').forEach(function(a){
    a.classList.toggle('active', a.getAttribute('data-page') === cur);
  });
})();

/* ---- ซ่อน Loading Spinner เมื่อโหลดเสร็จ ---- */
window.addEventListener('load', function(){
  setTimeout(function(){
    var ov = document.getElementById('loadingOverlay');
    if(!ov) return;
    ov.style.opacity = '0';
    setTimeout(function(){ ov.style.display = 'none'; }, 400);
  }, 400);
});

/* ---- Reveal on scroll ---- */
(function(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();

/* ---- ปุ่มกลับขึ้นบน ---- */
window.addEventListener('scroll', function(){
  var top = document.getElementById('toTop');
  if(top) top.style.display = window.scrollY > 400 ? 'grid' : 'none';
});

/* ---- ตัวนับสะสม ผ่าน Supabase ---- */
var sb = null;
(function(){
  try{
    if(window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY
       && SUPABASE_URL.indexOf('YOUR-') === -1){
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }catch(e){ sb = null; }
})();
function sbReady(){ return !!sb; }
function fmt(n){ return Number(n||0).toLocaleString('th-TH'); }
function setVisits(n){ var el=document.getElementById('visitCount'); if(el) el.textContent=fmt(n); }
function updateCount(key,n){ var el=document.getElementById('cnt-'+key); if(el) el.textContent=fmt(n); }

function incr(key){
  if(!sbReady()) return Promise.resolve(null);
  return sb.rpc('increment_counter', { counter_key: key }).then(function(r){
    return r.error ? null : r.data;
  });
}
function loadCounts(){
  if(!sbReady()) return Promise.resolve({});
  return sb.from('counters').select('key,count').then(function(r){
    var m={}; if(!r.error && r.data){ r.data.forEach(function(row){ m[row.key]=row.count; }); }
    return m;
  });
}

/* เรียกตอนโหลดหน้า: นับผู้เข้าชม 1 ครั้งต่อผู้ใช้ + แสดงยอด */
(function(){
  if(!sbReady()) return;
  var page = document.body.getAttribute('data-page');

  var visited=false;
  try{ visited = localStorage.getItem('vmic_visited')==='1'; }catch(e){}

  if(!visited){
    try{ localStorage.setItem('vmic_visited','1'); }catch(e){}
    incr('visits').then(function(n){ if(n!=null) setVisits(n); });   // ผู้ใช้ใหม่: +1
  } else if(page==='home'){
    loadCounts().then(function(m){ setVisits(m['visits']||0); });    // ผู้ใช้เดิม: แสดงยอด
  }

  if(page==='forms'){
    loadCounts().then(function(c){
      updateCount('proposal', c['dl_proposal']||0);
      updateCount('budget',   c['dl_budget']||0);
      updateCount('ppt',      c['dl_ppt']||0);
      updateCount('vpc',      c['dl_vpc']||0);
    });
  }
})();

/* ---- มาสคอต + ป็อปอัปแจ้งเตือนดาวน์โหลด ---- */
var DL_AVATAR =
  '<svg class="dl-avatar-svg" viewBox="0 0 170 155" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<defs>' +
  '<linearGradient id="dlc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E0F2FE"/></linearGradient>' +
  '<linearGradient id="dla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#22D3EE"/></linearGradient>' +
  '</defs>' +
  '<g fill="#FBBF24">' +
  '<path class="spark" d="M24 34 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"/>' +
  '<path class="spark s2" d="M140 50 l2.6 6 6 2.6 -6 2.6 -2.6 6 -2.6 -6 -6 -2.6 6 -2.6z"/>' +
  '<path class="spark s3" d="M134 104 l2.6 6 6 2.6 -6 2.6 -2.6 6 -2.6 -6 -6 -2.6 6 -2.6z"/>' +
  '</g>' +
  '<g transform="translate(34,30)">' +
  '<path d="M28 52a18 18 0 0 1 1-35 24 24 0 0 1 46 6 16 16 0 0 1 17 29Z" fill="url(#dlc)" stroke="#BAE6FD" stroke-width="3"/>' +
  '</g>' +
  '<circle cx="74" cy="68" r="3.8" fill="#0C4A6E"/>' +
  '<circle cx="94" cy="68" r="3.8" fill="#0C4A6E"/>' +
  '<path d="M76 77 q8 7 16 0" fill="none" stroke="#0C4A6E" stroke-width="3" stroke-linecap="round"/>' +
  '<g class="dl-arrow">' +
  '<rect x="80" y="92" width="8" height="16" rx="4" fill="url(#dla)"/>' +
  '<path d="M72 106 l12 16 12 -16 Z" fill="url(#dla)"/>' +
  '</g>' +
  '<circle cx="120" cy="50" r="15" fill="#34D399" stroke="#fff" stroke-width="3"/>' +
  '<path d="M113 50 l5 5 9 -10" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

function showDownloadPopup(title, message){
  Swal.fire({
    html: '<div class="dl-pop">' + DL_AVATAR +
          '<div class="dl-title">' + title + '</div>' +
          '<div class="dl-text">' + message + '</div></div>',
    width: 440,
    padding: '1.6rem 1.4rem 1.8rem',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: 'dl-swal' }
  });
}

/* ---- ดาวน์โหลดเอกสารทีละไฟล์ ---- */
function downloadDoc(url, key){
  triggerDownload(url);
  showDownloadPopup('เริ่มดาวน์โหลดแล้ว!', 'เอกสารของคุณกำลังถูกดาวน์โหลด 📄');
  if(key && sbReady()){
    incr('dl_'+key).then(function(n){ if(n!=null) updateCount(key, n); });
  }
}

/* ---- ดาวน์โหลดเอกสารทั้งหมด ---- */
function downloadAll(){
  var files = [
    'https://docs.google.com/document/d/1sWUasRlKTgYAUwzl79DRgi3wLlf83LAD/export?format=docx',
    'https://docs.google.com/document/d/1Tf97MT2jXE6H0ZWzwpAnD-Zoi1uru4te/export?format=docx',
    'https://docs.google.com/presentation/d/1p17N3dVfokGh7MufPe5dar7sbmvqpzyn/export/pptx',
    'https://drive.google.com/uc?export=download&id=1ROssoVo3VXL7Dc4yaXa8Imjt5LanIs1a'
  ];
  var total = files.length;
  Swal.fire({
    title:'ดาวน์โหลดเอกสารทั้งหมด?',
    html:'ระบบจะดาวน์โหลดเอกสาร <b>'+total+' ไฟล์</b><br>(แบบฟอร์มข้อเสนอ, ตารางงบประมาณ, เทมเพลตนำเสนอ, คู่มือ VPC)',
    icon:'question', showCancelButton:true,
    confirmButtonText:'<i class="fa-solid fa-download"></i> ดาวน์โหลดทั้งหมด',
    cancelButtonText:'ยกเลิก',
    confirmButtonColor:'#0EA5E9', cancelButtonColor:'#94A3B8'
  }).then(function(res){
    if(!res.isConfirmed) return;
    files.forEach(function(u,i){ setTimeout(function(){ triggerDownload(u); }, i*900); });
    showDownloadPopup('เริ่มดาวน์โหลดแล้ว!', 'กำลังดาวน์โหลดเอกสาร ' + total + ' ไฟล์');
    if(sbReady()){
      ['proposal','budget','ppt','vpc'].forEach(function(key){
        incr('dl_'+key).then(function(n){ if(n!=null) updateCount(key, n); });
      });
    }
  });
}

/* ---- ฟังก์ชันช่วยดาวน์โหลดผ่าน iframe (ไม่เปลี่ยนหน้า) ---- */
function triggerDownload(url){
  var f = document.createElement('iframe');
  f.style.display = 'none';
  f.src = url;
  document.body.appendChild(f);
  setTimeout(function(){ document.body.removeChild(f); }, 12000);
}

/* ---- นาฬิกาวันที่–เวลาเรียลไทม์ (ภาษาไทย พ.ศ.) ---- */
function updateClock(){
  var el = document.getElementById('clockText');
  if(!el) return;
  var now = new Date();
  var d = now.toLocaleDateString('th-TH', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  var t = now.toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  el.textContent = d + ' · ' + t + ' น.';
}
updateClock();
setInterval(updateClock, 1000);
