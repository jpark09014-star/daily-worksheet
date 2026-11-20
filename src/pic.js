// 베타아빠 데일리 학습지 - 그림 문제(SVG). 그림은 모두 코드로 그리고, 정답은 그림을 만든 값에서 계산한다.
(function (root) {
  'use strict';
  root.installPictures = function (WS) {
    const { P, B, F, frac, dec, gcd, nm, nmI, fixJ } = WS.H;
    const G = WS.G, CUR = WS.CURRICULUM;
    const INK = '#4b3f8f', SOFT = '#cfc8ea', PINK = '#e0457b';
    const FILLS = ['#ffd0e1', '#cfe8ff', '#d6f5d6', '#fff0b3', '#e6dcff', '#ffe0c7'];
    const GA = ['가', '나', '다', '라', '마'];
    const svg = (w, h, body, mm) => `<svg class="pic" viewBox="0 0 ${w} ${h}" style="width:${mm}mm" xmlns="http://www.w3.org/2000/svg" font-family="Jua, Malgun Gothic, sans-serif">${body}</svg>`;
    const T = (x, y, s, size = 9, col = INK, anchor = 'middle') => `<text x="${x}" y="${y}" font-size="${size}" fill="${col}" text-anchor="${anchor}" dominant-baseline="central">${s}</text>`;
    const L = (x1, y1, x2, y2, col = INK, w = 1.6, dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
    const PG = (pts, fill = 'none', col = INK, w = 1.6, dash = '') => `<polygon points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="${fill}" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
    const C = (x, y, r, fill = 'none', col = INK, w = 1.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${col}" stroke-width="${w}"/>`;
    const tag = (x, y, s) => C(x, y, 6, '#fff', INK, 1.2) + T(x, y + .3, s, 8);
    const rad = (deg) => deg * Math.PI / 180;
    const mix = (...names) => (r, d) => G[r.pick(names)](r, d);
    const regPoly = (n, cx, cy, R, rot = -90) => Array.from({ length: n }, (_, i) => [cx + R * Math.cos(rad(rot + 360 * i / n)), cy + R * Math.sin(rad(rot + 360 * i / n))]);

    // ================= 시계 =================
    function clock(h, m) {
      let b = C(50, 50, 46, '#fff', INK, 3);
      for (let i = 0; i < 60; i++) { const a = rad(i * 6), r1 = 43, r2 = i % 5 ? 40.5 : 37.5; b += L(50 + Math.sin(a) * r1, 50 - Math.cos(a) * r1, 50 + Math.sin(a) * r2, 50 - Math.cos(a) * r2, INK, i % 5 ? .8 : 1.8); }
      for (let i = 1; i <= 12; i++) { const a = rad(i * 30); b += T(50 + Math.sin(a) * 29, 50 - Math.cos(a) * 29 + .5, i, 12.5); }
      const ha = rad(((h % 12) + m / 60) * 30), ma = rad(m * 6);
      b += L(50, 50, 50 + Math.sin(ha) * 21, 50 - Math.cos(ha) * 21, PINK, 4.2);
      b += L(50, 50, 50 + Math.sin(ma) * 33, 50 - Math.cos(ma) * 33, INK, 2.6);
      b += C(50, 50, 3, INK, INK, 1);
      return svg(100, 100, b, 27);
    }
    // 1-2: 몇 시, 몇 시 30분
    G.clock1 = (r, d) => {
      const h = r.int(1, 12), m = d === 1 ? 0 : r.pick([0, 30]);
      const shown = m ? `${h}시 30분` : `${h}시`;
      if (d === 3 && r.bool()) { const h2 = h % 12 + 1; return P(`시계가 나타내는 시각에서 1시간이 지나면 몇 시 몇 분일까요?${clock(h, m)}`, m ? `${h2}시 30분` : `${h2}시`, `지금은 ${shown}이에요. 짧은바늘이 숫자 한 칸을 더 가요.`, true); }
      return P(`시계가 나타내는 시각을 써 보세요.${clock(h, m)}`, shown, m ? `긴바늘이 6을 가리키면 30분이에요. 짧은바늘은 ${h}과(와) ${h % 12 + 1} 사이에 있어요.` : `긴바늘이 12, 짧은바늘이 ${h}을(를) 가리켜요.`, true);
    };
    // 2-2: 몇 시 몇 분 (5분, 1분), 몇 시 몇 분 전
    G.clock2 = (r, d) => {
      const h = r.int(1, 12);
      if (d === 3 && r.bool()) { const m = r.pick([45, 50, 55]); return P(`시계가 나타내는 시각은 몇 시 몇 분 전일까요?${clock(h, m)}`, `${h % 12 + 1}시 ${60 - m}분 전`, `${h}시 ${m}분은 ${h % 12 + 1}시가 되기 ${60 - m}분 전이에요.`, true); }
      const m = d === 1 ? r.int(1, 11) * 5 : r.int(1, 59);
      return P(`시계가 나타내는 시각을 써 보세요.${clock(h, m)}`, `${h}시 ${m}분`, m % 5 === 0 ? `긴바늘이 ${m / 5}을(를) 가리키면 ${m}분이에요.` : `긴바늘이 ${Math.floor(m / 5)}에서 작은 눈금 ${m % 5}칸 더 갔으니 ${m}분이에요.`, true);
    };

    // ================= 분수 막대 =================
    function bar(n, k, y, w = 120, h = 16, x = 4, fill = '#ffb3cf') {
      let b = ''; const cw = w / n;
      for (let i = 0; i < n; i++) b += `<rect x="${(x + i * cw).toFixed(2)}" y="${y}" width="${cw.toFixed(2)}" height="${h}" fill="${i < k ? fill : '#fff'}" stroke="${INK}" stroke-width="1.2"/>`;
      return b;
    }
    // 3-1 분수와 소수
    G.fbar1 = (r, d) => {
      const kind = r.pick(d === 1 ? ['part', 'part', 'un'] : d === 2 ? ['part', 'un', 'dec'] : ['dec', 'unitcmp', 'un']);
      if (kind === 'dec') { const k = r.int(1, 9); return P(`색칠한 부분을 소수로 나타내면 ${B}이에요.${svg(128, 22, bar(10, k, 3), 70)}`, `0.${k}`, `전체를 10칸으로 나눈 것 중 ${k}칸이니 ${F(k, 10)} = 0.${k}`, true); }
      if (kind === 'unitcmp') { let a = r.int(2, 8), b2 = r.int(2, 8); while (a === b2) b2 = r.int(2, 8); const body = T(8, 11, '가', 9) + bar(a, 1, 3, 112, 16, 16) + T(8, 33, '나', 9) + bar(b2, 1, 25, 112, 16, 16); return P(`색칠한 부분이 더 큰 것은 가와 나 중 어느 것일까요?${svg(132, 44, body, 72)}`, a < b2 ? '가' : '나', `가는 ${F(1, a)}, 나는 ${F(1, b2)}이에요. 똑같이 나눈 칸 수가 적을수록 한 칸이 커요.`, (1 / a > 1 / b2) === (a < b2)); }
      const n = r.int(2, 9), k = r.int(1, n - 1);
      if (kind === 'un') return P(`색칠하지 않은 부분은 전체의 몇 분의 몇일까요?${svg(128, 22, bar(n, k, 3), 70)}`, F(n - k, n), `전체 ${n}칸 중 색칠하지 않은 칸은 ${n - k}칸이에요.`, true);
      return P(`색칠한 부분은 전체의 몇 분의 몇일까요?${svg(128, 22, bar(n, k, 3), 70)}`, F(k, n), `전체를 똑같이 ${n}칸으로 나눈 것 중 ${k}칸이에요.`, true);
    };
    // 3-2 분수: 여러 막대로 가분수·대분수
    G.fbar2 = (r, d) => {
      const n = r.int(2, 6), w = r.int(1, 2), m = r.int(1, n - 1), t = w * n + m, bars = w + 1;
      let body = ''; for (let i = 0; i < bars; i++) body += bar(n, Math.min(n, t - i * n), 3 + i * 20, 110, 15);
      const pic = svg(120, bars * 20 + 2, body, 62);
      if (d === 1) return P(`색칠한 부분을 가분수로 나타내면 ${B}예요.<small class="opt">막대 하나가 1이에요</small>${pic}`, F(t, n), `${F(1, n)}이(가) ${t}칸이니 ${F(t, n)}이에요.`, t > n);
      return P(`색칠한 부분을 대분수로 나타내면 ${B}예요.<small class="opt">막대 하나가 1이에요</small>${pic}`, `${w}${F(m, n)}`, `꽉 찬 막대 ${w}개와 ${F(m, n)}이에요.`, w * n + m === t);
    };
    // 4-2 분수의 덧셈: 막대 두 개를 합하기
    G.fbar4 = (r, d) => {
      const n = r.int(4, 10), a = r.int(1, n - 1), b2 = r.int(1, n - 1);
      const body = T(8, 11, '가', 9) + bar(n, a, 3, 112, 16, 16) + T(8, 33, '나', 9) + bar(n, b2, 25, 112, 16, 16, '#a9d8ff');
      const s = a + b2;
      return P(`가와 나의 색칠한 부분을 더하면 얼마일까요?<small class="opt">막대 하나가 1이에요</small>${svg(132, 44, body, 72)}`, s > n ? `${Math.floor(s / n)}${s % n ? F(s % n, n) : ''}` : s === n ? '1' : F(s, n), `${F(a, n)} + ${F(b2, n)} = ${F(s, n)}${s >= n ? `, ${n}칸이 모이면 1이에요.` : ''}`, true);
    };

    // ================= 자 읽기 =================
    function ruler(lenMM, start, unitMM) { // unitMM: 1이면 mm 눈금까지
      const cm = Math.ceil((start + lenMM) / 10) + 1, px = 10; // 1cm = 10px
      let b = `<rect x="4" y="${30}" width="${cm * px + 8}" height="20" rx="2" fill="#fff8d6" stroke="${INK}" stroke-width="1.2"/>`;
      for (let i = 0; i <= cm * 10; i++) { const x = 8 + i * px / 10; const big = i % 10 === 0, mid = i % 5 === 0; if (!big && unitMM > 1 && !mid) continue; b += L(x, 30, x, 30 + (big ? 8 : mid ? 5.5 : 3.5), INK, big ? 1 : .6); if (big) b += T(x, 44, i / 10, 6); }
      b += `<rect x="${8 + start}" y="12" width="${lenMM}" height="12" rx="3" fill="#a9d8ff" stroke="${INK}" stroke-width="1"/>`;
      b += L(8 + start, 24, 8 + start, 30, INK, .6, '1.5 1.5') + L(8 + start + lenMM, 24, 8 + start + lenMM, 30, INK, .6, '1.5 1.5');
      return svg(cm * px + 16, 54, b, Math.min(80, (cm * px + 16) * .55));
    }
    G.ruler2 = (r, d) => { // 2-1 cm
      const len = r.int(3, 9), st = d === 1 ? 0 : r.int(1, 3);
      return P(`막대의 길이는 몇 cm일까요?${ruler(len * 10, st * 10, 10)}`, `${len} cm`, st ? `${st}에서 ${st + len}까지 1 cm가 ${len}번이에요.` : `0에서 ${len}까지예요.`, true);
    };
    G.ruler3 = (r, d) => { // 3-1 mm
      const len = r.int(21, 89), st = d === 1 ? 0 : r.int(1, 2) * 10;
      return P(`막대의 길이는 몇 cm 몇 mm일까요?${ruler(len, st, 1)}`, `${Math.floor(len / 10)} cm ${len % 10} mm`, `큰 눈금 ${Math.floor(len / 10)}칸과 작은 눈금 ${len % 10}칸이에요.`, true);
    };

    // 그림 문제 2~4는 아래에 이어서 정의 (pic2)
    if (root.installPictures2) root.installPictures2(WS, { svg, T, L, PG, C, tag, rad, mix, regPoly, INK, SOFT, PINK, FILLS, GA, bar });

    // ---------- 단원 연결 ----------
    const setGen = (term, name, gen) => { const u = CUR[term].find(x => x.name === name); if (!u) throw new Error('no unit ' + term + ' ' + name); G[gen] = G[gen] || null; u.gen = gen; };
    G.clockrule = (r, d) => r.bool(0.6) ? G.clock1(r, d) : G.rule1(r, d);
    G.time2mix = (r, d) => r.bool(0.5) ? G.clock2(r, d) : G.time2(r, d);
    G.fracdecmix = (r, d) => r.bool(0.5) ? G.fbar1(r, d) : G.fracdec(r, d);
    G.frac3mix = (r, d) => r.bool(0.4) ? G.fbar2(r, d) : G.frac3(r, d);
    G.fracas4mix = (r, d) => (d < 3 && r.bool(0.35)) ? G.fbar4(r, d) : G.fracas4(r, d);
    G.cmmix = (r, d) => r.bool(0.5) ? G.ruler2(r, d) : G.cm(r, d);
    G.lentimemix = (r, d) => r.bool(0.3) ? G.ruler3(r, d) : G.lentime(r, d);
    setGen('1-2', '시계 보기와 규칙 찾기', 'clockrule');
    setGen('2-2', '시각과 시간', 'time2mix');
    setGen('3-1', '분수와 소수', 'fracdecmix');
    setGen('3-2', '분수', 'frac3mix');
    setGen('4-2', '분수의 덧셈과 뺄셈', 'fracas4mix');
    setGen('2-1', '길이 재기', 'cmmix');
    setGen('3-1', '길이와 시간', 'lentimemix');
    if (root.linkPictures2) root.linkPictures2(WS, setGen);
  };
  if (typeof module !== 'undefined') module.exports = root.installPictures;
})(typeof window !== 'undefined' ? window : globalThis);
