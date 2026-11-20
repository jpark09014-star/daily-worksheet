// 베타아빠 데일리 학습지 - 문제 생성기 (2022 개정 교육과정 단원 기준, 문제는 모두 직접 생성)
// 각 생성기: (r, d) => {q, a, ex, chk}  r=난수 도구, d=난이도(1 기본, 2 보통, 3 도전)
// chk: 다른 방법으로 다시 계산한 검산 결과(true여야 함)
(function (root) {
  'use strict';
  // ---------- 난수 ----------
  function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function makeR(seed) {
    const f = mulberry(seed);
    const r = {
      f,
      int: (a, b) => a + Math.floor(f() * (b - a + 1)),
      pick: (arr) => arr[Math.floor(f() * arr.length)],
      bool: (p = 0.5) => f() < p,
      shuffle: (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    };
    return r;
  }
  // ---------- 수학 도구 ----------
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const lcm = (a, b) => a / gcd(a, b) * b;
  const fmt = (n) => n.toLocaleString('en-US');
  // 소수: 정수 v를 10^s로 나눈 값을 문자열로
  function dec(v, s) { const neg = v < 0; v = Math.abs(v); let str = String(v).padStart(s + 1, '0'); let ip = str.slice(0, str.length - s), fp = s ? str.slice(str.length - s) : ''; fp = fp.replace(/0+$/, ''); return (neg ? '-' : '') + ip + (fp ? '.' + fp : ''); }
  const B = '<span class="bx"></span>';
  const F = (n, d) => `<span class="fr"><i>${n}</i><i>${d}</i></span>`;
  // 분수 표기: 기약분수, 가분수면 대분수(mixed=true일 때)
  function frac(n, d, mixed = true) {
    const g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return String(n);
    if (mixed && n > d) { const w = Math.floor(n / d), m = n % d; return `${w}${F(m, d)}`; }
    return F(n, d);
  }
  const fracTxt = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
  function josa(w, a, b) { const c = w.charCodeAt(w.length - 1); if (c < 0xAC00 || c > 0xD7A3) return w + b; return w + (((c - 0xAC00) % 28) ? a : b); }
  const NAMES = ['민준', '지우', '하윤', '서준', '도윤', '하린', '지호', '수아', '예준', '유나', '시우', '아린', '주원', '채아'];
  const FOOD = [['사과', '개'], ['쿠키', '개'], ['딸기', '개'], ['귤', '개'], ['사탕', '개'], ['떡', '개']];
  const ITEMS = [['사과', '개'], ['연필', '자루'], ['구슬', '개'], ['색종이', '장'], ['스티커', '장'], ['쿠키', '개'], ['딸기', '개'], ['공책', '권'], ['귤', '개'], ['풍선', '개'], ['사탕', '개'], ['단추', '개']];
  const nm = (r) => r.pick(NAMES);
  const nmI = (n) => n + (((n.charCodeAt(n.length - 1) - 0xAC00) % 28) ? '이' : ''); // 민준이, 지우
  // 조사 자동 고르기: 앞 글자 받침에 따라 을/를, 이/가, 은/는, 과/와, (으)로
  const DIGIT_BAT = { 0: 1, 1: 2, 2: 0, 3: 1, 4: 0, 5: 0, 6: 1, 7: 2, 8: 2, 9: 0 }; // 0 받침없음, 1 받침, 2 ㄹ받침
  function bat(ch) { if (/[0-9]/.test(ch)) return DIGIT_BAT[ch]; const c = ch.charCodeAt(0); if (c < 0xAC00 || c > 0xD7A3) return -1; const j = (c - 0xAC00) % 28; return j === 0 ? 0 : j === 8 ? 2 : 1; }
  const PAIRS = { '을(를)': ['을', '를'], '이(가)': ['이', '가'], '은(는)': ['은', '는'], '과(와)': ['과', '와'], '이에요': ['이에요', '예요'] };
  const WORDS = ITEMS.map(x => x[0]).concat(ITEMS.map(x => x[1]));
  function fixJ(s) {
    s = s.replace(/([0-9가-힣])(을\(를\)|이\(가\)|은\(는\)|과\(와\))/g, (m, ch, p) => { const b = bat(ch); if (b < 0) return m; return ch + PAIRS[p][b ? 0 : 1]; });
    s = s.replace(/<i>\d*(\d)<\/i><i>\d+<\/i><\/span>(을\(를\)|이\(가\)|은\(는\)|과\(와\)|\(으\)로)/g, (m, ch, p) => { const b = bat(ch); const head = m.slice(0, m.length - p.length); if (p === '(으)로') return head + (b === 1 ? '으로' : '로'); return head + PAIRS[p][b ? 0 : 1]; });
    s = s.replace(/([0-9가-힣])이에요/g, (m, ch) => ch + (bat(ch) ? '이에요' : '예요'));
    s = s.replace(/([0-9가-힣])\(으\)로/g, (m, ch) => { const b = bat(ch); if (b < 0) return m; return ch + (b === 1 ? '으로' : '로'); });
    const re = new RegExp('(' + WORDS.join('|') + ')(을|를|이|가|은|는)(?![가-힣])', 'g');
    s = s.replace(re, (m, w, p) => { const b = bat(w[w.length - 1]) ? 0 : 1; const map = { '을': ['을', '를'], '를': ['을', '를'], '이': ['이', '가'], '가': ['이', '가'], '은': ['은', '는'], '는': ['은', '는'] }; return w + map[p][b]; });
    return s;
  }
  const P = (q, a, ex, chk = true, word = false) => ({ q: fixJ(q), a: String(a), ex: fixJ(ex), chk: !!chk, word });

  // 덧셈·뺄셈 받아올림 여부
  const noCarry = (a, b) => { while (a || b) { if (a % 10 + b % 10 > 9) return false; a = Math.floor(a / 10); b = Math.floor(b / 10); } return true; };
  const noBorrow = (a, b) => { while (b) { if (a % 10 < b % 10) return false; a = Math.floor(a / 10); b = Math.floor(b / 10); } return true; };
  function addPair(r, lo, hi, mode) { // mode: 'none' 받아올림 없음, 'carry' 있음, 'any'
    for (let i = 0; i < 400; i++) { const a = r.int(lo, hi), b = r.int(lo, hi); const nc = noCarry(a, b); if (mode === 'none' && !nc) continue; if (mode === 'carry' && nc) continue; return [a, b]; }
    return [lo, lo];
  }
  function subPair(r, lo, hi, mode) {
    for (let i = 0; i < 400; i++) { let a = r.int(lo, hi), b = r.int(lo, hi); if (a < b) [a, b] = [b, a]; if (a === b) continue; const nb = noBorrow(a, b); if (mode === 'none' && !nb) continue; if (mode === 'borrow' && nb) continue; return [a, b]; }
    return [hi, lo];
  }
  function seqProblem(r, d, big) {
    let start, step, len = 5, kind = d === 1 ? r.pick(['add']) : d === 2 ? r.pick(['add', 'sub']) : r.pick(['add', 'sub', 'mul', 'rep']);
    let arr = [];
    if (kind === 'add') { step = big ? r.pick([5, 10, 50, 100, 1000]) : r.pick(d === 1 ? [1, 2, 5, 10] : [2, 3, 4, 5, 10]); start = r.int(1, big ? 900 : 20); for (let i = 0; i < len; i++) arr.push(start + step * i); }
    if (kind === 'sub') { step = big ? r.pick([5, 10, 25, 100]) : r.pick([2, 3, 5, 10]); start = step * len + r.int(big ? 100 : 5, big ? 900 : 40); for (let i = 0; i < len; i++) arr.push(start - step * i); }
    if (kind === 'mul') { step = r.pick([2, 3]); start = r.int(1, big ? 5 : 3); for (let i = 0; i < len; i++) arr.push(start * Math.pow(step, i)); }
    if (kind === 'rep') { const a = r.int(1, 9), b = r.int(1, 9); const c = a + b; arr = [a, c, a + 1, c + 1, a + 2]; }
    const hide = r.int(2, len - 2);
    const ans = arr[hide];
    const shown = arr.map((v, i) => i === hide ? B : fmt(v)).join(' → ');
    const rule = kind === 'add' ? `${fmt(step)}씩 커지는 규칙이에요.` : kind === 'sub' ? `${fmt(step)}씩 작아지는 규칙이에요.` : kind === 'mul' ? `앞의 수에 ${step}을(를) 곱하는 규칙이에요.` : '두 수가 번갈아 나오며 각각 1씩 커지는 규칙이에요.';
    const ok = kind === 'add' ? arr[hide + 1] - ans === step : kind === 'sub' ? ans - arr[hide + 1] === step : kind === 'mul' ? arr[hide + 1] === ans * step : arr[hide] === arr[hide - 2] + 1;
    return P(`규칙을 찾아 ${B}에 알맞은 수를 써 보세요.<br><b class="seq">${shown}</b>`, fmt(ans), rule, ok);
  }

  // ---------- 단원별 생성기 ----------
  const G = {};
  // 1-1 9까지의 수
  G.n9 = (r, d) => {
    const k = r.pick(d === 1 ? ['next', 'prev', 'big1'] : d === 2 ? ['cmp', 'small1', 'big1', 'prev'] : ['cmp', 'between', 'word', 'small1']);
    if (k === 'small1') { const n = r.int(2, 9); return P(`${n}보다 1 작은 수는 ${B}예요.`, n - 1, `${n} 바로 앞의 수가 1 작은 수예요.`); }
    if (k === 'next') { const n = r.int(1, 8); return P(`${n} 바로 다음의 수는 ${B}예요.`, n + 1, `수를 셀 때 ${n} 다음에 ${n + 1}이(가) 와요.`); }
    if (k === 'prev') { const n = r.int(2, 9); return P(`${n} 바로 앞의 수는 ${B}예요.`, n - 1, `${n - 1} 다음 수가 ${n}이에요.`); }
    if (k === 'big1') { const n = r.int(1, 8); return P(`${n}보다 1 큰 수는 ${B}예요.`, n + 1, `${n} 다음 수가 1 큰 수예요.`); }
    if (k === 'between') { const n = r.int(1, 7); return P(`${n}과(와) ${n + 2} 사이에 있는 수는 ${B}예요.`, n + 1, `${n}, ${n + 1}, ${n + 2} 순서로 세어요.`); }
    if (k === 'word') { const it = r.pick(ITEMS), n = nm(r), a = r.int(1, 8); return P(`${nmI(n)}는 ${it[0]} ${a}${it[1]}를 가지고 있어요. 1${it[1]}를 더 받으면 모두 몇 ${it[1]}일까요?`, `${a + 1}${it[1]}`, `${a}보다 1 큰 수는 ${a + 1}이에요.`, true, true); }
    let a = r.int(1, 9), b = r.int(1, 9); while (b === a) b = r.int(1, 9);
    return P(`${a}과(와) ${b} 중에서 더 큰 수는 ${B}예요.`, Math.max(a, b), `수를 셀 때 뒤에 나오는 수가 더 커요.`, Math.max(a, b) === (a > b ? a : b));
  };
  // 1-1 덧셈과 뺄셈 (9 이하)
  G.as9 = (r, d) => {
    const k = r.pick(d === 1 ? ['add', 'gather'] : d === 2 ? ['add', 'sub', 'split'] : ['sub', 'split', 'word', 'boxadd']);
    if (k === 'add') { const a = r.int(1, 8), b = r.int(1, 9 - a); return P(`${a} + ${b} = ${B}`, a + b, `${a}에서 ${b}만큼 이어 세면 ${a + b}이에요.`, a + b <= 9); }
    if (k === 'gather') { const a = r.int(1, 8), b = r.int(1, 9 - a); return P(`${a}과(와) ${b}를 모으면 ${B}이에요.`, a + b, `${a} + ${b} = ${a + b}`); }
    if (k === 'sub') { const a = r.int(2, 9), b = r.int(1, a); return P(`${a} - ${b} = ${B}`, a - b, `${a}에서 ${b}만큼 거꾸로 세면 ${a - b}이에요.`, (a - b) + b === a); }
    if (k === 'split') { const n = r.int(3, 9), a = r.int(1, n - 1); return P(`${n}은(는) ${a}과(와) ${B}(으)로 가를 수 있어요.`, n - a, `${a} + ${n - a} = ${n}`, a + (n - a) === n); }
    if (k === 'boxadd') { const a = r.int(1, 7), s = r.int(a + 1, 9); return P(`${a} + ${B} = ${s}`, s - a, `${s} - ${a} = ${s - a}`, a + (s - a) === s); }
    const it = r.pick(FOOD), n = nm(r), a = r.int(4, 9), b = r.int(1, a - 1);
    return P(`${nmI(n)}는 ${it[0]} ${a}${it[1]} 중에서 ${b}${it[1]}를 먹었어요. 남은 ${it[0]}는 몇 ${it[1]}일까요?`, `${a - b}${it[1]}`, `${a} - ${b} = ${a - b}`, true, true);
  };
  // 1-1 50까지의 수
  G.n50 = (r, d) => {
    const k = r.pick(d === 1 ? ['tens', 'bundle'] : d === 2 ? ['bundle', 'split', 'next'] : ['split', 'cmp', 'between']);
    if (k === 'tens') { const t = r.int(1, 5); return P(`10개씩 묶음 ${t}개는 ${B}이에요.`, t * 10, `10이 ${t}개면 ${t * 10}이에요.`); }
    if (k === 'bundle') { const t = r.int(1, 4), o = r.int(1, 9); return P(`10개씩 묶음 ${t}개와 낱개 ${o}개는 ${B}이에요.`, t * 10 + o, `${t * 10}과(와) ${o}을(를) 합하면 ${t * 10 + o}이에요.`); }
    if (k === 'split') { const n = r.int(11, 49); return P(`${n}은(는) 10개씩 묶음 ${B}개와 낱개 ${n % 10}개예요.`, Math.floor(n / 10), `${n}의 십의 자리 숫자가 묶음의 수예요.`, Math.floor(n / 10) * 10 + n % 10 === n); }
    if (k === 'next') { const n = r.int(10, 49); return P(`${n} 바로 다음의 수는 ${B}예요.`, n + 1, `${n}보다 1 큰 수예요.`); }
    if (k === 'between') { const n = r.int(10, 47); return P(`${n}과(와) ${n + 2} 사이에 있는 수는 ${B}예요.`, n + 1, `${n} 다음 수예요.`); }
    let a = r.int(10, 50), b = r.int(10, 50); while (a === b) b = r.int(10, 50);
    return P(`${a}과(와) ${b} 중에서 더 큰 수는 ${B}예요.`, Math.max(a, b), `10개씩 묶음의 수를 먼저 비교해요.`);
  };
  // 1-2 100까지의 수
  G.n100 = (r, d) => {
    const k = r.pick(d === 1 ? ['tens', 'bundle'] : d === 2 ? ['bundle', 'cmp', 'evenodd'] : ['cmp', 'evenodd', 'next10']);
    if (k === 'tens') { const t = r.int(6, 9); return P(`10개씩 묶음 ${t}개는 ${B}이에요.`, t * 10, `10이 ${t}개면 ${t * 10}이에요.`); }
    if (k === 'bundle') { const t = r.int(5, 9), o = r.int(1, 9); return P(`10개씩 묶음 ${t}개와 낱개 ${o}개는 ${B}이에요.`, t * 10 + o, `${t * 10}과(와) ${o}을(를) 합해요.`); }
    if (k === 'evenodd') { const n = r.int(2, 30); const ev = n % 2 === 0; return P(`${n}은(는) 짝수일까요, 홀수일까요?`, ev ? '짝수' : '홀수', `둘씩 짝을 지어 남는 것이 ${ev ? '없으면 짝수' : '있으면 홀수'}예요.`, (n % 2 === 0) === ev); }
    if (k === 'next10') { const n = r.int(50, 89); return P(`${n}보다 10 큰 수는 ${B}이에요.`, n + 10, `10개씩 묶음이 하나 늘어요.`); }
    let a = r.int(50, 99), b = r.int(50, 99); while (a === b) b = r.int(50, 99);
    return P(`${a}과(와) ${b} 중에서 더 작은 수는 ${B}예요.`, Math.min(a, b), `10개씩 묶음의 수를 먼저 비교해요.`);
  };
  // 1-2 덧셈과 뺄셈(1): 받아올림·내림 없음
  G.as1 = (r, d) => {
    const k = r.pick(d === 1 ? ['add1', 'sub1'] : d === 2 ? ['add2', 'sub2'] : ['add2', 'sub2', 'word']);
    if (k === 'add1') { let a, b; do { a = r.int(10, 89); b = r.int(1, 9); } while (!noCarry(a, b)); return P(`${a} + ${b} = ${B}`, a + b, `낱개끼리 더해요: ${a % 10} + ${b} = ${a % 10 + b}`, noCarry(a, b)); }
    if (k === 'sub1') { let a, b; do { a = r.int(11, 99); b = r.int(1, 9); } while (!noBorrow(a, b)); return P(`${a} - ${b} = ${B}`, a - b, `낱개끼리 빼요: ${a % 10} - ${b} = ${a % 10 - b}`, noBorrow(a, b)); }
    if (k === 'add2') { const [a, b] = addPair(r, 10, 80, 'none'); return P(`${a} + ${b} = ${B}`, a + b, `10개씩 묶음끼리, 낱개끼리 더해요.`, noCarry(a, b) && a + b < 100); }
    if (k === 'sub2') { const [a, b] = subPair(r, 10, 99, 'none'); return P(`${a} - ${b} = ${B}`, a - b, `10개씩 묶음끼리, 낱개끼리 빼요.`, noBorrow(a, b)); }
    const it = r.pick(ITEMS), n = nm(r); const [a, b] = addPair(r, 11, 45, 'none');
    return P(`${nmI(n)}는 ${it[0]} ${a}${it[1]}를 가지고 있었는데 ${b}${it[1]}를 더 받았어요. 모두 몇 ${it[1]}일까요?`, `${a + b}${it[1]}`, `${a} + ${b} = ${a + b}`, noCarry(a, b), true);
  };
  // 1-2 덧셈과 뺄셈(2): 세 수, 10 만들기
  G.as2 = (r, d) => {
    const k = r.pick(d === 1 ? ['to10', 'from10'] : d === 2 ? ['three', 'to10', 'make10'] : ['make10', 'threemix', 'from10']);
    if (k === 'to10') { const a = r.int(1, 9); return P(`${a} + ${B} = 10`, 10 - a, `${a}과(와) ${10 - a}를 모으면 10이에요.`); }
    if (k === 'from10') { const a = r.int(1, 9); return P(`10 - ${a} = ${B}`, 10 - a, `10은 ${a}과(와) ${10 - a}(으)로 가를 수 있어요.`); }
    if (k === 'three') { const a = r.int(1, 5), b = r.int(1, 9 - a - 1), c = r.int(1, 9 - a - b); return P(`${a} + ${b} + ${c} = ${B}`, a + b + c, `앞에서부터 차례로 더해요: ${a} + ${b} = ${a + b}`, a + b + c <= 9); }
    if (k === 'make10') { const a = r.int(1, 9), b = 10 - a, c = r.int(1, 9); const ord = r.bool() ? `${a} + ${b} + ${c}` : `${a} + ${c} + ${b}`; return P(`${ord} = ${B}`, 10 + c, `${a} + ${b} = 10을 먼저 만들고 ${c}을(를) 더해요.`); }
    const a = r.int(4, 9), b = r.int(1, 9 - a + 5 > 9 ? 3 : 3), c = r.int(1, a + b - 1);
    return P(`${a} + ${b} - ${c} = ${B}`, a + b - c, `앞에서부터 계산해요: ${a} + ${b} = ${a + b}, ${a + b} - ${c} = ${a + b - c}`, a + b - c >= 0 && a + b <= 12);
  };
  // 1-2 규칙 찾기(시계 보기와 규칙 찾기 중 규칙)
  G.rule1 = (r, d) => seqProblem(r, Math.min(d, 2), false);
  // 1-2 덧셈과 뺄셈(3): 받아올림 (몇)+(몇), 받아내림 (십몇)-(몇)
  G.as3 = (r, d) => {
    const k = r.pick(d === 1 ? ['add'] : d === 2 ? ['add', 'sub'] : ['sub', 'word', 'box']);
    if (k === 'add') { let a, b; do { a = r.int(2, 9); b = r.int(2, 9); } while (a + b < 11); return P(`${a} + ${b} = ${B}`, a + b, `${b}을(를) ${10 - a}과(와) ${b - (10 - a)}(으)로 갈라 10을 먼저 만들어요.`, a + b > 10 && a + b <= 18); }
    if (k === 'sub') { const a = r.int(11, 18); const b = r.int(a - 9, 9); return P(`${a} - ${b} = ${B}`, a - b, `${a}에서 ${a - 10}을(를) 먼저 빼고 10에서 나머지를 빼요.`, b > a % 10 && a - b > 0); }
    if (k === 'box') { let a, b; do { a = r.int(2, 9); b = r.int(2, 9); } while (a + b < 11); return P(`${a} + ${B} = ${a + b}`, b, `${a + b} - ${a} = ${b}`); }
    const it = r.pick(ITEMS), n = nm(r); const a = r.int(11, 18), b = r.int(a - 9, 9);
    return P(`${it[0]}가 ${a}${it[1]} 있었는데 ${nmI(n)}가 ${b}${it[1]}를 가져갔어요. 남은 ${it[0]}는 몇 ${it[1]}일까요?`, `${a - b}${it[1]}`, `${a} - ${b} = ${a - b}`, true, true);
  };
  // 2-1 세 자리 수
  G.n1000 = (r, d) => {
    const k = r.pick(d === 1 ? ['build', 'place'] : d === 2 ? ['place', 'skip', 'cmp'] : ['skip', 'cmp', 'build2']);
    const n = r.int(101, 999);
    if (k === 'build') { const a = r.int(1, 9), b = r.int(0, 9), c = r.int(0, 9); return P(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는 ${B}이에요.`, a * 100 + b * 10 + c, `${a * 100} + ${b * 10} + ${c} = ${a * 100 + b * 10 + c}`); }
    if (k === 'build2') { const a = r.int(1, 8), b = r.int(10, 19), c = r.int(0, 9); return P(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는 ${B}이에요.`, a * 100 + b * 10 + c, `10이 ${b}개는 ${b * 10}이에요. ${a * 100} + ${b * 10} + ${c} = ${a * 100 + b * 10 + c}`); }
    if (k === 'place') { const pl = r.pick([['백', 100], ['십', 10], ['일', 1]]); const dig = Math.floor(n / pl[1]) % 10; return P(`${n}에서 ${pl[0]}의 자리 숫자는 ${B}이고, ${B}을(를) 나타내요.`, `${dig}, ${dig * pl[1]}`, `${pl[0]}의 자리 숫자 ${dig}은(는) ${dig * pl[1]}을(를) 나타내요.`); }
    if (k === 'skip') { const st = r.pick([1, 10, 100]); const s = r.int(100, 999 - st * 4); const arr = [0, 1, 2, 3].map(i => s + st * i); return P(`${st}씩 뛰어 세어 보세요. ${arr[0]} - ${arr[1]} - ${arr[2]} - ${B}`, arr[3], `${st}씩 커져요: ${arr[2]} + ${st} = ${arr[3]}`); }
    let a = r.int(100, 999), b = r.int(100, 999); while (a === b) b = r.int(100, 999);
    return P(`${a}과(와) ${b} 중에서 더 큰 수는 ${B}예요.`, Math.max(a, b), `백의 자리부터 차례로 비교해요.`);
  };
  // 2-1 덧셈과 뺄셈 (받아올림·내림 있는 두 자리 수)
  G.as2d = (r, d) => {
    const k = r.pick(d === 1 ? ['add1', 'sub1'] : d === 2 ? ['add', 'sub'] : ['add', 'sub', 'box', 'word']);
    if (k === 'add1') { let a, b; do { a = r.int(11, 89); b = r.int(2, 9); } while (noCarry(a, b) || a + b > 99); return P(`${a} + ${b} = ${B}`, a + b, `일의 자리 ${a % 10} + ${b} = ${a % 10 + b}, 10을 받아올려요.`, !noCarry(a, b)); }
    if (k === 'sub1') { let a, b; do { a = r.int(20, 99); b = r.int(2, 9); } while (noBorrow(a, b)); return P(`${a} - ${b} = ${B}`, a - b, `십의 자리에서 10을 받아내려 ${a % 10 + 10} - ${b}을(를) 계산해요.`, !noBorrow(a, b)); }
    if (k === 'add') { let a, b; do { [a, b] = addPair(r, 15, 79, 'carry'); } while (a + b > 99); return P(`${a} + ${b} = ${B}`, a + b, `일의 자리부터 더하고 받아올림을 잊지 않아요.`, !noCarry(a, b)); }
    if (k === 'sub') { const [a, b] = subPair(r, 15, 99, 'borrow'); return P(`${a} - ${b} = ${B}`, a - b, `일의 자리끼리 뺄 수 없으면 십의 자리에서 받아내려요.`, !noBorrow(a, b) && (a - b) + b === a); }
    if (k === 'box') { let a, b; do { [a, b] = addPair(r, 15, 79, 'carry'); } while (a + b > 99); return P(`${a} + ${B} = ${a + b}`, b, `${a + b} - ${a} = ${b}`); }
    const it = r.pick(ITEMS), n = nm(r); const [a, b] = subPair(r, 20, 95, 'borrow');
    return P(`${it[0]} ${a}${it[1]} 중에서 ${b}${it[1]}를 친구에게 주었어요. 남은 ${it[0]}는 몇 ${it[1]}일까요?`, `${a - b}${it[1]}`, `${a} - ${b} = ${a - b}`, true, true);
  };
  // 2-1 길이 재기 (cm)
  G.cm = (r, d) => {
    const a = r.int(5, d === 1 ? 30 : 60), b = r.int(3, a - 1);
    if (r.bool()) return P(`${a} cm와 ${b} cm를 이으면 모두 ${B} cm예요.`, `${a + b} cm`, `${a} + ${b} = ${a + b}`, true, true);
    return P(`${a} cm인 리본에서 ${b} cm를 잘라 냈어요. 남은 리본은 ${B} cm예요.`, `${a - b} cm`, `${a} - ${b} = ${a - b}`, true, true);
  };
  // 2-1 곱셈 (묶어 세기, 몇 배)
  G.mul1 = (r, d) => {
    const a = r.int(2, 9), b = r.int(2, d === 1 ? 4 : 6);
    const k = r.pick(d === 1 ? ['group', 'times'] : d === 2 ? ['times', 'addtomul'] : ['addtomul', 'word', 'times']);
    if (k === 'group') return P(`${a}씩 ${b}묶음은 ${B}이에요.`, a * b, `${Array(b).fill(a).join(' + ')} = ${a * b}`, Array(b).fill(a).reduce((x, y) => x + y) === a * b);
    if (k === 'times') return P(`${a}의 ${b}배는 ${B}이에요.`, a * b, `${a} × ${b} = ${a * b}`, Array(b).fill(a).reduce((x, y) => x + y) === a * b);
    if (k === 'addtomul') return P(`${Array(b).fill(a).join(' + ')} = ${a} × ${B}`, b, `${a}을(를) ${b}번 더했어요.`);
    const it = r.pick(ITEMS); return P(`한 접시에 ${it[0]}가 ${a}${it[1]}씩 ${b}접시 있어요. ${it[0]}는 모두 몇 ${it[1]}일까요?`, `${a * b}${it[1]}`, `${a}의 ${b}배: ${a} × ${b} = ${a * b}`, true, true);
  };
  // 2-2 네 자리 수
  G.n10000 = (r, d) => {
    const k = r.pick(d === 1 ? ['build', 'place'] : d === 2 ? ['place', 'skip', 'cmp'] : ['skip', 'cmp', 'build']);
    const n = r.int(1001, 9999);
    if (k === 'build') { const a = r.int(1, 9), b = r.int(0, 9), c = r.int(0, 9), e = r.int(0, 9); return P(`1000이 ${a}개, 100이 ${b}개, 10이 ${c}개, 1이 ${e}개인 수는 ${B}이에요.`, a * 1000 + b * 100 + c * 10 + e, `${a * 1000} + ${b * 100} + ${c * 10} + ${e}`); }
    if (k === 'place') { const pl = r.pick([['천', 1000], ['백', 100], ['십', 10]]); const dig = Math.floor(n / pl[1]) % 10; return P(`${n}에서 ${pl[0]}의 자리 숫자가 나타내는 수는 ${B}이에요.`, dig * pl[1], `${pl[0]}의 자리 숫자 ${dig}은(는) ${dig * pl[1]}을(를) 나타내요.`); }
    if (k === 'skip') { const st = r.pick([10, 100, 1000]); const s = r.int(1000, 9999 - st * 4); const arr = [0, 1, 2, 3].map(i => s + st * i); return P(`${st}씩 뛰어 세어 보세요. ${arr[0]} - ${arr[1]} - ${arr[2]} - ${B}`, arr[3], `${arr[2]} + ${st} = ${arr[3]}`); }
    let a = r.int(1000, 9999), b = r.int(1000, 9999); while (a === b) b = r.int(1000, 9999);
    return P(`${a}과(와) ${b} 중에서 더 큰 수는 ${B}예요.`, Math.max(a, b), `천의 자리부터 차례로 비교해요.`);
  };
  // 2-2 곱셈구구
  G.gugu = (r, d) => {
    const a = r.int(2, 9), b = r.int(d === 1 ? 1 : 2, 9);
    const k = r.pick(d === 1 ? ['mul'] : d === 2 ? ['mul', 'box', 'zero'] : ['box', 'word', 'mul']);
    if (k === 'mul') return P(`${a} × ${b} = ${B}`, a * b, `${a}단: ${a} × ${b} = ${a * b}`);
    if (k === 'box') return P(`${a} × ${B} = ${a * b}`, b, `${a}단에서 ${a * b}이(가) 나오는 곳을 찾아요.`, a * b / a === b);
    if (k === 'zero') { const z = r.pick([0, 1]); return r.bool() ? P(`${z} × ${b} = ${B}`, z * b, z ? `1과 어떤 수의 곱은 항상 그 수예요.` : `0과 어떤 수의 곱은 항상 0이에요.`) : P(`${a} × ${z} = ${B}`, a * z, z ? `어떤 수와 1의 곱은 그 수예요.` : `어떤 수와 0의 곱은 0이에요.`); }
    const it = r.pick(ITEMS); return P(`${it[0]}를 한 봉지에 ${a}${it[1]}씩 ${b}봉지에 담았어요. ${it[0]}는 모두 몇 ${it[1]}일까요?`, `${a * b}${it[1]}`, `${a} × ${b} = ${a * b}`, true, true);
  };
  // 2-2 길이 재기 (m, cm)
  G.mcm = (r, d) => {
    const k = r.pick(d === 1 ? ['tocm', 'tom'] : d === 2 ? ['tom', 'add'] : ['add', 'sub']);
    if (k === 'tocm') { const m = r.int(1, 5), c = r.int(1, 99); return P(`${m} m ${c} cm = ${B} cm`, `${m * 100 + c} cm`, `1 m = 100 cm이므로 ${m * 100} + ${c} = ${m * 100 + c}`); }
    if (k === 'tom') { const t = r.int(101, 599); return P(`${t} cm = ${B} m ${B} cm`, `${Math.floor(t / 100)} m ${t % 100} cm`, `100 cm가 1 m예요.`, Math.floor(t / 100) * 100 + t % 100 === t); }
    const m1 = r.int(1, 5), c1 = r.int(10, 80), m2 = r.int(1, 4), c2 = r.int(5, 99 - c1);
    if (k === 'add') { return P(`${m1} m ${c1} cm + ${m2} m ${c2} cm = ${B} m ${B} cm`, `${m1 + m2} m ${c1 + c2} cm`, `m끼리, cm끼리 더해요.`, c1 + c2 < 100, true); }
    const Bv = m2 * 100 + c2, A = Bv + r.int(40, 350); const D = A - Bv;
    return P(`${Math.floor(A / 100)} m ${A % 100} cm - ${m2} m ${c2} cm = ${B} m ${B} cm`, `${Math.floor(D / 100)} m ${D % 100} cm`, `cm로 바꿔 빼면 ${A} - ${Bv} = ${D} cm예요.`, D > 0, true);
  };
  // 2-2 시각과 시간 (글로만)
  G.time2 = (r, d) => {
    const k = r.pick(d === 1 ? ['h2m', 'day'] : d === 2 ? ['m2h', 'after'] : ['after', 'week', 'm2h']);
    if (k === 'h2m') { const h = r.int(1, 3), m = r.int(5, 55); return P(`${h}시간 ${m}분 = ${B}분`, `${h * 60 + m}분`, `1시간 = 60분이므로 ${h * 60} + ${m} = ${h * 60 + m}`); }
    if (k === 'm2h') { const t = r.int(70, 200); return P(`${t}분 = ${B}시간 ${B}분`, `${Math.floor(t / 60)}시간 ${t % 60}분`, `60분이 1시간이에요.`, Math.floor(t / 60) * 60 + t % 60 === t); }
    if (k === 'day') { const n = r.int(2, 3); return P(`${n}일은 ${B}시간이에요.`, `${n * 24}시간`, `1일 = 24시간이에요.`); }
    if (k === 'week') { const n = r.int(2, 4), e = r.int(1, 6); return P(`${n}주일 ${e}일은 모두 ${B}일이에요.`, `${n * 7 + e}일`, `1주일 = 7일이므로 ${n * 7} + ${e} = ${n * 7 + e}`); }
    const h = r.int(1, 10), m = r.pick([5, 10, 15, 20, 25, 30, 35, 40]), add = r.pick([20, 30, 40, 50]); const t = h * 60 + m + add;
    return P(`${h}시 ${m}분에서 ${add}분이 지나면 ${B}시 ${B}분이에요.`, `${Math.floor(t / 60)}시 ${t % 60}분`, `${m} + ${add} = ${m + add}분${m + add >= 60 ? `, 60분은 1시간으로 바꿔요.` : ''}`, true, true);
  };
  G.rule2 = (r, d) => seqProblem(r, d, false);
  // 3-1 덧셈과 뺄셈 (세 자리)
  G.as3d = (r, d) => {
    const k = r.pick(d === 1 ? ['add', 'sub'] : d === 2 ? ['add', 'sub'] : ['add', 'sub', 'word']);
    const mode = d === 1 ? 'none' : 'any';
    if (k === 'add') { let a, b; do { [a, b] = addPair(r, 101, 899, d === 1 ? 'none' : 'carry'); } while (a + b > 999); return P(`${a} + ${b} = ${B}`, a + b, `일, 십, 백의 자리 순서로 더하고 받아올림을 챙겨요.`, (a + b) - b === a); }
    if (k === 'sub') { const [a, b] = subPair(r, 101, 999, d === 1 ? 'none' : 'borrow'); return P(`${a} - ${b} = ${B}`, a - b, `일의 자리부터 빼고, 모자라면 윗자리에서 받아내려요.`, (a - b) + b === a); }
    const n = nm(r); const [a, b] = subPair(r, 300, 999, 'borrow');
    return P(`줄넘기를 ${nmI(n)}는 ${a}번, 동생은 ${b}번 했어요. ${nmI(n)}는 동생보다 몇 번 더 했을까요?`, `${a - b}번`, `${a} - ${b} = ${a - b}`, mode && true, true);
  };
  // 3-1 나눗셈 (곱셈구구 범위)
  G.div1 = (r, d) => {
    const b = r.int(2, 9), q = r.int(d === 1 ? 2 : 2, 9), a = b * q;
    const k = r.pick(d === 1 ? ['div'] : d === 2 ? ['div', 'box'] : ['word', 'box', 'word2']);
    if (k === 'div') return P(`${a} ÷ ${b} = ${B}`, q, `${b} × ${q} = ${a}이므로 ${a} ÷ ${b} = ${q}`, b * q === a);
    if (k === 'box') return P(`${a} ÷ ${B} = ${q}`, b, `${q} × ${b} = ${a}`, a / b === q);
    const it = r.pick(ITEMS);
    if (k === 'word') return P(`${it[0]} ${a}${it[1]}를 ${b}명이 똑같이 나누어 가지면 한 명이 몇 ${it[1]}씩 가질까요?`, `${q}${it[1]}`, `${a} ÷ ${b} = ${q}`, b * q === a, true);
    return P(`${it[0]} ${a}${it[1]}를 한 사람에게 ${b}${it[1]}씩 주면 몇 명에게 줄 수 있을까요?`, `${q}명`, `${a} ÷ ${b} = ${q}`, b * q === a, true);
  };
  // 3-1 곱셈 (두 자리 × 한 자리)
  G.mul21 = (r, d) => {
    let a, b;
    do { a = r.int(11, 99); b = r.int(2, 9); } while (d === 1 && (a % 10) * b > 9 || d === 1 && Math.floor(a / 10) * b > 9);
    if (d === 3 && r.bool()) { const it = r.pick(ITEMS); return P(`한 상자에 ${it[0]}가 ${a}${it[1]}씩 들어 있어요. ${b}상자에는 모두 몇 ${it[1]}일까요?`, `${a * b}${it[1]}`, `${a} × ${b} = ${a * b}`, true, true); }
    return P(`${a} × ${b} = ${B}`, a * b, `${Math.floor(a / 10) * 10} × ${b} = ${Math.floor(a / 10) * 10 * b}, ${a % 10} × ${b} = ${(a % 10) * b}을(를) 더해요.`, Math.floor(a / 10) * 10 * b + (a % 10) * b === a * b);
  };
  // 3-1 길이와 시간
  G.lentime = (r, d) => {
    const k = r.pick(d === 1 ? ['mm', 'km'] : d === 2 ? ['km', 'sec', 'mm2'] : ['addtime', 'subtime', 'km2']);
    if (k === 'mm') { const c = r.int(2, 15), m = r.int(1, 9); return P(`${c} cm ${m} mm = ${B} mm`, `${c * 10 + m} mm`, `1 cm = 10 mm예요.`); }
    if (k === 'mm2') { const t = r.int(21, 159); return P(`${t} mm = ${B} cm ${B} mm`, `${Math.floor(t / 10)} cm ${t % 10} mm`, `10 mm가 1 cm예요.`, Math.floor(t / 10) * 10 + t % 10 === t); }
    if (k === 'km') { const k1 = r.int(1, 9), m = r.int(1, 999); return P(`${k1} km ${m} m = ${B} m`, `${k1 * 1000 + m} m`, `1 km = 1000 m예요.`); }
    if (k === 'km2') { const t = r.int(1100, 9800); return P(`${t} m = ${B} km ${B} m`, `${Math.floor(t / 1000)} km ${t % 1000} m`, `1000 m가 1 km예요.`, true); }
    if (k === 'sec') { const m = r.int(1, 4), s = r.int(5, 55); return P(`${m}분 ${s}초 = ${B}초`, `${m * 60 + s}초`, `1분 = 60초예요.`); }
    const h1 = r.int(1, 5), m1 = r.int(10, 50), h2 = r.int(1, 3), m2 = r.int(15, 55);
    if (k === 'addtime') { const t = (h1 + h2) * 60 + m1 + m2; return P(`${h1}시간 ${m1}분 + ${h2}시간 ${m2}분 = ${B}시간 ${B}분`, `${Math.floor(t / 60)}시간 ${t % 60}분`, `분끼리 더해 60분이 넘으면 1시간으로 바꿔요.`, true); }
    const A = (h1 + 3) * 60 + m1, Bv = h2 * 60 + m2, D = A - Bv;
    return P(`${h1 + 3}시간 ${m1}분 - ${h2}시간 ${m2}분 = ${B}시간 ${B}분`, `${Math.floor(D / 60)}시간 ${D % 60}분`, `분끼리 뺄 수 없으면 1시간을 60분으로 바꿔요.`, D > 0);
  };
  // 3-1 분수와 소수
  G.fracdec = (r, d) => {
    const k = r.pick(d === 1 ? ['part', 'tenth'] : d === 2 ? ['unit', 'todec', 'part'] : ['unit', 'deccmp', 'todec']);
    if (k === 'part') { const a = r.int(3, 9), b = r.int(1, a - 1); return P(`전체를 똑같이 ${a}(으)로 나눈 것 중의 ${b}을(를) 분수로 나타내면 ${B}예요.`, F(b, a), `전체를 ${a}(으)로 나누었으니 분모는 ${a}, 그중 ${b}이니 분자는 ${b}예요.`); }
    if (k === 'unit') { let a = r.int(2, 9), b = r.int(2, 9); while (a === b) b = r.int(2, 9); return P(`${F(1, a)}과(와) ${F(1, b)} 중에서 더 큰 분수는 ${B}예요.`, F(1, Math.min(a, b)), `단위분수는 분모가 작을수록 커요.`, 1 / Math.min(a, b) > 1 / Math.max(a, b)); }
    if (k === 'tenth') { const a = r.int(1, 9); return P(`0.1이 ${a}개인 수는 ${B}이에요.`, `0.${a}`, `0.1이 ${a}개면 0.${a}예요.`); }
    if (k === 'todec') { const a = r.int(1, 9); return P(`${F(a, 10)}을(를) 소수로 나타내면 ${B}이에요.`, `0.${a}`, `${F(1, 10)} = 0.1이므로 ${F(a, 10)} = 0.${a}`); }
    let a = r.int(11, 99), b = r.int(11, 99); while (a === b) b = r.int(11, 99);
    return P(`${dec(a, 1)}과(와) ${dec(b, 1)} 중에서 더 큰 수는 ${B}예요.`, dec(Math.max(a, b), 1), `자연수 부분을 먼저, 같으면 소수 첫째 자리를 비교해요.`);
  };
  // 3-2 곱셈
  G.mul2 = (r, d) => {
    if (d === 1 || (d === 2 && r.bool())) { const a = r.int(101, 499), b = r.int(2, 9); return P(`${a} × ${b} = ${B}`, a * b, `백, 십, 일의 자리 수에 각각 ${b}을(를) 곱해 더해요.`, (Math.floor(a / 100) * 100 + Math.floor(a / 10) % 10 * 10 + a % 10) * b === a * b); }
    const a = r.int(12, 99), b = r.int(12, 99);
    if (d === 3 && r.bool()) { const it = r.pick(ITEMS); return P(`${it[0]}를 하루에 ${a}${it[1]}씩 ${b}일 동안 모았어요. 모두 몇 ${it[1]}일까요?`, `${a * b}${it[1]}`, `${a} × ${b} = ${a * b}`, true, true); }
    return P(`${a} × ${b} = ${B}`, a * b, `${a} × ${b % 10} = ${a * (b % 10)}, ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10}을(를) 더해요.`, a * (b % 10) + a * Math.floor(b / 10) * 10 === a * b);
  };
  // 3-2 나눗셈 (나머지)
  G.div2 = (r, d) => {
    const b = r.int(2, 9), q = r.int(d === 1 ? 3 : 10, d === 3 ? 99 : d === 2 ? 30 : 9), rem = r.int(d === 1 ? 0 : 1, b - 1), a = b * q + rem;
    if (d === 3 && r.bool()) { const it = r.pick(ITEMS); return P(`${it[0]} ${a}${it[1]}를 ${b}명이 똑같이 나누어 가지면 한 명이 몇 ${it[1]}씩 가지고 몇 ${it[1]}가 남을까요?`, `${q}${it[1]}씩, ${rem}${it[1]} 남음`, `${a} ÷ ${b} = ${q} … ${rem}`, b * q + rem === a && rem < b, true); }
    return P(`${a} ÷ ${b} = ${B} … ${B}`, `몫 ${q}, 나머지 ${rem}`, `검산: ${b} × ${q} + ${rem} = ${a}`, b * q + rem === a && rem < b);
  };
  // 3-2 분수
  G.frac3 = (r, d) => {
    const k = r.pick(d === 1 ? ['of', 'cmp'] : d === 2 ? ['toMixed', 'toImp', 'of'] : ['toMixed', 'toImp', 'ofword']);
    const den = r.int(3, 9);
    if (k === 'of') { const b = r.int(2, 6), q = r.int(2, 6), n = b * q, a = r.int(1, b - 1); return P(`${n}의 ${F(a, b)}은(는) ${B}이에요.`, q * a, `${n}을(를) ${b}묶음으로 나누면 한 묶음은 ${q}, ${a}묶음은 ${q * a}`, n / b * a === q * a); }
    if (k === 'ofword') { const b = r.int(3, 6), q = r.int(2, 8), n = b * q, a = r.int(1, b - 1); const it = r.pick(FOOD); return P(`${it[0]} ${n}${it[1]}의 ${F(a, b)}을(를) 먹었어요. 먹은 ${it[0]}는 몇 ${it[1]}일까요?`, `${q * a}${it[1]}`, `${n} ÷ ${b} × ${a} = ${q * a}`, true, true); }
    if (k === 'cmp') { let a = r.int(1, den - 1), b = r.int(1, den - 1); while (a === b) b = r.int(1, den - 1); return P(`${F(a, den)}과(와) ${F(b, den)} 중에서 더 큰 분수는 ${B}예요.`, F(Math.max(a, b), den), `분모가 같으면 분자가 클수록 커요.`); }
    if (k === 'toMixed') { const w = r.int(1, 4), m = r.int(1, den - 1), n = w * den + m; return P(`가분수 ${F(n, den)}을(를) 대분수로 나타내면 ${B}예요.`, `${w}${F(m, den)}`, `${n} ÷ ${den} = ${w} … ${m}`, w * den + m === n); }
    const w = r.int(1, 4), m = r.int(1, den - 1); return P(`대분수 ${w}${F(m, den)}을(를) 가분수로 나타내면 ${B}예요.`, F(w * den + m, den), `${den} × ${w} + ${m} = ${w * den + m}`);
  };
  // 3-2 들이와 무게
  G.volw = (r, d) => {
    const isL = r.bool(); const U = isL ? ['L', 'mL'] : ['kg', 'g'];
    const k = r.pick(d === 1 ? ['to', 'from'] : d === 2 ? ['from', 'add'] : ['add', 'sub']);
    if (k === 'to') { const a = r.int(1, 9), b = r.int(1, 999); return P(`${a} ${U[0]} ${b} ${U[1]} = ${B} ${U[1]}`, `${a * 1000 + b} ${U[1]}`, `1 ${U[0]} = 1000 ${U[1]}예요.`); }
    if (k === 'from') { const t = r.int(1100, 9900); return P(`${t} ${U[1]} = ${B} ${U[0]} ${B} ${U[1]}`, `${Math.floor(t / 1000)} ${U[0]} ${t % 1000} ${U[1]}`, `1000 ${U[1]}가 1 ${U[0]}예요.`); }
    const a1 = r.int(1, 5), b1 = r.int(100, 800), a2 = r.int(1, 4), b2 = r.int(100, 900);
    if (k === 'add') { const t = (a1 + a2) * 1000 + b1 + b2; return P(`${a1} ${U[0]} ${b1} ${U[1]} + ${a2} ${U[0]} ${b2} ${U[1]} = ${B} ${U[0]} ${B} ${U[1]}`, `${Math.floor(t / 1000)} ${U[0]} ${t % 1000} ${U[1]}`, `${U[1]}끼리 더해 1000이 넘으면 1 ${U[0]}로 바꿔요.`, true, true); }
    const A = (a1 + 4) * 1000 + b1, Bv = a2 * 1000 + b2, D = A - Bv;
    return P(`${a1 + 4} ${U[0]} ${b1} ${U[1]} - ${a2} ${U[0]} ${b2} ${U[1]} = ${B} ${U[0]} ${B} ${U[1]}`, `${Math.floor(D / 1000)} ${U[0]} ${D % 1000} ${U[1]}`, `${U[1]}끼리 뺄 수 없으면 1 ${U[0]}를 1000 ${U[1]}로 바꿔요.`, D > 0, true);
  };
  // 4-1 큰 수
  G.big = (r, d) => {
    const k = r.pick(d === 1 ? ['man', 'place'] : d === 2 ? ['eok', 'skip', 'place'] : ['jo', 'cmp', 'skip']);
    if (k === 'man') { const a = r.int(1, 9), b = r.int(0, 9), c = r.int(0, 9), e = r.int(0, 9); const v = a * 10000 + b * 1000 + c * 100 + e; return P(`10000이 ${a}개, 1000이 ${b}개, 100이 ${c}개, 1이 ${e}개인 수는 ${B}이에요.`, fmt(v), `${fmt(a * 10000)} + ${fmt(b * 1000)} + ${c * 100} + ${e}`, v === Number(String(a) + b + c + '0' + e)); }
    if (k === 'place') { const v = r.int(10000000, 99999999); const pl = r.pick([['천만', 1e7], ['백만', 1e6], ['십만', 1e5], ['만', 1e4]]); const dig = Math.floor(v / pl[1]) % 10; return P(`${fmt(v)}에서 ${pl[0]}의 자리 숫자는 ${B}이에요.`, dig, `오른쪽부터 네 자리씩 끊어 만, 억 단위를 찾아요.`); }
    if (k === 'eok') { const a = r.int(1, 999), b = r.int(1, 9999); const v = a * 1e8 + b * 1e4; return P(`${a}억 ${b}만을 숫자로 쓰면 ${B}이에요.`, fmt(v), `억 아래에 네 자리, 만 아래에 네 자리를 채워요.`, v === a * 100000000 + b * 10000); }
    if (k === 'jo') { const a = r.int(1, 99), b = r.int(1, 9999); const v = a * 1e12 + b * 1e8; return P(`${a}조 ${b}억을 숫자로 쓰면 ${B}이에요.`, fmt(v), `조 아래에 0이 12개 들어갈 자리가 있어요.`, Number.isSafeInteger(v)); }
    if (k === 'skip') { const st = r.pick([1e4, 1e5, 1e6, 1e7, 1e8]); const s = r.int(1, 9) * st * 10 + r.int(1, 9) * st; const arr = [0, 1, 2, 3].map(i => s + st * i); return P(`${fmt(st)}씩 뛰어 세어 보세요.<br>${fmt(arr[0])} - ${fmt(arr[1])} - ${fmt(arr[2])} - ${B}`, fmt(arr[3]), `${fmt(st)}씩 커져요.`); }
    const a = r.int(1e8, 9.9e8), b = a + r.pick([-1, 1]) * r.int(1, 99) * 1e4;
    return P(`${fmt(a)}과(와) ${fmt(b)} 중에서 더 큰 수는 ${B}예요.`, fmt(Math.max(a, b)), `자리 수가 같으면 높은 자리부터 비교해요.`);
  };
  // 4-1 각도
  G.angle = (r, d) => {
    const k = r.pick(d === 1 ? ['add', 'sub'] : d === 2 ? ['add', 'sub', 'tri'] : ['tri', 'quad']);
    if (k === 'add') { const a = r.int(15, 120), b = r.int(15, 175 - a); return P(`${a}° + ${b}° = ${B}°`, `${a + b}°`, `각도는 자연수처럼 더해요.`); }
    if (k === 'sub') { const a = r.int(60, 175), b = r.int(10, a - 10); return P(`${a}° - ${b}° = ${B}°`, `${a - b}°`, `각도는 자연수처럼 빼요.`); }
    if (k === 'tri') { const a = r.int(20, 100), b = r.int(20, 160 - a - 0); const c = 180 - a - b; return P(`삼각형의 두 각이 ${a}°, ${b}°예요. 나머지 한 각은 ${B}°예요.`, `${c}°`, `삼각형 세 각의 합은 180°: 180 - ${a} - ${b} = ${c}`, c > 0 && a + b + c === 180); }
    let a, b, c, e; do { a = r.int(60, 120); b = r.int(60, 120); c = r.int(50, 110); e = 360 - a - b - c; } while (e < 40 || e > 170);
    return P(`사각형의 세 각이 ${a}°, ${b}°, ${c}°예요. 나머지 한 각은 ${B}°예요.`, `${e}°`, `사각형 네 각의 합은 360°: 360 - ${a} - ${b} - ${c} = ${e}`, e > 0 && e < 180);
  };
  // 4-1 곱셈과 나눗셈
  G.muldiv4 = (r, d) => {
    const k = r.pick(d === 1 ? ['mul', 'div0'] : d === 2 ? ['mul', 'div'] : ['mul', 'div', 'word']);
    if (k === 'mul') { const a = r.int(101, 999), b = r.int(d === 1 ? 10 : 11, 99); const bb = d === 1 ? b - b % 10 || 10 : b; return P(`${a} × ${bb} = ${B}`, fmt(a * bb), (bb % 10 === 0 ? `${a} × ${bb / 10} = ${fmt(a * bb / 10)}에 0을 하나 붙여요.` : `${a} × ${bb % 10} = ${fmt(a * (bb % 10))}, ${a} × ${bb - bb % 10} = ${fmt(a * (bb - bb % 10))}을(를) 더해요.`), a * (bb % 10) + a * (bb - bb % 10) === a * bb); }
    if (k === 'div0') { const b = r.pick([10, 20, 30, 40, 50, 60]), q = r.int(2, 9), a = b * q; return P(`${a} ÷ ${b} = ${B}`, q, `${b} × ${q} = ${a}`, b * q === a); }
    const b = r.int(12, 99), q = r.int(2, d === 3 ? 30 : 9), rem = r.int(0, b - 1), a = b * q + rem;
    if (a > 999) return G.muldiv4(r, d);
    if (k === 'word') { const it = r.pick(ITEMS); return P(`${it[0]} ${a}${it[1]}를 한 상자에 ${b}${it[1]}씩 담으면 몇 상자가 되고 몇 ${it[1]}가 남을까요?`, `${q}상자, ${rem}${it[1]} 남음`, `${a} ÷ ${b} = ${q} … ${rem}`, b * q + rem === a, true); }
    return P(`${a} ÷ ${b} = ${B} … ${B}`, `몫 ${q}, 나머지 ${rem}`, `검산: ${b} × ${q} + ${rem} = ${a}`, b * q + rem === a && rem < b);
  };
  G.rule4 = (r, d) => seqProblem(r, d, true);
  // 4-2 분수의 덧셈과 뺄셈 (분모가 같은)
  G.fracas4 = (r, d) => {
    const den = r.int(4, 12);
    if (d === 1) { const a = r.int(1, den - 2), b = r.int(1, den - 1 - a); return r.bool() ? P(`${F(a, den)} + ${F(b, den)} = ${B}`, F(a + b, den), `분모는 그대로, 분자끼리 더해요.`, a + b < den) : P(`${F(a + b, den)} - ${F(b, den)} = ${B}`, F(a, den), `분모는 그대로, 분자끼리 빼요.`); }
    if (d === 2) { const w1 = r.int(1, 4), w2 = r.int(1, 3), a = r.int(1, den - 1), b = r.int(1, den - 1); const tot = (w1 + w2) * den + a + b; return P(`${w1}${F(a, den)} + ${w2}${F(b, den)} = ${B}`, `${Math.floor(tot / den)}${tot % den ? F(tot % den, den) : ''}`, `자연수끼리, 분수끼리 더하고 가분수는 자연수로 올려요.`); }
    const w1 = r.int(3, 6), w2 = r.int(1, w1 - 1), a = r.int(1, den - 2), b = r.int(a + 1, den - 1); const A = w1 * den + a, Bv = w2 * den + b, D = A - Bv;
    return P(`${w1}${F(a, den)} - ${w2}${F(b, den)} = ${B}`, `${Math.floor(D / den)}${D % den ? F(D % den, den) : ''}`, `분수끼리 뺄 수 없으면 자연수 1을 ${F(den, den)}(으)로 바꿔요.`, D > 0);
  };
  // 4-2 소수의 덧셈과 뺄셈
  G.decas4 = (r, d) => {
    const s = d === 1 ? 1 : d === 2 ? 2 : r.pick([2, 3]);
    const a = r.int(10 ** s, 10 ** (s + 1) * 5), b = r.int(10 ** (s - 1), 10 ** (s + 1) * 3);
    if (r.bool()) return P(`${dec(a, s)} + ${dec(b, s)} = ${B}`, dec(a + b, s), `소수점 자리를 맞추어 더해요.`, Math.abs(parseFloat(dec(a, s)) + parseFloat(dec(b, s)) - parseFloat(dec(a + b, s))) < 1e-9);
    const [x, y] = a > b ? [a, b] : [b, a];
    return P(`${dec(x, s)} - ${dec(y, s)} = ${B}`, dec(x - y, s), `소수점 자리를 맞추어 빼요.`, Math.abs(parseFloat(dec(x, s)) - parseFloat(dec(y, s)) - parseFloat(dec(x - y, s))) < 1e-9);
  };
  // 4-2 다각형 (정다각형 둘레, 대각선 수)
  G.poly = (r, d) => {
    const P_ = [[3, '정삼각형'], [4, '정사각형'], [5, '정오각형'], [6, '정육각형'], [8, '정팔각형']];
    const [n, name] = r.pick(P_);
    const k = r.pick(d === 1 ? ['peri'] : d === 2 ? ['peri', 'side'] : ['diag', 'side']);
    if (k === 'peri') { const s = r.int(3, 15); return P(`한 변이 ${s} cm인 ${name}의 둘레는 ${B} cm예요.`, `${s * n} cm`, `${name}은(는) 변이 ${n}개이고 길이가 모두 같아요: ${s} × ${n} = ${s * n}`); }
    if (k === 'side') { const s = r.int(3, 15); return P(`둘레가 ${s * n} cm인 ${name}의 한 변은 ${B} cm예요.`, `${s} cm`, `${s * n} ÷ ${n} = ${s}`, s * n / n === s); }
    const m = r.pick([4, 5, 6]); const nmz = { 4: '사각형', 5: '오각형', 6: '육각형' }[m]; const dg = m * (m - 3) / 2;
    return P(`${nmz}의 대각선은 모두 ${B}개예요.`, `${dg}개`, `한 꼭짓점에서 ${m - 3}개씩 그을 수 있고, 두 번씩 세었으니 ${m} × ${m - 3} ÷ 2 = ${dg}`, dg === { 4: 2, 5: 5, 6: 9 }[m]);
  };
  // 5-1 자연수의 혼합 계산
  G.mixed = (r, d) => {
    const forms = d === 1 ? ['a+b-c', 'a*b/c'] : d === 2 ? ['a+b*c', 'a-b/c', '(a+b)*c'] : ['a+b*c-d', '(a-b)/c+d', 'a*(b+c)/d'];
    for (let i = 0; i < 200; i++) {
      const f = r.pick(forms); const v = { a: r.int(2, 60), b: r.int(2, 30), c: r.int(2, 9), d: r.int(2, 9) };
      if (f.includes('/')) { // 나누어떨어지게
        if (f === 'a*b/c') { v.a = v.c * r.int(2, 9); }
        if (f === 'a-b/c') { v.b = v.c * r.int(2, 9); v.a = v.b / v.c + r.int(1, 50); }
        if (f === '(a-b)/c+d') { v.b = r.int(2, 30); v.a = v.b + v.c * r.int(1, 9); }
        if (f === 'a*(b+c)/d') { v.a = v.d * r.int(1, 6); }
      }
      const js = f.replace(/[abcd]/g, m => v[m]);
      const val = Function('return ' + js)();
      if (!Number.isInteger(val) || val < 0) continue;
      const shown = js.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ').replace(/\+/g, ' + ').replace(/-/g, ' - ');
      return P(`${shown} = ${B}`, val, f.includes('(') ? '괄호 안을 먼저 계산해요.' : ((/[*\/]/.test(f) && /[+-]/.test(f)) ? '곱셈과 나눗셈을 덧셈과 뺄셈보다 먼저 계산해요.' : '앞에서부터 차례로 계산해요.'), true);
    }
    return P(`2 + 3 × 4 = ${B}`, 14, '곱셈을 먼저 계산해요.');
  };
  // 5-1 약수와 배수
  G.factor = (r, d) => {
    const k = r.pick(d === 1 ? ['list', 'mult'] : d === 2 ? ['gcd', 'lcm', 'count'] : ['gcd', 'lcm', 'word']);
    if (k === 'list') { const n = r.pick([6, 8, 10, 12, 15, 16, 18, 20, 24]); const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return P(`${n}의 약수를 모두 써 보세요.`, f.join(', '), `${n}을(를) 나누어떨어지게 하는 수를 1부터 찾아요.`, f.every(x => n % x === 0)); }
    if (k === 'count') { const n = r.pick([12, 18, 20, 24, 28, 30, 36]); let c = 0; for (let i = 1; i <= n; i++) if (n % i === 0) c++; return P(`${n}의 약수는 모두 ${B}개예요.`, `${c}개`, `1과 ${n}을(를) 포함해 짝을 지어 세어요.`); }
    if (k === 'mult') { const n = r.int(3, 9), m = r.int(3, 6); return P(`${n}의 배수를 작은 수부터 쓸 때 ${m}번째 수는 ${B}이에요.`, n * m, `${n} × ${m} = ${n * m}`); }
    let a = r.int(2, 9) * r.int(2, 6), b = r.int(2, 9) * r.int(2, 6); while (a === b) b += r.int(1, 5);
    if (k === 'gcd') return P(`${a}과(와) ${b}의 최대공약수는 ${B}이에요.`, gcd(a, b), `두 수의 공약수 중 가장 큰 수를 찾아요.`, a % gcd(a, b) === 0 && b % gcd(a, b) === 0);
    if (k === 'lcm') { const x = r.int(2, 12), y = r.int(2, 12); return P(`${x}과(와) ${y}의 최소공배수는 ${B}이에요.`, lcm(x, y), `두 수의 공배수 중 가장 작은 수를 찾아요.`, lcm(x, y) % x === 0 && lcm(x, y) % y === 0); }
    const x = r.pick([4, 6, 8, 10, 12]), y = r.pick([6, 9, 10, 15]); return P(`버스가 한 정류장에 ${x}분마다, 다른 버스가 ${y}분마다 와요. 지금 두 버스가 함께 왔다면 다음에 함께 오는 것은 몇 분 뒤일까요?`, `${lcm(x, y)}분 뒤`, `${x}과(와) ${y}의 최소공배수를 구해요.`, true, true);
  };
  // 5-1 규칙과 대응
  G.corr = (r, d) => {
    const a = r.int(2, 9), x = r.int(3, 12), b = r.int(3, 20);
    const k = r.pick(d === 1 ? ['mul'] : d === 2 ? ['mul', 'add'] : ['inv', 'word']);
    if (k === 'mul') return P(`△ = ○ × ${a}인 대응 관계에서 ○가 ${x}일 때 △는 ${B}이에요.`, a * x, `${x} × ${a} = ${a * x}`);
    if (k === 'add') return P(`△ = ○ + ${b}인 대응 관계에서 ○가 ${x}일 때 △는 ${B}이에요.`, x + b, `${x} + ${b} = ${x + b}`);
    if (k === 'inv') return P(`△ = ○ × ${a}인 대응 관계에서 △가 ${a * x}일 때 ○는 ${B}이에요.`, x, `${a * x} ÷ ${a} = ${x}`, a * x / a === x);
    return P(`세발자전거 한 대에 바퀴가 3개 있어요. 세발자전거가 ${x}대이면 바퀴는 모두 몇 개일까요?`, `${x * 3}개`, `(바퀴 수) = (자전거 수) × 3`, true, true);
  };
  // 5-1 약분과 통분
  G.reduce = (r, d) => {
    const k = r.pick(d === 1 ? ['simp'] : d === 2 ? ['simp', 'common'] : ['common', 'cmp']);
    if (k === 'simp') { const dn = r.int(2, 9), nu = r.int(1, dn - 1), g = r.int(2, 6); if (gcd(nu, dn) !== 1) return G.reduce(r, d); return P(`${F(nu * g, dn * g)}을(를) 기약분수로 나타내면 ${B}예요.`, F(nu, dn), `분모와 분자를 최대공약수 ${g}(으)로 나누어요.`, gcd(nu, dn) === 1); }
    const d1 = r.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]), d2 = r.pick([3, 4, 5, 6, 8, 9, 10, 12, 15]); if (d1 === d2) return G.reduce(r, d);
    const n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1), L = lcm(d1, d2);
    if (gcd(n1, d1) !== 1 || gcd(n2, d2) !== 1) return G.reduce(r, d);
    if (k === 'common') return P(`${F(n1, d1)}과(와) ${F(n2, d2)}를 가장 작은 공통분모로 통분하면 ${B}, ${B}예요.`, `${F(n1 * L / d1, L)}, ${F(n2 * L / d2, L)}`, `${d1}과(와) ${d2}의 최소공배수 ${L}을(를) 공통분모로 해요.`, L % d1 === 0 && L % d2 === 0);
    if (n1 * d2 === n2 * d1) return G.reduce(r, d);
    const big = n1 * d2 > n2 * d1 ? F(n1, d1) : F(n2, d2);
    return P(`${F(n1, d1)}과(와) ${F(n2, d2)} 중에서 더 큰 분수는 ${B}예요.`, big, `통분하면 ${F(n1 * L / d1, L)}, ${F(n2 * L / d2, L)}이에요.`);
  };
  // 5-1 분수의 덧셈과 뺄셈 (분모가 다른)
  G.fracas5 = (r, d) => {
    const d1 = r.int(2, 8), d2 = r.int(2, 9); if (d1 === d2) return G.fracas5(r, d);
    const n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1), L = lcm(d1, d2);
    if (gcd(n1, d1) !== 1 || gcd(n2, d2) !== 1) return G.fracas5(r, d);
    const w1 = d === 3 ? r.int(2, 5) : 0, w2 = d === 3 ? r.int(1, w1 - 1 || 1) : 0;
    const A = (w1 * d1 + n1) * (L / d1), Bv = (w2 * d2 + n2) * (L / d2);
    const sh = (w, n, dd) => (w ? w : '') + F(n, dd);
    if (r.bool() || A <= Bv) return P(`${sh(w1, n1, d1)} + ${sh(w2, n2, d2)} = ${B}`, frac(A + Bv, L), `${L}(으)로 통분해서 더하고 약분해요.`, true);
    return P(`${sh(w1, n1, d1)} - ${sh(w2, n2, d2)} = ${B}`, frac(A - Bv, L), `${L}(으)로 통분해서 빼고 약분해요.`, A - Bv > 0);
  };
  // 5-1 다각형의 둘레와 넓이
  G.area = (r, d) => {
    const k = r.pick(d === 1 ? ['rect', 'sq'] : d === 2 ? ['rect', 'para', 'tri'] : ['tri', 'trap', 'rhom', 'rectP']);
    const a = r.int(3, 15), b = r.int(3, 15);
    if (k === 'rect') return P(`가로 ${a} cm, 세로 ${b} cm인 직사각형의 넓이는 ${B} cm²예요.`, `${a * b} cm²`, `(가로) × (세로) = ${a} × ${b}`);
    if (k === 'rectP') return P(`가로 ${a} cm, 세로 ${b} cm인 직사각형의 둘레는 ${B} cm예요.`, `${(a + b) * 2} cm`, `((가로) + (세로)) × 2 = (${a} + ${b}) × 2`);
    if (k === 'sq') return P(`한 변이 ${a} cm인 정사각형의 넓이는 ${B} cm²예요.`, `${a * a} cm²`, `(한 변) × (한 변) = ${a} × ${a}`);
    if (k === 'para') return P(`밑변 ${a} cm, 높이 ${b} cm인 평행사변형의 넓이는 ${B} cm²예요.`, `${a * b} cm²`, `(밑변) × (높이) = ${a} × ${b}`);
    if (k === 'tri') { const bb = b % 2 ? b + 1 : b; return P(`밑변 ${a} cm, 높이 ${bb} cm인 삼각형의 넓이는 ${B} cm²예요.`, `${a * bb / 2} cm²`, `(밑변) × (높이) ÷ 2 = ${a} × ${bb} ÷ 2`, Number.isInteger(a * bb / 2)); }
    if (k === 'rhom') { const bb = b % 2 ? b + 1 : b; return P(`두 대각선이 ${a} cm, ${bb} cm인 마름모의 넓이는 ${B} cm²예요.`, `${a * bb / 2} cm²`, `(한 대각선) × (다른 대각선) ÷ 2`, Number.isInteger(a * bb / 2)); }
    const h = r.int(2, 10) * 2, u = r.int(3, 12), l = u + r.int(1, 8);
    return P(`윗변 ${u} cm, 아랫변 ${l} cm, 높이 ${h} cm인 사다리꼴의 넓이는 ${B} cm²예요.`, `${(u + l) * h / 2} cm²`, `((윗변) + (아랫변)) × (높이) ÷ 2 = (${u} + ${l}) × ${h} ÷ 2`, Number.isInteger((u + l) * h / 2));
  };
  // 5-2 수의 범위와 어림하기
  G.round = (r, d) => {
    const k = r.pick(d === 1 ? ['up', 'down'] : d === 2 ? ['round', 'range'] : ['round', 'range', 'word']);
    const n = r.int(1001, 9999), pl = r.pick(d === 1 ? [10, 100] : [10, 100, 1000]), plN = { 10: '십', 100: '백', 1000: '천' }[pl];
    if (k === 'up') { const v = Math.ceil(n / pl) * pl; return P(`${n}을(를) 올림하여 ${plN}의 자리까지 나타내면 ${B}이에요.`, v, `${plN}의 자리 아래 수가 0이 아니면 ${plN}의 자리를 1 올려요.`, v >= n && v - n < pl); }
    if (k === 'down') { const v = Math.floor(n / pl) * pl; return P(`${n}을(를) 버림하여 ${plN}의 자리까지 나타내면 ${B}이에요.`, v, `${plN}의 자리 아래 수를 모두 0으로 바꿔요.`, v <= n && n - v < pl); }
    if (k === 'round') { const v = Math.round(n / pl) * pl; const below = Math.floor(n / (pl / 10)) % 10; return P(`${n}을(를) 반올림하여 ${plN}의 자리까지 나타내면 ${B}이에요.`, v, `바로 아래 자리 숫자가 ${below}(이)라서 ${below >= 5 ? '올림' : '버림'}해요.`, Math.abs(v - n) <= pl / 2); }
    if (k === 'range') { const a = r.int(10, 40), b = a + r.int(3, 9); const ty = r.pick([['이상', '이하', b - a + 1], ['이상', '미만', b - a], ['초과', '이하', b - a], ['초과', '미만', b - a - 1]]); return P(`${a} ${ty[0]} ${b} ${ty[1]}인 자연수는 모두 ${B}개예요.`, `${ty[2]}개`, `이상·이하는 그 수를 포함하고, 초과·미만은 포함하지 않아요.`); }
    const p = r.int(101, 999); return P(`학생 ${p}명에게 공책을 1권씩 주려고 해요. 공책을 10권씩 묶음으로만 산다면 최소 몇 묶음을 사야 할까요?`, `${Math.ceil(p / 10)}묶음`, `모자라면 안 되니 올림해요: ${p} → ${Math.ceil(p / 10) * 10}`, true, true);
  };
  // 5-2 분수의 곱셈
  G.fracmul = (r, d) => {
    const k = r.pick(d === 1 ? ['fn', 'nf'] : d === 2 ? ['ff', 'fn'] : ['mm', 'ff']);
    const d1 = r.int(2, 9), n1 = r.int(1, d1 - 1), d2 = r.int(2, 9), n2 = r.int(1, d2 - 1), m = r.int(2, 9);
    if (k === 'fn') return P(`${F(n1, d1)} × ${m} = ${B}`, frac(n1 * m, d1), `분자에 ${m}을(를) 곱하고 약분해요.`);
    if (k === 'nf') return P(`${m} × ${F(n1, d1)} = ${B}`, frac(m * n1, d1), `자연수와 분자를 곱하고 약분해요.`);
    if (k === 'ff') return P(`${F(n1, d1)} × ${F(n2, d2)} = ${B}`, frac(n1 * n2, d1 * d2), `분자끼리, 분모끼리 곱해요.`);
    const w1 = r.int(1, 3), w2 = r.int(1, 2);
    return P(`${w1}${F(n1, d1)} × ${w2}${F(n2, d2)} = ${B}`, frac((w1 * d1 + n1) * (w2 * d2 + n2), d1 * d2), `대분수를 가분수로 바꿔서 곱해요.`);
  };
  // 5-2 소수의 곱셈
  G.decmul = (r, d) => {
    const k = r.pick(d === 1 ? ['dn'] : d === 2 ? ['dn', 'dd'] : ['dd', 'word']);
    if (k === 'dn') { const a = r.int(11, 99), m = r.int(2, 9); return P(`${dec(a, 1)} × ${m} = ${B}`, dec(a * m, 1), `${a} × ${m} = ${a * m}이고 소수점을 한 자리 옮겨요.`); }
    if (k === 'dd') { const a = r.int(11, 99), b = r.int(11, 99); return P(`${dec(a, 1)} × ${dec(b, 1)} = ${B}`, dec(a * b, 2), `${a} × ${b} = ${a * b}이고 소수점 아래 자리 수는 1 + 1 = 2개예요.`, Math.abs(parseFloat(dec(a, 1)) * parseFloat(dec(b, 1)) - parseFloat(dec(a * b, 2))) < 1e-9); }
    const a = r.int(12, 45), m = r.int(3, 9); return P(`한 병에 ${dec(a, 1)} L씩 들어 있는 물이 ${m}병 있어요. 물은 모두 몇 L일까요?`, `${dec(a * m, 1)} L`, `${dec(a, 1)} × ${m} = ${dec(a * m, 1)}`, true, true);
  };
  // 5-2 평균
  G.avg = (r, d) => {
    const n = d === 1 ? 3 : r.int(4, 5), avg = r.int(d === 1 ? 5 : 20, d === 3 ? 95 : 60);
    const arr = []; let sum = 0; for (let i = 0; i < n - 1; i++) { const v = avg + r.int(-8, 8); arr.push(v); sum += v; } arr.push(avg * n - sum);
    if (arr[n - 1] <= 0) return G.avg(r, d);
    if (d === 3) { const nm_ = nm(r); return P(`${nmI(nm_)}의 수학 점수가 ${arr.slice(0, n - 1).join('점, ')}점이에요. ${n}번의 평균이 ${avg}점이 되려면 마지막 시험은 몇 점이어야 할까요?`, `${arr[n - 1]}점`, `${avg} × ${n} = ${avg * n}에서 나머지 점수의 합을 빼요.`, arr.reduce((x, y) => x + y) === avg * n, true); }
    return P(`${arr.join(', ')}의 평균은 ${B}이에요.`, avg, `(자료 값의 합) ÷ (자료의 수) = ${avg * n} ÷ ${n}`, arr.reduce((x, y) => x + y) / n === avg);
  };
  // 6-1 분수의 나눗셈 (분수 ÷ 자연수)
  G.fracdiv1 = (r, d) => {
    const dn = r.int(2, 9), nu = r.int(1, dn * (d === 3 ? 3 : 1) - 1), m = r.int(2, 9);
    if (d === 1) { const q = r.int(1, 4), n2 = q * m; const dd = r.int(n2 + 1, n2 + 9); return P(`${F(n2, dd)} ÷ ${m} = ${B}`, frac(q, dd), `분자 ${n2}을(를) ${m}(으)로 나누어요.`, n2 / m === q); }
    if (d === 3) { const w = r.int(1, 3), n = r.int(1, dn - 1); return P(`${w}${F(n, dn)} ÷ ${m} = ${B}`, frac(w * dn + n, dn * m), `대분수를 가분수로 바꾸고 ${F(1, m)}을(를) 곱해요.`); }
    return P(`${F(nu, dn)} ÷ ${m} = ${B}`, frac(nu, dn * m), `÷ ${m}은 × ${F(1, m)}과 같아요.`);
  };
  // 6-1 소수의 나눗셈 (소수 ÷ 자연수)
  G.decdiv1 = (r, d) => {
    const m = r.int(2, 9), q = r.int(d === 1 ? 11 : 101, d === 1 ? 99 : 999), s = d === 1 ? 1 : 2; const a = q * m;
    return P(`${dec(a, s)} ÷ ${m} = ${B}`, dec(q, s), `${a} ÷ ${m} = ${q}이고 소수점 위치는 그대로예요.`, q * m === a);
  };
  // 6-1 비와 비율
  G.ratio = (r, d) => {
    const k = r.pick(d === 1 ? ['frac', 'dec'] : d === 2 ? ['pct', 'dec'] : ['pct', 'base', 'word']);
    const b = r.pick([2, 4, 5, 10, 20, 25, 50]), a = r.int(1, b - 1);
    if (k === 'frac') return P(`${a} : ${b}의 비율을 분수로 나타내면 ${B}예요.`, frac(a, b, false), `(비교하는 양) ÷ (기준량) = ${a} ÷ ${b}`);
    if (k === 'dec') return P(`${a} : ${b}의 비율을 소수로 나타내면 ${B}예요.`, dec(a * 100 / b, 2), `${a} ÷ ${b} = ${dec(a * 100 / b, 2)}`, Number.isInteger(a * 100 / b));
    if (k === 'pct') return P(`${a} : ${b}의 비율을 백분율로 나타내면 ${B}%예요.`, `${a * 100 / b}%`, `비율에 100을 곱해요: ${a} ÷ ${b} × 100`, Number.isInteger(a * 100 / b));
    if (k === 'base') { const base = r.int(1, 20) * 20, pc = r.pick([10, 20, 25, 30, 40, 50, 60, 75]); return P(`${base}의 ${pc}%는 ${B}이에요.`, base * pc / 100, `${base} × ${pc} ÷ 100`, Number.isInteger(base * pc / 100)); }
    const price = r.int(2, 20) * 1000, pc = r.pick([10, 20, 25, 30]); return P(`${fmt(price)}원짜리 장난감을 ${pc}% 할인해서 사면 얼마를 내야 할까요?`, `${fmt(price * (100 - pc) / 100)}원`, `할인 금액 ${fmt(price * pc / 100)}원을 빼요.`, true, true);
  };
  // 6-1 직육면체의 부피와 겉넓이
  G.cuboid = (r, d) => {
    const a = r.int(2, 12), b = r.int(2, 12), c = r.int(2, 12);
    const k = r.pick(d === 1 ? ['vol', 'cube'] : d === 2 ? ['vol', 'surf'] : ['surf', 'cubeS', 'm3']);
    if (k === 'vol') return P(`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 부피는 ${B} cm³예요.`, `${a * b * c} cm³`, `(가로) × (세로) × (높이)`);
    if (k === 'cube') return P(`한 모서리가 ${a} cm인 정육면체의 부피는 ${B} cm³예요.`, `${a * a * a} cm³`, `${a} × ${a} × ${a}`);
    if (k === 'cubeS') return P(`한 모서리가 ${a} cm인 정육면체의 겉넓이는 ${B} cm²예요.`, `${a * a * 6} cm²`, `(한 면의 넓이) × 6 = ${a * a} × 6`);
    if (k === 'm3') { const x = r.int(1, 5); return P(`${x} m³는 ${B} cm³예요.`, `${fmt(x * 1000000)} cm³`, `1 m³ = 1,000,000 cm³예요.`); }
    return P(`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 겉넓이는 ${B} cm²예요.`, `${2 * (a * b + b * c + a * c)} cm²`, `(세 면의 넓이의 합) × 2 = (${a * b} + ${b * c} + ${a * c}) × 2`);
  };
  // 6-2 분수의 나눗셈 (분수 ÷ 분수)
  G.fracdiv2 = (r, d) => {
    if (d === 1) { const dn = r.int(3, 12), a = r.int(2, dn - 1), b = r.int(1, a - 1); return P(`${F(a, dn)} ÷ ${F(b, dn)} = ${B}`, frac(a, b), `분모가 같으면 분자끼리 나누어요: ${a} ÷ ${b}`); }
    const d1 = r.int(2, 9), n1 = r.int(1, d1 - 1), d2 = r.int(2, 9), n2 = r.int(1, d2 - 1);
    if (d === 3) { const w = r.int(1, 3); return P(`${w}${F(n1, d1)} ÷ ${F(n2, d2)} = ${B}`, frac((w * d1 + n1) * d2, d1 * n2), `대분수를 가분수로 바꾸고 나누는 분수의 분모와 분자를 바꾸어 곱해요.`); }
    return P(`${F(n1, d1)} ÷ ${F(n2, d2)} = ${B}`, frac(n1 * d2, d1 * n2), `${F(n1, d1)} × ${F(d2, n2)}(으)로 계산해요.`);
  };
  // 6-2 소수의 나눗셈 (소수 ÷ 소수)
  G.decdiv2 = (r, d) => {
    if (d === 1) { const b = r.int(2, 9), q = r.int(2, 30), a = b * q; return P(`${dec(a, 1)} ÷ ${dec(b, 1)} = ${B}`, q, `둘 다 10배 해서 ${a} ÷ ${b}(으)로 계산해요.`, a / b === q); }
    const b = r.int(11, 99), q = r.int(2, d === 3 ? 60 : 20), a = b * q; const s = d === 3 ? 2 : 1;
    return P(`${dec(a, s)} ÷ ${dec(b, s)} = ${B}`, q, `둘 다 ${s === 2 ? 100 : 10}배 해서 ${a} ÷ ${b}(으)로 계산해요.`, a / b === q);
  };
  // 6-2 비례식과 비례배분
  G.prop = (r, d) => {
    const k = r.pick(d === 1 ? ['simple'] : d === 2 ? ['simple', 'share'] : ['share', 'word']);
    const a = r.int(1, 9), b = r.int(1, 9), m = r.int(2, 9);
    if (k === 'simple') { const pos = r.int(0, 1); return pos ? P(`${a} : ${b} = ${a * m} : ${B}`, b * m, `전항에 ${m}을(를) 곱했으니 후항에도 ${m}을(를) 곱해요.`, a * (b * m) === b * (a * m)) : P(`${a} : ${b} = ${B} : ${b * m}`, a * m, `외항의 곱과 내항의 곱이 같아요.`, a * (b * m) === b * (a * m)); }
    const tot = (a + b) * r.int(2, 12);
    if (k === 'share') return P(`${tot}을(를) ${a} : ${b}(으)로 비례배분하면 ${B}, ${B}예요.`, `${tot * a / (a + b)}, ${tot * b / (a + b)}`, `${tot} × ${F(a, a + b)}, ${tot} × ${F(b, a + b)}`, (tot * a / (a + b)) + (tot * b / (a + b)) === tot);
    const it = r.pick(ITEMS); return P(`${it[0]} ${tot}${it[1]}를 형과 동생이 ${a} : ${b}(으)로 나누어 가지면 동생은 몇 ${it[1]}를 가질까요?`, `${tot * b / (a + b)}${it[1]}`, `${tot} × ${F(b, a + b)}`, Number.isInteger(tot * b / (a + b)), true);
  };
  // 6-2 원의 넓이 (원주율 3.14)
  G.circle = (r, d) => {
    const k = r.pick(d === 1 ? ['circ'] : d === 2 ? ['circ', 'area'] : ['area', 'diam', 'half']);
    const rad = r.int(2, 15);
    if (k === 'circ') return P(`지름이 ${rad * 2} cm인 원의 원주는 ${B} cm예요. (원주율 3.14)`, `${dec(rad * 2 * 314, 2)} cm`, `(지름) × 3.14 = ${rad * 2} × 3.14`);
    if (k === 'area') return P(`반지름이 ${rad} cm인 원의 넓이는 ${B} cm²예요. (원주율 3.14)`, `${dec(rad * rad * 314, 2)} cm²`, `(반지름) × (반지름) × 3.14 = ${rad} × ${rad} × 3.14`);
    if (k === 'half') { const rr = rad % 2 ? rad + 1 : rad; return P(`반지름이 ${rr} cm인 반원의 넓이는 ${B} cm²예요. (원주율 3.14)`, `${dec(rr * rr * 314 / 2, 2)} cm²`, `원의 넓이를 2로 나누어요.`, Number.isInteger(rr * rr * 314 / 2)); }
    return P(`원주가 ${dec(rad * 2 * 314, 2)} cm인 원의 지름은 ${B} cm예요. (원주율 3.14)`, `${rad * 2} cm`, `(원주) ÷ 3.14 = (지름)`);
  };

  // ---------- 단원표 (2022 개정 교육과정, 1~2학년 국정 / 3~6학년은 출판사마다 단원 이름·순서가 조금 다를 수 있음) ----------
  const U = (name, area, gen) => ({ name, area, gen: gen || null });
  const CURRICULUM = {
    '1-1': [U('9까지의 수', '수와 연산', 'n9'), U('여러 가지 모양', '도형과 측정'), U('덧셈과 뺄셈', '수와 연산', 'as9'), U('비교하기', '도형과 측정'), U('50까지의 수', '수와 연산', 'n50')],
    '1-2': [U('100까지의 수', '수와 연산', 'n100'), U('덧셈과 뺄셈(1)', '수와 연산', 'as1'), U('여러 가지 모양', '도형과 측정'), U('덧셈과 뺄셈(2)', '수와 연산', 'as2'), U('시계 보기와 규칙 찾기', '변화와 관계', 'rule1'), U('덧셈과 뺄셈(3)', '수와 연산', 'as3')],
    '2-1': [U('세 자리 수', '수와 연산', 'n1000'), U('여러 가지 도형', '도형과 측정'), U('덧셈과 뺄셈', '수와 연산', 'as2d'), U('길이 재기', '도형과 측정', 'cm'), U('분류하기', '자료와 가능성'), U('곱셈', '수와 연산', 'mul1')],
    '2-2': [U('네 자리 수', '수와 연산', 'n10000'), U('곱셈구구', '수와 연산', 'gugu'), U('길이 재기', '도형과 측정', 'mcm'), U('시각과 시간', '도형과 측정', 'time2'), U('표와 그래프', '자료와 가능성'), U('규칙 찾기', '변화와 관계', 'rule2')],
    '3-1': [U('덧셈과 뺄셈', '수와 연산', 'as3d'), U('평면도형', '도형과 측정'), U('나눗셈', '수와 연산', 'div1'), U('곱셈', '수와 연산', 'mul21'), U('길이와 시간', '도형과 측정', 'lentime'), U('분수와 소수', '수와 연산', 'fracdec')],
    '3-2': [U('곱셈', '수와 연산', 'mul2'), U('나눗셈', '수와 연산', 'div2'), U('원', '도형과 측정'), U('분수', '수와 연산', 'frac3'), U('들이와 무게', '도형과 측정', 'volw'), U('자료의 정리', '자료와 가능성')],
    '4-1': [U('큰 수', '수와 연산', 'big'), U('각도', '도형과 측정', 'angle'), U('곱셈과 나눗셈', '수와 연산', 'muldiv4'), U('평면도형의 이동', '도형과 측정'), U('막대그래프', '자료와 가능성'), U('규칙 찾기', '변화와 관계', 'rule4')],
    '4-2': [U('분수의 덧셈과 뺄셈', '수와 연산', 'fracas4'), U('삼각형', '도형과 측정'), U('소수의 덧셈과 뺄셈', '수와 연산', 'decas4'), U('사각형', '도형과 측정'), U('꺾은선그래프', '자료와 가능성'), U('다각형', '도형과 측정', 'poly')],
    '5-1': [U('자연수의 혼합 계산', '수와 연산', 'mixed'), U('약수와 배수', '수와 연산', 'factor'), U('규칙과 대응', '변화와 관계', 'corr'), U('약분과 통분', '수와 연산', 'reduce'), U('분수의 덧셈과 뺄셈', '수와 연산', 'fracas5'), U('다각형의 둘레와 넓이', '도형과 측정', 'area')],
    '5-2': [U('수의 범위와 어림하기', '수와 연산', 'round'), U('분수의 곱셈', '수와 연산', 'fracmul'), U('합동과 대칭', '도형과 측정'), U('소수의 곱셈', '수와 연산', 'decmul'), U('직육면체', '도형과 측정'), U('평균과 가능성', '자료와 가능성', 'avg')],
    '6-1': [U('분수의 나눗셈', '수와 연산', 'fracdiv1'), U('각기둥과 각뿔', '도형과 측정'), U('소수의 나눗셈', '수와 연산', 'decdiv1'), U('비와 비율', '변화와 관계', 'ratio'), U('여러 가지 그래프', '자료와 가능성'), U('직육면체의 부피와 겉넓이', '도형과 측정', 'cuboid')],
    '6-2': [U('분수의 나눗셈', '수와 연산', 'fracdiv2'), U('소수의 나눗셈', '수와 연산', 'decdiv2'), U('공간과 입체', '도형과 측정'), U('비례식과 비례배분', '변화와 관계', 'prop'), U('원의 넓이', '도형과 측정', 'circle'), U('원기둥, 원뿔, 구', '도형과 측정')]
  };
  const ORDER = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2', '6-1', '6-2'];

  // 하루 10문제: 오늘 단원 7 + 이전 단원 복습 3
  // 복습: 단원 순서는 교과서마다 달라서, 이미 배운 것이 확실한 이전 학기(최대 두 학기 전)에서만 고른다
  function previousUnits(term, idx) {
    const list = []; const ti = ORDER.indexOf(term);
    for (let t = ti - 1; t >= Math.max(0, ti - 2); t--) {
      const units = CURRICULUM[ORDER[t]];
      for (let i = units.length - 1; i >= 0; i--) if (units[i].gen) list.push({ term: ORDER[t], idx: i, u: units[i] });
    }
    return list;
  }
  function makeDaily(opt) { // {term, idx, level, date, variant}
    const seed = hashStr([opt.date, opt.term, opt.idx, opt.level, opt.variant || 0].join('|'));
    const r = makeR(seed);
    const unit = CURRICULUM[opt.term][opt.idx];
    const out = [], seen = new Set();
    const add = (gen, lv, tag) => { for (let i = 0; i < 60; i++) { const L = i < 40 ? lv : (lv % 3) + 1; const p = G[gen](r, L); const key = p.q + '|' + p.a; if (seen.has(key)) continue; seen.add(key); out.push(Object.assign(p, { tag, gen })); return; } const p = G[gen](r, lv); out.push(Object.assign(p, { tag, gen })); };
    for (let i = 0; i < 7; i++) add(unit.gen, opt.level, '');
    const prev = previousUnits(opt.term, opt.idx);
    for (let i = 0; i < 3; i++) { const pu = prev.length ? prev[Math.floor(r.f() * prev.length)] : { term: opt.term, u: unit }; add(pu.u.gen, Math.max(1, opt.level - 1), `복습 · ${pu.term.replace('-', '학년 ')}학기 ${pu.u.name}`); }
    // 문장제는 뒤로, 복습은 맨 뒤 3문제
    const main = out.slice(0, 7).sort((a, b) => a.word - b.word), rev = out.slice(7);
    return { seed: seed.toString(36).toUpperCase().slice(-4), unit, problems: main.concat(rev) };
  }
  const api = { CURRICULUM, ORDER, G, makeR, makeDaily, previousUnits, frac, dec, gcd, lcm, hashStr };
  api.H = { P, B, F, frac, dec, gcd, lcm, fmt, nm, nmI, ITEMS, FOOD, seqProblem, fixJ };
  if (root.installPictures) root.installPictures(api);
  if (typeof module !== 'undefined') module.exports = api; else root.WS = api;
})(typeof window !== 'undefined' ? window : globalThis);
