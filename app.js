'use strict';
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '메뉴 열기'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.nav-wrap')) closeMenu(); });

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus = false) { tabs.forEach(item => { const selected = item === tab; item.classList.toggle('active', selected); item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !selected; }); if (focus) tab.focus(); }
tabs.forEach((tab, index) => { tab.addEventListener('click', () => selectTab(tab)); tab.addEventListener('keydown', e => { let next = null; if (e.key === 'ArrowRight') next = (index + 1) % tabs.length; if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length; if (e.key === 'Home') next = 0; if (e.key === 'End') next = tabs.length - 1; if (next !== null) { e.preventDefault(); selectTab(tabs[next], true); } }); });

const cards = [
  {file:'01-cover.png', title:'표지: 반도체 회사는 다 같은 일을 할까?'},
  {file:'02-fab.png', title:'팹: 반도체를 만드는 시설'},
  {file:'03-fabless.png', title:'팹리스: 직접 설계하고 제조는 맡겨요'},
  {file:'04-foundry.png', title:'파운드리: 고객의 설계를 반도체로 만들어요'},
  {file:'05-idm.png', title:'IDM: 설계와 제조를 함께 해요'},
  {file:'06-osat.png', title:'OSAT: 패키징과 테스트를 맡아요'},
  {file:'07-summary.png', title:'핵심 요약: 이름보다 역할을 기억해요'}
];
const dialog = document.querySelector('.card-dialog');
const viewerImage = document.querySelector('#viewer-image');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
const dots = document.querySelector('.viewer-dots');
const download = document.querySelector('#card-download');
let currentCard = 0, opener = null, scrollPosition = 0;
cards.forEach((card, index) => { const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label', `${index + 1}장: ${card.title}`); button.addEventListener('click', () => showCard(index)); dots.append(button); });
function showCard(index) { currentCard = Math.max(0, Math.min(cards.length - 1, index)); const card = cards[currentCard]; viewerImage.src = `assets/${card.file}`; viewerImage.alt = `${currentCard + 1}장: ${card.title}`; download.href = `assets/${card.file}`; download.download = `YU-Silicon-Valley-${card.file}`; document.querySelector('#viewer-count').textContent = `${currentCard + 1} / ${cards.length}`; previous.disabled = currentCard === 0; next.disabled = currentCard === cards.length - 1; [...dots.children].forEach((dot, i) => { dot.classList.toggle('active', i === currentCard); dot.setAttribute('aria-current', i === currentCard ? 'true' : 'false'); }); if (currentCard + 1 < cards.length) { const image = new Image(); image.src = `assets/${cards[currentCard + 1].file}`; } }
document.querySelectorAll('[data-open-cards]').forEach(button => button.addEventListener('click', () => { opener = button; scrollPosition = window.scrollY; showCard(0); dialog.showModal(); dialog.scrollTop = 0; document.body.style.overflow = 'hidden'; document.querySelector('.viewer-close').focus(); }));
function closeViewer() { if (dialog.open) dialog.close(); }
document.querySelector('.viewer-close').addEventListener('click', closeViewer);
previous.addEventListener('click', () => showCard(currentCard - 1)); next.addEventListener('click', () => showCard(currentCard + 1));
dialog.addEventListener('close', () => { document.body.style.overflow = ''; window.scrollTo({top: scrollPosition, behavior:'instant'}); if (opener) opener.focus({preventScroll:true}); });
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeViewer(); } });
dialog.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); showCard(currentCard + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); showCard(currentCard - 1); } });
let touchStart = null;
viewerImage.addEventListener('touchstart', e => { const t = e.changedTouches[0]; touchStart = {x:t.clientX,y:t.clientY}; }, {passive:true});
viewerImage.addEventListener('touchend', e => { if (!touchStart) return; const t = e.changedTouches[0], dx=t.clientX-touchStart.x, dy=t.clientY-touchStart.y; if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.3) showCard(currentCard+(dx<0?1:-1)); touchStart=null; }, {passive:true});
