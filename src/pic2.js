// 베타아빠 데일리 학습지 - 그림 문제 2 (도형·측정·자료 단원). pic.js가 불러서 설치한다.
(function (root) {
  'use strict';
  root.installPictures2 = function (WS, K) {
    const { P, B, F, gcd } = WS.H;
    const G = WS.G;
    const { svg, T, L, PG, C, tag, rad, regPoly, INK, PINK, FILLS, GA } = K;
    const cnt = (arr, f) => arr.filter(f).length;
    const uniqMax = (vals) => { const mx = Math.max(...vals); return vals.filter(v => v === mx).length === 1; };
    const uniqMin = (vals) => { const mn = Math.min(...vals); return vals.filter(v => v === mn).length === 1; };
    const distinct = (r, n, lo, hi) => { const s = new Set(); while (s.size < n) s.add(r.int(lo, hi)); return [...s]; };

    // ================= 1-1 여러 가지 모양 (입체) =================
    function solid(type, x, y, s, fill) {
      if (type === 'box') { const d = s * .35; return PG([[x, y + d], [x + s, y + d], [x + s, y + s + d], [x, y + s + d]], fill) + PG([[x, y + d], [x + d, y], [x + s + d, y], [x + s, y + d]], fill) + PG([[x + s, y + d], [x + s + d, y], [x + s + d, y + s], [x + s, y + s + d]], fill); }
      if (type === 'cyl') { const rx = s / 2, ry = s * .18, cx = x + rx + 2; return `<path d="M${cx - rx},${y + ry} L${cx - rx},${y + s + ry} A${rx},${ry} 0 0 0 ${cx + rx},${y + s + ry} L${cx + rx},${y + ry}" fill="${fill}" stroke="${INK}" stroke-width="1.6"/>` + `<ellipse cx="${cx}" cy="${y + ry}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${INK}" stroke-width="1.6"/>`; }
      const R = s * .6, cx = x + s * .6, cy = y + s * .7; return C(cx, cy, R, fill) + `<ellipse cx="${cx - R * .35}" cy="${cy - R * .4}" rx="${R * .22}" ry="${R * .13}" fill="#fff" opacity=".8"/>`;
    }
    const SOLID = { box: '상자 모양', cyl: '둥근기둥 모양', ball: '공 모양' };
    G.solid1 = (r, d) => {
      const n = r.int(5, 8), types = Array.from({ length: n }, () => r.pick(['box', 'cyl', 'ball']));
      let b = ''; types.forEach((t, i) => { b += solid(t, 6 + (i % 4) * 30, 6 + Math.floor(i / 4) * 32, 20, FILLS[i % FILLS.length]); });
      const pic = svg(124, Math.ceil(n / 4) * 32 + 6, b, 66);
      const kind = r.pick(d === 1 ? ['count'] : d === 2 ? ['count', 'roll'] : ['roll', 'most', 'stack']);
      if (kind === 'roll') { const c = cnt(types, t => t !== 'box'); return P(`그림에서 잘 굴러가는 모양은 모두 몇 개일까요?${pic}`, `${c}개`, `둥근기둥 모양과 공 모양은 둥근 부분이 있어서 잘 굴러가요.`, true); }
      if (kind === 'stack') { const c = cnt(types, t => t !== 'ball'); return P(`그림에서 위로 쌓을 수 있는 모양은 모두 몇 개일까요?${pic}`, `${c}개`, `평평한 부분이 있는 상자 모양과 둥근기둥 모양은 쌓을 수 있어요.`, true); }
      if (kind === 'most') { const cs = ['box', 'cyl', 'ball'].map(t => cnt(types, x => x === t)); if (!uniqMax(cs)) return G.solid1(r, d); const t = ['box', 'cyl', 'ball'][cs.indexOf(Math.max(...cs))]; return P(`그림에서 가장 많은 모양은 무엇일까요?${pic}`, SOLID[t], `상자 ${cs[0]}개, 둥근기둥 ${cs[1]}개, 공 ${cs[2]}개예요.`, true); }
      const t = r.pick(types); return P(`그림에서 ${SOLID[t]}은 몇 개일까요?${pic}`, `${cnt(types, x => x === t)}개`, `${SOLID[t]}을 하나씩 짚으며 세어요.`, true);
    };
    // ================= 1-2 여러 가지 모양 (평면) =================
    function flat(type, x, y, s, fill, rot) {
      if (type === 'rect') return `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})">${PG([[x, y + s * .15], [x + s, y + s * .15], [x + s, y + s * .85], [x, y + s * .85]], fill)}</g>`;
      if (type === 'tri') return `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})">${PG([[x + s / 2, y], [x + s, y + s], [x, y + s]], fill)}</g>`;
      return C(x + s / 2, y + s / 2, s / 2, fill);
    }
    const FLAT = { rect: '네모 모양', tri: '세모 모양', circ: '동그라미 모양' };
    G.flat1 = (r, d) => {
      const n = r.int(6, 9), types = Array.from({ length: n }, () => r.pick(['rect', 'tri', 'circ']));
      let b = ''; types.forEach((t, i) => { b += flat(t, 6 + (i % 5) * 24, 6 + Math.floor(i / 5) * 26, 17, FILLS[(i + 2) % FILLS.length], r.pick([0, 0, 15, -20, 30])); });
      const pic = svg(124, Math.ceil(n / 5) * 26 + 6, b, 66);
      const kind = r.pick(d === 1 ? ['count'] : d === 2 ? ['count', 'pointy3'] : ['nopoint', 'pointy3', 'most']);
      if (kind === 'pointy3') return P(`뾰족한 곳이 3군데인 모양은 몇 개일까요?${pic}`, `${cnt(types, t => t === 'tri')}개`, `세모 모양은 뾰족한 곳이 3군데예요.`, true);
      if (kind === 'nopoint') return P(`뾰족한 곳이 없는 모양은 몇 개일까요?${pic}`, `${cnt(types, t => t === 'circ')}개`, `동그라미 모양은 뾰족한 곳이 없어요.`, true);
      if (kind === 'most') { const cs = ['rect', 'tri', 'circ'].map(t => cnt(types, x => x === t)); if (!uniqMax(cs)) return G.flat1(r, d); return P(`그림에서 가장 많은 모양은 무엇일까요?${pic}`, FLAT[['rect', 'tri', 'circ'][cs.indexOf(Math.max(...cs))]], `네모 ${cs[0]}개, 세모 ${cs[1]}개, 동그라미 ${cs[2]}개예요.`, true); }
      const t = r.pick(types); return P(`그림에서 ${FLAT[t]}은 몇 개일까요?${pic}`, `${cnt(types, x => x === t)}개`, `${FLAT[t]}만 골라 세어요.`, true);
    };
    // ================= 1-1 비교하기 =================
    G.compare1 = (r, d) => {
      const kind = r.pick(['len', 'tall', 'water', 'seesaw', 'area']);
      const most = r.bool();
      if (kind === 'len') { const v = distinct(r, 3, 4, 11); let b = ''; v.forEach((x, i) => { b += T(8, 10 + i * 16, GA[i], 9) + `<rect x="18" y="${4 + i * 16}" width="${x * 9}" height="10" rx="4" fill="${FILLS[i]}" stroke="${INK}" stroke-width="1.2"/>` + PG([[18 + x * 9, 4 + i * 16], [18 + x * 9 + 8, 9 + i * 16], [18 + x * 9, 14 + i * 16]], '#ffe0a3'); }); const idx = most ? v.indexOf(Math.max(...v)) : v.indexOf(Math.min(...v)); return P(`가장 ${most ? '긴' : '짧은'} 연필은 어느 것일까요?${svg(130, 52, b, 68)}`, GA[idx], `왼쪽 끝이 맞추어져 있으니 오른쪽 끝을 비교해요.`, true); }
      if (kind === 'tall') { const v = distinct(r, 3, 2, 6); let b = ''; v.forEach((x, i) => { for (let k = 0; k < x; k++) b += `<rect x="${12 + i * 36}" y="${66 - (k + 1) * 10}" width="22" height="10" fill="${FILLS[i]}" stroke="${INK}" stroke-width="1"/>`; b += T(23 + i * 36, 74, GA[i], 9); }); b += L(4, 66, 112, 66); const idx = most ? v.indexOf(Math.max(...v)) : v.indexOf(Math.min(...v)); return P(`가장 ${most ? '높이' : '낮게'} 쌓은 것은 어느 것일까요?${svg(116, 80, b, 50)}`, GA[idx], `바닥이 같으니 위쪽 끝을 비교해요.`, true); }
      if (kind === 'water') { const v = distinct(r, 3, 2, 9); let b = ''; v.forEach((x, i) => { const cx = 10 + i * 36; b += `<rect x="${cx}" y="${54 - x * 4.5}" width="24" height="${x * 4.5}" fill="#a9d8ff"/>` + `<path d="M${cx},10 L${cx},54 L${cx + 24},54 L${cx + 24},10" fill="none" stroke="${INK}" stroke-width="1.6"/>` + T(cx + 12, 62, GA[i], 9); }); const idx = most ? v.indexOf(Math.max(...v)) : v.indexOf(Math.min(...v)); return P(`물이 가장 ${most ? '많이' : '적게'} 담긴 컵은?<small class="opt">컵의 모양과 크기는 같아요</small>${svg(116, 68, b, 52)}`, GA[idx], `컵이 같으니 물의 높이를 비교해요.`, true); }
      if (kind === 'area') { const a = [r.int(3, 5), r.int(2, 4)], bb = [r.int(2, 6), r.int(2, 5)]; if (a[0] * a[1] === bb[0] * bb[1] || Math.abs(a[0] * a[1] - bb[0] * bb[1]) < 4) return G.compare1(r, d); let b = ''; const sq = (x0, w, h, f) => { let s = ''; for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) s += `<rect x="${x0 + i * 8}" y="${6 + j * 8}" width="8" height="8" fill="${f}" stroke="${INK}" stroke-width=".8"/>`; return s; }; b += sq(6, a[0], a[1], FILLS[0]) + T(6 + a[0] * 4, 60, '가', 9) + sq(70, bb[0], bb[1], FILLS[1]) + T(70 + bb[0] * 4, 60, '나', 9); const big = a[0] * a[1] > bb[0] * bb[1] ? '가' : '나'; const ans = most ? big : (big === '가' ? '나' : '가'); return P(`더 ${most ? '넓은' : '좁은'} 것은 어느 것일까요?${svg(124, 66, b, 56)}`, ans, `작은 칸을 세면 가는 ${a[0] * a[1]}칸, 나는 ${bb[0] * bb[1]}칸이에요.`, true); }
      const left = r.bool(); const tilt = left ? 8 : -8; const animals = r.pick([['곰', '토끼'], ['코끼리', '강아지'], ['사자', '고양이']]);
      let b = PG([[60, 52], [52, 64], [68, 64]], '#ffe0a3') + `<g transform="rotate(${-tilt} 60 50)">` + `<rect x="10" y="47" width="100" height="5" rx="2" fill="#c8b6ff" stroke="${INK}" stroke-width="1"/>` + C(22, 38, 9, FILLS[0]) + T(22, 38, '가', 8) + C(98, 38, 9, FILLS[1]) + T(98, 38, '나', 8) + '</g>';
      const heavy = left ? '가' : '나';
      return P(`시소에 가와 나가 탔어요. 더 ${most ? '무거운' : '가벼운'} 쪽은 어느 것일까요?${svg(120, 70, b, 54)}`, most ? heavy : (heavy === '가' ? '나' : '가'), `시소는 무거운 쪽이 아래로 내려가요.`, true);
    };
    // ================= 2-1 여러 가지 도형 =================
    function randPoly(r, n, cx, cy, R) { const base = r.int(0, 359); const pts = []; for (let i = 0; i < n; i++) { const a = base + 360 * i / n + r.int(-18, 18); const rr = R * (0.75 + r.f() * 0.25); pts.push([cx + rr * Math.cos(rad(a)), cy + rr * Math.sin(rad(a))]); } return pts; }
    G.shape2 = (r, d) => {
      const n = r.int(6, 8), types = Array.from({ length: n }, () => r.pick([3, 4, 0]));
      let b = ''; types.forEach((t, i) => { const cx = 14 + (i % 4) * 30, cy = 14 + Math.floor(i / 4) * 28; b += t ? PG(randPoly(r, t, cx, cy, 12), FILLS[i % 6]) : C(cx, cy, 11, FILLS[i % 6]); });
      const pic = svg(124, Math.ceil(n / 4) * 28 + 2, b, 66);
      const kind = r.pick(d === 1 ? ['tri', 'quad'] : d === 2 ? ['tri', 'quad', 'circ'] : ['vert', 'side']);
      if (kind === 'tri') return P(`그림에서 삼각형은 몇 개일까요?${pic}`, `${cnt(types, t => t === 3)}개`, `곧은 선 3개로 둘러싸인 도형이 삼각형이에요.`, true);
      if (kind === 'quad') return P(`그림에서 사각형은 몇 개일까요?${pic}`, `${cnt(types, t => t === 4)}개`, `곧은 선 4개로 둘러싸인 도형이 사각형이에요.`, true);
      if (kind === 'circ') return P(`그림에서 원은 몇 개일까요?${pic}`, `${cnt(types, t => t === 0)}개`, `어느 쪽에서 보아도 똑같이 둥근 모양이 원이에요.`, true);
      const t3 = cnt(types, t => t === 3), t4 = cnt(types, t => t === 4);
      if (kind === 'vert') return P(`그림에 있는 삼각형과 사각형의 꼭짓점은 모두 몇 개일까요?${pic}`, `${t3 * 3 + t4 * 4}개`, `삼각형 ${t3}개 × 3 + 사각형 ${t4}개 × 4`, true);
      return P(`그림에 있는 삼각형과 사각형의 변은 모두 몇 개일까요?${pic}`, `${t3 * 3 + t4 * 4}개`, `삼각형은 변이 3개, 사각형은 변이 4개예요. 원은 변이 없어요.`, true);
    };
    // ================= 2-1 분류하기 =================
    const COLS = [['빨간색', '#ff8a8a'], ['파란색', '#74c0fc'], ['노란색', '#ffe066']];
    G.classify2 = (r, d) => {
      const n = r.int(8, 10), items = Array.from({ length: n }, () => ({ s: r.pick(['circ', 'tri', 'rect']), c: r.int(0, 2) }));
      let b = ''; items.forEach((it, i) => { b += flat(it.s, 6 + (i % 5) * 24, 6 + Math.floor(i / 5) * 26, 17, COLS[it.c][1], 0); });
      const pic = svg(124, Math.ceil(n / 5) * 26 + 6, b, 66);
      const NAMES = { circ: '원', tri: '삼각형', rect: '사각형' };
      const kind = r.pick(d === 1 ? ['color', 'shape'] : d === 2 ? ['color', 'shape', 'both'] : ['both', 'mostcolor']);
      if (kind === 'color') { const c = r.int(0, 2); return P(`색깔로 분류했을 때 ${COLS[c][0]}은 몇 개일까요?${pic}`, `${cnt(items, x => x.c === c)}개`, `모양은 생각하지 않고 ${COLS[c][0]}만 세어요.`, true); }
      if (kind === 'shape') { const s = r.pick(['circ', 'tri', 'rect']); return P(`모양으로 분류했을 때 ${NAMES[s]}은 몇 개일까요?${pic}`, `${cnt(items, x => x.s === s)}개`, `색깔은 생각하지 않고 ${NAMES[s]}만 세어요.`, true); }
      if (kind === 'both') { const it = r.pick(items); return P(`${COLS[it.c][0]} ${NAMES[it.s]}은 몇 개일까요?${pic}`, `${cnt(items, x => x.c === it.c && x.s === it.s)}개`, `색깔과 모양을 모두 맞는 것만 세어요.`, true); }
      const cs = [0, 1, 2].map(c => cnt(items, x => x.c === c)); if (!uniqMax(cs)) return G.classify2(r, d);
      return P(`색깔로 분류했을 때 가장 많은 색깔은 무엇일까요?${pic}`, COLS[cs.indexOf(Math.max(...cs))][0], `빨간색 ${cs[0]}개, 파란색 ${cs[1]}개, 노란색 ${cs[2]}개예요.`, true);
    };
    // ================= 2-2 표와 그래프 (○ 그래프) =================
    const CATS = [['사과', '배', '포도', '귤'], ['봄', '여름', '가을', '겨울'], ['축구', '줄넘기', '피구', '달리기'], ['강아지', '고양이', '햄스터', '토끼']];
    G.graph2 = (r, d) => {
      const cats = r.pick(CATS), v = cats.map(() => r.int(1, 6)); if (!uniqMax(v)) return G.graph2(r, d);
      let b = ''; const top = 6, cell = 11;
      for (let j = 0; j <= 6; j++) b += L(30, top + j * cell, 30 + 4 * 24, top + j * cell, '#ddd6f3', .8);
      cats.forEach((c, i) => { const x = 42 + i * 24; for (let k = 0; k < v[i]; k++) b += C(x, top + (5 - k) * cell + cell / 2, 4, 'none', PINK, 1.4); b += T(x, top + 6 * cell + 8, c, 7); });
      for (let k = 1; k <= 6; k++) b += T(22, top + (6 - k) * cell + cell / 2, k, 6.5, '#8d86b8');
      const pic = svg(130, top + 6 * cell + 16, b, 64);
      const kind = r.pick(d === 1 ? ['val', 'most'] : d === 2 ? ['val', 'total', 'most'] : ['diff', 'total']);
      if (kind === 'val') { const i = r.int(0, 3); return P(`${cats[i]}을(를) 좋아하는 학생은 몇 명일까요?${pic}`, `${v[i]}명`, `${cats[i]} 위의 ○를 세어요.`, true); }
      if (kind === 'most') return P(`가장 많은 학생이 좋아하는 것은 무엇일까요?${pic}`, cats[v.indexOf(Math.max(...v))], `○가 가장 높이 쌓인 것을 찾아요.`, true);
      if (kind === 'total') return P(`조사한 학생은 모두 몇 명일까요?${pic}`, `${v.reduce((a, b2) => a + b2)}명`, `${v.join(' + ')} = ${v.reduce((a, b2) => a + b2)}`, true);
      let i = r.int(0, 3), j = r.int(0, 3); if (v[i] <= v[j]) { if (v[i] === v[j]) return G.graph2(r, d); [i, j] = [j, i]; }
      return P(`${cats[i]}을(를) 좋아하는 학생은 ${cats[j]}을(를) 좋아하는 학생보다 몇 명 더 많을까요?${pic}`, `${v[i] - v[j]}명`, `${v[i]} - ${v[j]} = ${v[i] - v[j]}`, true);
    };
    // ================= 3-1 평면도형 =================
    const dotGrid = (cols, rows, s, ox, oy) => { let b = ''; for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) b += C(ox + i * s, oy + j * s, .9, '#c9c1ec', '#c9c1ec', .4); return b; };
    G.plane3 = (r, d) => {
      const kind = r.pick(d === 1 ? ['line', 'right'] : d === 2 ? ['right', 'name'] : ['name', 'right', 'line']);
      if (kind === 'line') {
        const t = r.pick(['선분', '반직선', '직선']); const arrow = (x, y, dir) => PG([[x, y], [x - 6 * dir, y - 3.5], [x - 6 * dir, y + 3.5]], INK, INK, 1);
        let b = C(30, 20, 2.4, INK) + C(90, 20, 2.4, INK) + T(30, 31, 'ㄱ', 8) + T(90, 31, 'ㄴ', 8);
        if (t === '선분') b += L(30, 20, 90, 20, INK, 1.8); if (t === '반직선') b += L(30, 20, 114, 20, INK, 1.8) + arrow(118, 20, 1); if (t === '직선') b += L(6, 20, 114, 20, INK, 1.8) + arrow(118, 20, 1) + arrow(2, 20, -1);
        return P(`그림과 같은 곧은 선의 이름은?<small class="opt">선분·반직선·직선</small>${svg(122, 36, b, 62)}`, t, t === '선분' ? '두 점을 곧게 이은 선이에요.' : t === '반직선' ? '한 점에서 시작해 한쪽으로 끝없이 늘인 곧은 선이에요.' : '양쪽으로 끝없이 늘인 곧은 선이에요.', true);
      }
      const shapes = [['직사각형', [[0, 0], [5, 0], [5, 3], [0, 3]], 4], ['정사각형', [[0, 0], [3, 0], [3, 3], [0, 3]], 4], ['직각삼각형', [[0, 0], [0, 3], [4, 3]], 1], ['삼각형', [[1, 0], [4, 3], [0, 3]], 0], ['사다리꼴', [[0, 0], [3, 0], [5, 3], [0, 3]], 2], ['평행사변형', [[1, 0], [5, 0], [4, 3], [0, 3]], 0]];
      const pool = kind === 'name' ? shapes.slice(0, 3) : shapes; const [nmS, pts, rights] = r.pick(pool);
      const s = 12, ox = 10, oy = 6; const b = dotGrid(8, 3, s, ox, oy) + PG(pts.map(p => [ox + (p[0] + 1) * s, oy + p[1] * s]), '#ffe3ec');
      const pic = svg(116, 50, b, 58);
      if (kind === 'name') return P(`모눈 위의 도형의 이름은?<small class="opt">직사각형·정사각형·직각삼각형</small>${pic}`, nmS, nmS === '정사각형' ? '네 각이 모두 직각이고 네 변의 길이가 같아요.' : nmS === '직사각형' ? '네 각이 모두 직각이에요.' : '한 각이 직각인 삼각형이에요.', true);
      return P(`도형에서 직각은 모두 몇 개일까요?${pic}`, `${rights}개`, rights ? `점 모눈의 가로선과 세로선이 만나는 꼭짓점을 찾아요.` : `직각인 꼭짓점이 없어요.`, true);
    };
    // ================= 3-2 원 =================
    G.circle3 = (r, d) => {
      const kind = r.pick(d === 1 ? ['r2d', 'd2r'] : d === 2 ? ['r2d', 'd2r'] : ['row', 'r2d']);
      if (kind === 'row') { const n = r.int(2, 4), rr = r.int(2, 6); let b = `<rect x="6" y="6" width="${n * 28}" height="28" fill="none" stroke="${INK}" stroke-width="1.4"/>`; for (let i = 0; i < n; i++) b += C(20 + i * 28, 20, 14, '#e6dcff'); b += C(20, 20, 1.4, INK) + L(20, 20, 34, 20, PINK, 1.4) + T(27, 15, `${rr} cm`, 6.5, PINK); return P(`같은 원 ${n}개가 직사각형에 꼭 맞아요. 직사각형의 가로는?${svg(n * 28 + 12, 40, b, Math.min(78, (n * 28 + 12) * .6))}`, `${rr * 2 * n} cm`, `원의 지름은 ${rr * 2} cm이고 ${n}개가 이어져 있어요: ${rr * 2} × ${n}`, true); }
      const rr = r.int(2, 12);
      let b = C(40, 30, 24, '#fff7d6') + C(40, 30, 1.6, INK);
      if (kind === 'r2d') { b += L(40, 30, 64, 30, PINK, 1.6) + T(52, 24, `${rr} cm`, 7, PINK); return P(`원의 지름은 몇 cm일까요?${svg(80, 60, b, 40)}`, `${rr * 2} cm`, `지름은 반지름의 2배예요: ${rr} × 2 = ${rr * 2}`, true); }
      b += L(16, 30, 64, 30, PINK, 1.6) + T(40, 24, `${rr * 2} cm`, 7, PINK); return P(`원의 반지름은 몇 cm일까요?${svg(80, 60, b, 40)}`, `${rr} cm`, `반지름은 지름의 반이에요: ${rr * 2} ÷ 2 = ${rr}`, true);
    };
    // ================= 3-2 자료의 정리 (그림그래프) =================
    G.picgraph3 = (r, d) => {
      const rows = ['가', '나', '다', '라'].map(x => x + ' 마을'), v = rows.map(() => r.int(1, 4) * 10 + r.int(0, 6)); if (!uniqMax(v) || !uniqMin(v)) return G.picgraph3(r, d);
      let b = ''; rows.forEach((nm_, i) => { const y = 10 + i * 16; b += T(19, y, nm_, 9) + L(38, y - 8, 38, y + 8, '#ddd6f3', .8); let x = 46; for (let k = 0; k < Math.floor(v[i] / 10); k++) { b += C(x, y, 5.5, '#ff9fb8'); x += 12; } for (let k = 0; k < v[i] % 10; k++) { b += C(x, y + 1.5, 2.8, '#ff9fb8'); x += 6; } });
      b += C(48, 74, 5.5, '#ff9fb8') + T(68, 74, '10그루', 8) + C(92, 75.5, 2.8, '#ff9fb8') + T(107, 74, '1그루', 8);
      const pic = svg(140, 82, b, 70);
      const kind = r.pick(d === 1 ? ['val'] : d === 2 ? ['val', 'most'] : ['total', 'diff']);
      if (kind === 'val') { const i = r.int(0, 3); return P(`그림그래프에서 ${rows[i]}의 사과나무는 몇 그루일까요?${pic}`, `${v[i]}그루`, `큰 그림 ${Math.floor(v[i] / 10)}개, 작은 그림 ${v[i] % 10}개예요.`, true); }
      if (kind === 'most') return P(`사과나무가 가장 많은 마을은 어디일까요?${pic}`, rows[v.indexOf(Math.max(...v))], `큰 그림의 수를 먼저 비교해요.`, true);
      if (kind === 'total') return P(`네 마을의 사과나무는 모두 몇 그루일까요?${pic}`, `${v.reduce((a, c) => a + c)}그루`, `${v.join(' + ')} = ${v.reduce((a, c) => a + c)}`, true);
      const mx = Math.max(...v), mn = Math.min(...v); return P(`가장 많은 마을은 가장 적은 마을보다 몇 그루 더 많을까요?${pic}`, `${mx - mn}그루`, `${mx} - ${mn} = ${mx - mn}`, true);
    };
    // ================= 4-1 각도 =================
    function angleSVG(v, label) { const cx = 20, cy = 52, R = 46; let b = L(cx, cy, cx + R + 8, cy, INK, 1.8) + L(cx, cy, cx + (R + 8) * Math.cos(rad(-v)), cy + (R + 8) * Math.sin(rad(-v)), INK, 1.8); if (v === 90) b += `<path d="M${cx + 8},${cy} L${cx + 8},${cy - 8} L${cx},${cy - 8}" fill="none" stroke="${PINK}" stroke-width="1.2"/>`; else b += `<path d="M${cx + 12},${cy} A12,12 0 0 0 ${cx + 12 * Math.cos(rad(-v))},${cy + 12 * Math.sin(rad(-v))}" fill="none" stroke="${PINK}" stroke-width="1.4"/>`; if (label) b += T(cx + 22 * Math.cos(rad(-v / 2)), cy + 22 * Math.sin(rad(-v / 2)), label, 7, PINK); return b; }
    function protractor(v) { const cx = 60, cy = 58, R = 50; let b = `<path d="M${cx - R},${cy} A${R},${R} 0 0 1 ${cx + R},${cy} Z" fill="#fffbe6" stroke="${INK}" stroke-width="1.2"/>`; for (let a = 0; a <= 180; a += 5) { const big = a % 10 === 0; const x1 = cx + R * Math.cos(rad(180 - a)), y1 = cy - R * Math.sin(rad(180 - a)), x2 = cx + (R - (big ? 6 : 3.5)) * Math.cos(rad(180 - a)), y2 = cy - (R - (big ? 6 : 3.5)) * Math.sin(rad(180 - a)); b += L(x1, y1, x2, y2, INK, big ? .9 : .5); if (a % 30 === 0) b += T(cx + (R - 12) * Math.cos(rad(180 - a)), cy - (R - 12) * Math.sin(rad(180 - a)), a, 5.5); } b += L(cx - R - 4, cy, cx, cy, PINK, 1.8) + L(cx, cy, cx + (R + 4) * Math.cos(rad(180 - v)), cy - (R + 4) * Math.sin(rad(180 - v)), PINK, 1.8) + C(cx, cy, 1.6, INK); return svg(120, 64, b, 64); }
    G.angle4p = (r, d) => {
      const kind = r.pick(d === 1 ? ['cls'] : d === 2 ? ['cls', 'pro'] : ['pro', 'straight']);
      if (kind === 'cls') { const v = r.pick([r.int(20, 70), 90, r.int(110, 160)]); const ans = v < 90 ? '예각' : v === 90 ? '직각' : '둔각'; return P(`그림의 각은 무엇일까요?<small class="opt">예각·직각·둔각</small>${svg(80, 60, angleSVG(v), 40)}`, ans, ans === '예각' ? '직각보다 작은 각이에요.' : ans === '둔각' ? '직각보다 크고 180°보다 작은 각이에요.' : '90°인 각이에요.', true); }
      if (kind === 'pro') { const v = r.int(2, 34) * 5; return P(`각도기로 잰 각도는 몇 도일까요?${protractor(v)}`, `${v}°`, `0°에서 시작한 변을 따라 눈금을 세요.`, true); }
      const x = r.int(25, 155); const cx = 60, cy = 40; let b = L(6, cy, 114, cy, INK, 1.8) + L(cx, cy, cx + 44 * Math.cos(rad(-x)), cy + 44 * Math.sin(rad(-x)), INK, 1.8) + T(cx + 18 * Math.cos(rad(-x / 2)), cy + 18 * Math.sin(rad(-x / 2)) - 2, `${x}°`, 7, PINK) + T(cx + 18 * Math.cos(rad(-(x + 180) / 2)), cy + 18 * Math.sin(rad(-(x + 180) / 2)) - 2, '□', 8, PINK);
      return P(`곧은 선 위에 각이 있어요. □ 안에 알맞은 각도는 몇 도일까요?${svg(120, 48, b, 60)}`, `${180 - x}°`, `곧은 선이 이루는 각은 180°예요: 180 - ${x} = ${180 - x}`, true);
    };
    // ================= 4-1 평면도형의 이동 =================
    const POLY = [[[0, 0], [0, 1], [0, 2], [1, 2]], [[0, 0], [1, 0], [1, 1], [1, 2], [2, 1]], [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]], [[0, 0], [1, 0], [0, 1], [0, 2], [1, 2]].slice(0, 4).concat([[2, 0]]), [[0, 1], [1, 1], [1, 0], [2, 0], [1, 2]]];
    const norm = (cells) => { const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1])); return cells.map(c => [c[0] - mx, c[1] - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
    const keyOf = (cells) => norm(cells).map(c => c.join(',')).join(';');
    const TF = { flipH: c => c.map(([x, y]) => [-x, y]), flipV: c => c.map(([x, y]) => [x, -y]), cw: c => c.map(([x, y]) => [-y, x]), r180: c => c.map(([x, y]) => [-x, -y]), ccw: c => c.map(([x, y]) => [y, -x]), id: c => c.slice(), tr: c => c.map(([x, y]) => [y, x]), atr: c => c.map(([x, y]) => [-y, -x]) };
    function drawCells(cells, ox, oy, s, fill) { let b = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) b += `<rect x="${ox + i * s}" y="${oy + j * s}" width="${s}" height="${s}" fill="#fff" stroke="#ddd6f3" stroke-width=".6"/>`; norm(cells).forEach(([x, y]) => { b += `<rect x="${ox + x * s}" y="${oy + y * s}" width="${s}" height="${s}" fill="${fill}" stroke="${INK}" stroke-width="1"/>`; }); return b; }
    G.move4 = (r, d) => {
      let base = r.pick(POLY); if (r.bool()) base = TF.cw(base);
      const ops = d === 1 ? [['flipH', '오른쪽으로 뒤집은'], ['flipV', '아래쪽으로 뒤집은'], ['id', '왼쪽으로 민'], ['flipH', '왼쪽으로 뒤집은']] : d === 2 ? [['cw', '시계 방향으로 90°만큼 돌린'], ['r180', '시계 방향으로 180°만큼 돌린'], ['flipH', '왼쪽으로 뒤집은'], ['flipV', '위쪽으로 뒤집은'], ['ccw', '시계 반대 방향으로 90°만큼 돌린']] : [['ccw', '시계 반대 방향으로 90°만큼 돌린'], ['cw', '시계 방향으로 270°만큼 돌린'], ['flipV', '위쪽으로 뒤집은']];
      const [op, words] = r.pick(ops);
      const correct = TF[op === 'cw' && words.includes('270') ? 'ccw' : op](base);
      const keys = new Set([keyOf(correct)]); const opts = [correct];
      for (const o of r.shuffle(Object.keys(TF))) { if (opts.length === 4) break; const c = TF[o](base); const k = keyOf(c); if (!keys.has(k)) { keys.add(k); opts.push(c); } }
      if (opts.length < 4) return G.move4(r, d);
      const order = r.shuffle([0, 1, 2, 3]); const ansIdx = order.indexOf(0);
      const s = 5.2; let b = T(14, 6, '처음', 7) + drawCells(base, 4, 11, s, '#ffb3cf');
      order.forEach((oi, k) => { const ox = 36 + k * 25; b += T(ox + 10, 6, `${k + 1}번`, 7) + drawCells(opts[oi], ox, 11, s, '#a9d8ff'); });
      b += L(30, 8, 30, 34, '#ddd6f3', .8);
      const isFlipLR = /오른쪽으로 뒤집은|왼쪽으로 뒤집은/.test(words), isFlipUD = /아래쪽으로 뒤집은|위쪽으로 뒤집은/.test(words);
      return P(`처음 도형을 ${words} 도형은 몇 번일까요?${svg(136, 36, b, 80)}`, `${ansIdx + 1}번`, words.includes('민') ? '도형을 밀면 모양은 그대로이고 위치만 바뀌어요.' : isFlipLR ? '왼쪽·오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌어요.' : isFlipUD ? '위쪽·아래쪽으로 뒤집으면 위와 아래가 서로 바뀌어요.' : words.includes('180') ? '180° 돌리면 위아래와 왼쪽·오른쪽이 모두 바뀌어요.' : '돌린 방향으로 도형의 위쪽 부분이 어디로 가는지 따라가 봐요.', keyOf(opts[0]) === keyOf(correct));
    };
    // ================= 4-1 막대그래프 =================
    G.bar4 = (r, d) => {
      const cats = r.pick([['월', '화', '수', '목', '금'], ['국어', '수학', '과학', '영어'], ['빨강', '노랑', '초록', '파랑']]); const u = d === 1 ? 1 : r.pick([2, 5]);
      const v = cats.map(() => r.int(1, 8) * u); if (!uniqMax(v) || !uniqMin(v)) return G.bar4(r, d);
      const top = 6, H = 8, cell = 7.5, x0 = 22, bw = 14, gap = 22; let b = '';
      for (let j = 0; j <= H; j++) { b += L(x0, top + j * cell, x0 + cats.length * gap + 4, top + j * cell, '#e4def7', .6); if (j % 2 === 0 || u === 1) b += T(x0 - 6, top + (H - j) * cell, j * u, 5.5, '#8d86b8'); }
      cats.forEach((c, i) => { const h = v[i] / u * cell; b += `<rect x="${x0 + 6 + i * gap}" y="${top + H * cell - h}" width="${bw}" height="${h}" fill="${FILLS[i % 6]}" stroke="${INK}" stroke-width="1"/>` + T(x0 + 6 + i * gap + bw / 2, top + H * cell + 7, c, 6.5); });
      b += L(x0, top, x0, top + H * cell, INK, 1) + L(x0, top + H * cell, x0 + cats.length * gap + 4, top + H * cell, INK, 1);
      const pic = svg(x0 + cats.length * gap + 10, top + H * cell + 13, b, 64);
      const kind = r.pick(d === 1 ? ['val', 'most'] : d === 2 ? ['val', 'diff', 'most'] : ['diff', 'total']);
      const unit = cats[0] === '월' ? '쪽' : '명';
      if (kind === 'val') { const i = r.int(0, cats.length - 1); return P(`막대그래프에서 ${cats[i]}은(는) 몇 ${unit}일까요? (세로 눈금 한 칸: ${u}${unit})${pic}`, `${v[i]}${unit}`, `막대 끝이 ${v[i] / u}칸이니 ${v[i] / u} × ${u} = ${v[i]}`, true); }
      if (kind === 'most') return P(`가장 큰 값을 나타내는 항목은 무엇일까요?${pic}`, cats[v.indexOf(Math.max(...v))], `막대가 가장 긴 것을 찾아요.`, true);
      if (kind === 'total') return P(`막대그래프의 값을 모두 더하면 몇 ${unit}일까요? (세로 눈금 한 칸: ${u}${unit})${pic}`, `${v.reduce((a, c) => a + c)}${unit}`, `${v.join(' + ')}`, true);
      const mx = Math.max(...v), mn = Math.min(...v); return P(`가장 큰 값과 가장 작은 값의 차는 몇 ${unit}일까요? (세로 눈금 한 칸: ${u}${unit})${pic}`, `${mx - mn}${unit}`, `${mx} - ${mn} = ${mx - mn}`, true);
    };
    // ================= 4-2 삼각형 =================
    function triByAngles(a, b2, labels) { // 밑변 왼쪽 각 a, 오른쪽 각 b2
      const ta = Math.tan(rad(a)), tb = Math.tan(rad(b2)); const base = 100; let px = base * tb / (ta + tb), py = px * ta; if (a >= 90 || b2 >= 90) { /* 둔각/직각이면 좌표로 다시 계산 */ const x = base * Math.sin(rad(b2)) * Math.cos(rad(a)) / Math.sin(rad(a + b2)), y = base * Math.sin(rad(b2)) * Math.sin(rad(a)) / Math.sin(rad(a + b2)); px = x; py = y; }
      let pts = [[0, 0], [base, 0], [px, py]]; const minx = Math.min(...pts.map(p => p[0])), maxx = Math.max(...pts.map(p => p[0])), maxy = Math.max(...pts.map(p => p[1])); const s = Math.min(110 / (maxx - minx), 52 / maxy); pts = pts.map(p => [8 + (p[0] - minx) * s, 60 - p[1] * s]);
      let b = PG(pts, '#e6f7d9'); if (labels) { b += T(pts[0][0] + 17, pts[0][1] - 4.5, labels[0], 6.5, PINK) + T(pts[1][0] - 17, pts[1][1] - 4.5, labels[1], 6.5, PINK); if (labels[2]) b += T(pts[2][0], pts[2][1] + 8, labels[2], 6.5, PINK); }
      return svg(126, 66, b, 60);
    }
    G.tri4 = (r, d) => {
      const kind = r.pick(d === 1 ? ['iso', 'equi'] : d === 2 ? ['cls', 'iso'] : ['cls', 'iso', 'equi']);
      if (kind === 'iso') { const apex = r.int(2, 14) * 10; const base = (180 - apex) / 2; return P(`이등변삼각형이에요. □ 안에 알맞은 각도는 몇 도일까요?${triByAngles(base, base, ['□', '', `${apex}°`])}`, `${base}°`, `이등변삼각형은 두 밑각의 크기가 같아요: (180 - ${apex}) ÷ 2 = ${base}`, Number.isInteger(base)); }
      if (kind === 'equi') { const s = r.int(3, 15); return P(`세 변이 모두 ${s} cm예요. 삼각형의 이름과 세 변의 길이의 합은?${triByAngles(60, 60, [`60°`, `60°`])}`, `정삼각형, ${s * 3} cm`, `세 변의 길이가 같으면 정삼각형이에요: ${s} × 3 = ${s * 3}`, true); }
      let a = r.int(25, 80), b2 = r.int(25, 80); const t = r.pick(['예각', '직각', '둔각']); if (t === '직각') b2 = 90 - a; if (t === '둔각') { a = r.int(100, 130); b2 = r.int(15, 180 - a - 15); } if (t === '예각') { while (a + b2 <= 90) b2 = r.int(25, 80); }
      const c = 180 - a - b2; const cls = Math.max(a, b2, c) > 90 ? '둔각삼각형' : Math.max(a, b2, c) === 90 ? '직각삼각형' : '예각삼각형';
      return P(`각의 크기로 분류하면 어떤 삼각형일까요?<small class="opt">예각삼각형·직각삼각형·둔각삼각형</small>${triByAngles(a, b2, [`${a}°`, `${b2}°`])}`, cls, `나머지 한 각은 180 - ${a} - ${b2} = ${c}°예요.`, a + b2 + c === 180 && c > 0);
    };
    // ================= 4-2 사각형 =================
    G.quad4 = (r, d) => {
      const Q = [['사다리꼴', [[1, 0], [4, 0], [6, 3], [0, 3]]], ['평행사변형', [[1, 0], [6, 0], [5, 3], [0, 3]]], ['마름모', [[3, 0], [6, 1.5].map(x => x), [3, 3], [0, 1.5]]], ['직사각형', [[0, 0], [6, 0], [6, 3], [0, 3]]], ['정사각형', [[1.5, 0], [4.5, 0], [4.5, 3], [1.5, 3]]]];
      const kind = r.pick(d === 1 ? ['name', 'name', 'rhomb'] : d === 2 ? ['name', 'para', 'rhomb'] : ['para', 'rhomb', 'name']);
      if (kind === 'name') { const [nmQ, pts] = r.pick(Q); const s = 12, ox = 10 + r.int(0, 1) * 12, oy = 6; const b = dotGrid(8, 3, s, ox, oy) + PG(pts.map(p => [ox + (p[0] + .5) * s, oy + p[1] * s]), '#cfe8ff'); return P(`이 사각형의 가장 알맞은 이름은?<small class="opt">사다리꼴·평행사변형·마름모·직사각형·정사각형</small>${svg(116, 48, b, 58)}`, nmQ, { '사다리꼴': '평행한 변이 한 쌍만 있어요.', '평행사변형': '마주 보는 두 쌍의 변이 평행해요.', '마름모': '네 변의 길이가 모두 같아요. 네 각이 직각은 아니에요.', '직사각형': '네 각이 모두 직각이에요.', '정사각형': '네 각이 직각이고 네 변의 길이가 같아요.' }[nmQ], true); }
      if (kind === 'para') { const x = r.int(5, 13) * 5; const pts = [[30, 10], [112, 10], [92, 50], [10, 50]]; const ang = r.pick(['opp', 'adj']); const b = PG(pts, '#fff0b3') + T(24, 44, `${x}°`, 7, PINK) + T(ang === 'opp' ? 100 : 36, ang === 'opp' ? 16 : 16, '□', 8, PINK); return P(`평행사변형이에요. □ 안에 알맞은 각도는 몇 도일까요?${svg(122, 60, b, 58)}`, ang === 'opp' ? `${x}°` : `${180 - x}°`, ang === 'opp' ? '평행사변형에서 마주 보는 각의 크기는 같아요.' : `이웃한 두 각의 합은 180°예요: 180 - ${x} = ${180 - x}`, true); }
      const s = r.int(3, 12); const b = PG([[60, 4], [104, 30], [60, 56], [16, 30]], '#ffe3ec') + T(88, 12, `${s} cm`, 7, PINK);
      return P(`한 변이 ${s} cm인 마름모의 네 변의 길이의 합은 몇 cm일까요?${svg(120, 60, b, 54)}`, `${s * 4} cm`, `마름모는 네 변의 길이가 모두 같아요: ${s} × 4 = ${s * 4}`, true);
    };
    // ================= 4-2 꺾은선그래프 =================
    G.line4 = (r, d) => {
      const hours = ['9시', '10시', '11시', '12시', '1시']; const lo = r.int(4, 12); const v = [lo]; for (let i = 1; i < 5; i++) v.push(v[i - 1] + r.pick([0, 1, 2, 3, 4, -1]));
      const diffs = v.slice(1).map((x, i) => x - v[i]); if (!uniqMax(diffs) || Math.max(...diffs) <= 0 || !uniqMax(v)) return G.line4(r, d);
      const ymin = Math.min(...v) - 1, ymax = ymin + 10, top = 9, cell = 6, x0 = 22, gap = 22; let b = '';
      for (let j = 0; j <= 10; j++) { b += L(x0, top + j * cell, x0 + 4 * gap + 12, top + j * cell, '#e4def7', .6); if (j % 2 === 0) b += T(x0 - 7, top + j * cell, ymax - j, 5.5, '#8d86b8'); }
      const pts = v.map((y, i) => [x0 + 8 + i * gap, top + (ymax - y) * cell]);
      b += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${PINK}" stroke-width="1.6"/>`; pts.forEach(p => b += C(p[0], p[1], 2, '#fff', PINK, 1.4)); hours.forEach((h, i) => b += T(x0 + 8 + i * gap, top + 10 * cell + 7, h, 6));
      b += L(x0, top, x0, top + 10 * cell, INK, 1) + L(x0, top + 10 * cell, x0 + 4 * gap + 12, top + 10 * cell, INK, 1) + T(x0 + 4, top - 3, '(°C)', 5, '#8d86b8', 'start');
      const pic = svg(x0 + 4 * gap + 18, top + 10 * cell + 13, b, 64);
      const kind = r.pick(d === 1 ? ['val'] : d === 2 ? ['val', 'max'] : ['rise', 'max']);
      if (kind === 'val') { const i = r.int(0, 4); return P(`하루 동안 잰 기온이에요. ${hours[i]}의 기온은 몇 °C일까요?${pic}`, `${v[i]}°C`, `${hours[i]} 위의 점에서 왼쪽 눈금을 읽어요.`, true); }
      if (kind === 'max') return P(`기온이 가장 높았던 때는 몇 시일까요?${pic}`, hours[v.indexOf(Math.max(...v))], `점이 가장 높은 곳을 찾아요.`, true);
      const i = diffs.indexOf(Math.max(...diffs)); return P(`기온이 가장 많이 오른 때는 몇 시와 몇 시 사이일까요?${pic}`, `${hours[i]}와 ${hours[i + 1]} 사이`, `선분이 가장 많이 기울어진 곳이에요(${diffs[i]}°C 오름).`, true);
    };
    // ================= 5-2 합동과 대칭 =================
    G.sym5 = (r, d) => {
      const kind = r.pick(d === 1 ? ['axis'] : d === 2 ? ['axis', 'cong'] : ['cong', 'axis']);
      if (kind === 'axis') { const S = [['정삼각형', 3, () => PG(regPoly(3, 40, 34, 26), '#e6dcff')], ['정사각형', 4, () => PG(regPoly(4, 40, 32, 26, -45), '#e6dcff')], ['정오각형', 5, () => PG(regPoly(5, 40, 33, 25), '#e6dcff')], ['정육각형', 6, () => PG(regPoly(6, 40, 32, 25), '#e6dcff')], ['직사각형', 2, () => PG([[10, 16], [70, 16], [70, 48], [10, 48]], '#e6dcff')], ['마름모', 2, () => PG([[40, 6], [68, 32], [40, 58], [12, 32]], '#e6dcff')], ['이등변삼각형', 1, () => PG([[40, 6], [62, 58], [18, 58]], '#e6dcff')]];
        const [nmS, ax, draw] = r.pick(S); return P(`${nmS}은(는) 선대칭도형이에요. 대칭축은 모두 몇 개일까요?${svg(80, 64, draw(), 38)}`, `${ax}개`, `도형을 접어서 완전히 겹치게 하는 직선을 모두 찾아요.`, true); }
      const a = r.int(4, 9), b2 = r.int(5, 11), c = r.int(3, 8); if (a + c <= b2 || a + b2 <= c || b2 + c <= a) return G.sym5(r, d);
      const t1 = [[10, 50], [56, 50], [22, 12]], t2 = [[120, 12], [74, 12], [108, 50]];
      let bdy = PG(t1, '#d6f5d6') + PG(t2, '#d6f5d6') + T(6, 55, 'ㄱ', 7) + T(60, 55, 'ㄴ', 7) + T(20, 6, 'ㄷ', 7) + T(124, 7, 'ㄹ', 7) + T(70, 7, 'ㅁ', 7) + T(110, 57, 'ㅂ', 7) + T(33, 56, `${b2} cm`, 6, PINK) + T(18, 28, `${c} cm`, 6, PINK, 'end') + T(46, 28, `${a} cm`, 6, PINK);
      const q = r.pick([['ㄹㅁ', b2], ['ㅁㅂ', a], ['ㄹㅂ', c]]);
      return P(`두 삼각형은 합동이에요. 변 ${q[0]}의 길이는?<small class="opt">대응점: ㄱ과 ㄹ, ㄴ과 ㅁ, ㄷ과 ㅂ</small>${svg(130, 62, bdy, 66)}`, `${q[1]} cm`, `합동인 도형에서 대응변의 길이는 같아요.`, true);
    };
    // ================= 5-2 직육면체 =================
    function cuboidSVG(a, b2, c, labels) { const s = Math.min(60 / (a + b2 * .5), 40 / (c + b2 * .4)); const W = a * s, D = b2 * s * .5, H = c * s; const x = 8, y = 8 + D; const f = [[x, y], [x + W, y], [x + W, y + H], [x, y + H]]; let g = PG(f, '#fff0b3') + PG([[x, y], [x + D, y - D], [x + W + D, y - D], [x + W, y]], '#ffe58a') + PG([[x + W, y], [x + W + D, y - D], [x + W + D, y + H - D], [x + W, y + H]], '#ffd43b');
      g += L(x + D, y - D, x + D, y + H - D, INK, 1, '2.5 2') + L(x + D, y + H - D, x, y + H, INK, 1, '2.5 2') + L(x + D, y + H - D, x + W + D, y + H - D, INK, 1, '2.5 2');
      if (labels) g += T(x + W / 2, y + H + 7, `${a} cm`, 6.5, PINK) + T(x + W + D / 2 + 9, y + H - D / 2 + 3, `${b2} cm`, 6.5, PINK) + T(x - 2, y + H / 2, `${c} cm`, 6.5, PINK, 'end');
      return svg(x + W + D + 26, y + H + 13, g.replace(/x="8" y="(\d)/, 'x="8" y="$1'), 52); }
    G.cuboid5 = (r, d) => {
      const kind = r.pick(d === 1 ? ['face', 'edge', 'vert'] : d === 2 ? ['hidden', 'visible', 'edge'] : ['sum', 'hidden']);
      const a = r.int(3, 9), b2 = r.int(2, 7), c = r.int(2, 7);
      if (kind === 'sum') return P(`직육면체의 모든 모서리 길이의 합은 몇 cm일까요?${cuboidSVG(a, b2, c, true)}`, `${4 * (a + b2 + c)} cm`, `길이가 같은 모서리가 4개씩 있어요: (${a} + ${b2} + ${c}) × 4`, true);
      const pic = cuboidSVG(a, b2, c, false);
      const M = { face: ['면', 6, '직육면체는 면이 6개예요.'], edge: ['모서리', 12, '직육면체는 모서리가 12개예요.'], vert: ['꼭짓점', 8, '직육면체는 꼭짓점이 8개예요.'], hidden: ['보이지 않는 모서리', 3, '겨냥도에서 점선으로 그린 모서리가 3개예요.'], visible: ['보이는 면', 3, '겨냥도에서 보이는 면은 3개예요.'] }[kind];
      return P(`직육면체에서 ${M[0]}은(는) 몇 개일까요?${pic}`, `${M[1]}개`, M[2], true);
    };
    // ================= 6-1 각기둥과 각뿔 =================
    function prismSVG(n, pyramid) { const cx = 50, cy = 56, R = 34, ry = .32; const base = Array.from({ length: n }, (_, i) => { const a = rad(90 + 360 * i / n + (n === 4 ? 45 : 0)); return [cx + R * Math.cos(a), cy + R * Math.sin(a) * ry, Math.sin(a)]; }); const H = 40; let b = '';
      const top = base.map(p => [p[0], p[1] - H, p[2]]); const apex = [cx, cy - H - 6];
      const edges = []; for (let i = 0; i < n; i++) { const p = base[i], q = base[(i + 1) % n]; edges.push([p, q, p[2] < -.05 && q[2] < -.05 || (p[2] + q[2]) / 2 < -.2]); if (pyramid) edges.push([p, apex, p[2] < -.3]); else { edges.push([top[i], top[(i + 1) % n], false]); edges.push([p, top[i], p[2] < -.3]); } }
      if (!pyramid) b += PG(top.map(p => [p[0], p[1]]), '#cfe8ff', INK, 1.4);
      edges.forEach(([p, q, hid]) => { b += L(p[0], p[1], q[0], q[1], INK, 1.3, hid ? '2.5 2' : ''); });
      return svg(100, 72, b, 40); }
    const PN = { 3: '삼', 4: '사', 5: '오', 6: '육' };
    G.prism6 = (r, d) => {
      const n = r.int(3, 6), py = r.bool(); const nmP = `${PN[n]}각${py ? '뿔' : '기둥'}`; const pic = prismSVG(n, py);
      const kind = r.pick(d === 1 ? ['name'] : d === 2 ? ['name', 'face', 'vert'] : ['edge', 'vert', 'face']);
      const M = py ? { face: n + 1, edge: 2 * n, vert: n + 1 } : { face: n + 2, edge: 3 * n, vert: 2 * n };
      if (kind === 'name') return P(`입체도형의 이름을 써 보세요.${pic}`, nmP, py ? `밑면이 ${PN[n]}각형 1개이고 옆면이 삼각형이에요.` : `밑면이 ${PN[n]}각형 2개이고 옆면이 직사각형이에요.`, true);
      const W = { face: '면', edge: '모서리', vert: '꼭짓점' }[kind];
      const ex = py ? { face: `밑면 1개 + 옆면 ${n}개`, edge: `밑면의 변 ${n}개 + 옆면 모서리 ${n}개`, vert: `밑면 꼭짓점 ${n}개 + 각뿔의 꼭짓점 1개` }[kind] : { face: `밑면 2개 + 옆면 ${n}개`, edge: `${n} × 3`, vert: `${n} × 2` }[kind];
      return P(`${nmP}의 ${W}은(는) 모두 몇 개일까요?${pic}`, `${M[kind]}개`, ex, true);
    };
    // ================= 6-1 여러 가지 그래프 (띠·원그래프) =================
    G.ratiograph6 = (r, d) => {
      const cats = r.pick([['떡볶이', '김밥', '라면', '기타'], ['독서', '운동', '게임', '기타'], ['버스', '도보', '자전거', '기타']]);
      let p; do { p = [r.int(5, 9) * 5, r.int(3, 7) * 5, r.int(3, 5) * 5]; p.push(100 - p[0] - p[1] - p[2]); } while (p[3] < 10 || p[3] >= Math.min(p[0], p[1], p[2]) || !uniqMax(p));
      if (!uniqMax(p)) return G.ratiograph6(r, d);
      const pie = r.bool(); const hideIdx = d === 1 ? -1 : 3;
      let b = '';
      if (pie) { let a0 = -90; p.forEach((v, i) => { const a1 = a0 + v * 3.6; const x0 = 40 + 30 * Math.cos(rad(a0)), y0 = 36 + 30 * Math.sin(rad(a0)), x1 = 40 + 30 * Math.cos(rad(a1)), y1 = 36 + 30 * Math.sin(rad(a1)); b += `<path d="M40,36 L${x0.toFixed(1)},${y0.toFixed(1)} A30,30 0 ${v > 50 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${FILLS[i]}" stroke="${INK}" stroke-width="1"/>`; const am = rad((a0 + a1) / 2); b += T(40 + 19 * Math.cos(am), 36 + 19 * Math.sin(am) - 3, cats[i], 5.5) + T(40 + 19 * Math.cos(am), 36 + 19 * Math.sin(am) + 4, i === hideIdx ? '□%' : `${v}%`, 5.5, PINK); a0 = a1; }); b = svg(80, 72, b, 46); }
      else { let x = 4; p.forEach((v, i) => { const w = v * 1.3; b += `<rect x="${x}" y="8" width="${w}" height="22" fill="${FILLS[i]}" stroke="${INK}" stroke-width="1"/>` + T(x + w / 2, 15, cats[i], 5.5) + T(x + w / 2, 24, i === hideIdx ? '□%' : `${v}%`, 5.5, PINK); x += w; }); b = svg(138, 36, b, 76); }
      const g = pie ? '원그래프' : '띠그래프';
      const kind = r.pick(d === 1 ? ['most', 'pct'] : d === 2 ? ['hide', 'count'] : ['hide', 'count', 'times']);
      if (kind === 'most') return P(`${g}에서 가장 많은 항목은 무엇일까요?${b}`, cats[p.indexOf(Math.max(...p))], `백분율이 가장 큰 항목을 찾아요.`, true);
      if (kind === 'pct') { const i = r.int(0, 3); return P(`${g}에서 ${cats[i]}은(는) 전체의 몇 %일까요?${b}`, `${p[i]}%`, `그래프에 적힌 백분율을 읽어요.`, true); }
      if (kind === 'hide') return P(`${g}에서 □ 안에 알맞은 수는 무엇일까요?${b}`, `${p[3]}`, `전체는 100%예요: 100 - ${p[0]} - ${p[1]} - ${p[2]} = ${p[3]}`, p.reduce((a, c) => a + c) === 100);
      const total = r.int(2, 8) * 20; const i = r.int(0, 2);
      if (kind === 'times') { if (p[0] % p[2] !== 0) return G.ratiograph6(r, d); return P(`${g}에서 ${cats[0]}은(는) ${cats[2]}의 몇 배일까요?${b}`, `${p[0] / p[2]}배`, `${p[0]} ÷ ${p[2]} = ${p[0] / p[2]}`, true); }
      return P(`학생 ${total}명을 조사한 ${g}예요. ${cats[i]}은(는) 몇 명일까요?${b}`, `${total * p[i] / 100}명`, `${total} × ${p[i]} ÷ 100 = ${total * p[i] / 100}`, Number.isInteger(total * p[i] / 100));
    };
    // ================= 6-2 공간과 입체 (쌓기나무) =================
    function stackSVG(hgt) { // hgt[y][x], y=0 앞줄
      const n = hgt.length, s = 14, c30 = Math.cos(rad(30)), s30 = .5; const prj = (x, y, z) => [100 + (x - y) * c30 * s, 120 - (x + y) * s30 * s - z * s];
      let cubes = []; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) for (let z = 0; z < hgt[y][x]; z++) cubes.push([x, y, z]);
      cubes.sort((A, Bc) => (Bc[0] + Bc[1]) - (A[0] + A[1]) || A[2] - Bc[2]);
      let b = ''; cubes.forEach(([x, y, z]) => { const p = (a, b2, c) => prj(x + a, y + b2, z + c); b += PG([p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)], '#fff0b3', INK, .9) + PG([p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)], '#ffd43b', INK, .9) + PG([p(0, 0, 0), p(0, 1, 0), p(0, 1, 1), p(0, 0, 1)], '#ffe58a', INK, .9); });
      const xs = [], ys = []; cubes.forEach(([x, y, z]) => { for (const [a, b2, c] of [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 1], [0, 0, 1], [1, 0, 1], [0, 1, 1]]) { const p = prj(x + a, y + b2, z + c); xs.push(p[0]); ys.push(p[1]); } });
      const minx = Math.min(...xs) - 3, miny = Math.min(...ys) - 3, w = Math.max(...xs) - minx + 3, hh = Math.max(...ys) - miny + 3;
      return { body: b, vb: `${minx.toFixed(1)} ${miny.toFixed(1)} ${w.toFixed(1)} ${hh.toFixed(1)}`, w, hh };
    }
    const stackPic = (h, mm) => { const s = stackSVG(h); return `<svg class="pic" viewBox="${s.vb}" style="width:${mm}mm" xmlns="http://www.w3.org/2000/svg">${s.body}</svg>`; };
    G.stack6 = (r, d) => {
      const n = 3, h = Array.from({ length: n }, () => Array(n).fill(0));
      for (let y = n - 1; y >= 0; y--) for (let x = n - 1; x >= 0; x--) { const back = Math.min(y < n - 1 ? h[y + 1][x] : 3, x < n - 1 ? h[y][x + 1] : 3); h[y][x] = Math.max(0, back - r.pick([0, 0, 1, 1, 2])); if (y === n - 1 && x === n - 1) h[y][x] = r.int(2, 3); }
      const total = h.flat().reduce((a, c) => a + c); if (total < 5) return G.stack6(r, d);
      let pic = stackPic(h, 40);
      if (d === 1) { let tv = ''; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (h[y][x]) tv += `<rect x="${4 + x * 12}" y="${4 + (n - 1 - y) * 12}" width="12" height="12" fill="#fff" stroke="${INK}" stroke-width=".9"/>` + T(10 + x * 12, 10 + (n - 1 - y) * 12, h[y][x], 7); pic = `<span class="pics">${stackPic(h, 36)}${svg(44, 48, tv + T(22, 44, '위에서 본 모양', 5), 22)}</span>`; return P(`쌓기나무는 모두 몇 개일까요?<small class="opt">오른쪽은 위에서 본 모양에 쌓은 개수를 쓴 것이에요</small>${pic}`, `${total}개`, `위에서 본 모양의 수를 모두 더해요: ${h.flat().filter(v => v).join(' + ')} = ${total}`, true); }
      return P(`쌓기나무는 모두 몇 개일까요?<small class="opt">바닥부터 빈틈없이 쌓았고, 앞줄은 뒷줄보다 높지 않아요</small>${pic}`, `${total}개`, `한 줄씩 높이를 세어 더해요: ${h.flat().filter(v => v).join(' + ')} = ${total}`, true);
    };
    // ================= 6-2 원기둥, 원뿔, 구 =================
    function solid3(type, x) { const cx = x + 18; if (type === '원기둥') return `<path d="M${cx - 14},14 L${cx - 14},50 A14,5 0 0 0 ${cx + 14},50 L${cx + 14},14" fill="#cfe8ff" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${cx}" cy="14" rx="14" ry="5" fill="#cfe8ff" stroke="${INK}" stroke-width="1.4"/>`; if (type === '원뿔') return `<path d="M${cx - 15},50 L${cx},10 L${cx + 15},50" fill="#ffe3ec" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${cx}" cy="50" rx="15" ry="5" fill="#ffe3ec" stroke="${INK}" stroke-width="1.4"/>`; if (type === '구') return C(cx, 32, 17, '#d6f5d6') + `<ellipse cx="${cx}" cy="32" rx="17" ry="5" fill="none" stroke="${INK}" stroke-width=".8" stroke-dasharray="2 2"/>`; return PG([[cx - 14, 20], [cx + 6, 20], [cx + 14, 12], [cx - 6, 12]], '#fff0b3') + PG([[cx - 14, 20], [cx + 6, 20], [cx + 6, 50], [cx - 14, 50]], '#fff0b3') + PG([[cx + 6, 20], [cx + 14, 12], [cx + 14, 42], [cx + 6, 50]], '#ffe58a'); }
    G.round6 = (r, d) => {
      const kind = r.pick(d === 1 ? ['which'] : d === 2 ? ['which', 'side'] : ['side', 'sphere', 'height']);
      if (kind === 'which') { const set = r.shuffle(['원기둥', '원뿔', '구', '사각기둥']); const ask = r.pick(['원기둥', '원뿔', '구']); let b = ''; set.forEach((t, i) => { b += solid3(t, 4 + i * 36) + tag(22 + i * 36, 62, GA[i]); }); return P(`${ask}은(는) 어느 것일까요?${svg(150, 70, b, 76)}`, GA[set.indexOf(ask)], { '원기둥': '위아래에 크기가 같은 원이 있고 옆면이 굽은 면이에요.', '원뿔': '밑면이 원이고 뾰족한 꼭짓점이 있어요.', '구': '어느 방향에서 보아도 원 모양이에요.' }[ask], true); }
      const rr = r.int(2, 10), hh = r.int(4, 15);
      if (kind === 'side') { const b = solid3('원기둥', 30) + L(48, 50, 62, 50, PINK, 1.2) + T(56, 45, `${rr} cm`, 6, PINK) + L(68, 14, 68, 50, PINK, 1, '2 2') + T(80, 32, `${hh} cm`, 6, PINK); return P(`원기둥 전개도에서 옆면의 가로는 몇 cm일까요?<small class="opt">원주율 3.14</small>${svg(96, 60, b, 44)}`, `${dec(rr * 2 * 314, 2)} cm`, `옆면의 가로는 밑면의 둘레와 같아요: ${rr * 2} × 3.14`, true); }
      if (kind === 'height') { const b = solid3('원뿔', 30) + L(48, 10, 48, 50, PINK, 1, '2 2') + T(56, 30, `${hh} cm`, 6, PINK) + L(48, 50, 63, 50, INK, 1) + T(56, 55, `${rr} cm`, 6, INK); return P(`원뿔에서 점선의 이름과 길이를 써 보세요.${svg(96, 60, b, 44)}`, `높이, ${hh} cm`, `원뿔의 꼭짓점에서 밑면에 수직인 선분의 길이가 높이예요.`, true); }
      const b = solid3('구', 30) + L(31, 32, 65, 32, PINK, 1.2) + T(48, 21, `${rr * 2} cm`, 6, PINK); return P(`구의 지름이 그림과 같을 때 반지름은 몇 cm일까요?${svg(96, 60, b, 44)}`, `${rr} cm`, `반지름은 지름의 반이에요: ${rr * 2} ÷ 2 = ${rr}`, true);
    };
    const dec = WS.H.dec;
  };
  root.linkPictures2 = function (WS, setGen) {
    const G = WS.G;
    G.angle4mix = (r, d) => r.bool(0.5) ? G.angle4p(r, d) : G.angle(r, d);
    setGen('1-1', '여러 가지 모양', 'solid1');
    setGen('1-1', '비교하기', 'compare1');
    setGen('1-2', '여러 가지 모양', 'flat1');
    setGen('2-1', '여러 가지 도형', 'shape2');
    setGen('2-1', '분류하기', 'classify2');
    setGen('2-2', '표와 그래프', 'graph2');
    setGen('3-1', '평면도형', 'plane3');
    setGen('3-2', '원', 'circle3');
    setGen('3-2', '자료의 정리', 'picgraph3');
    setGen('4-1', '각도', 'angle4mix');
    setGen('4-1', '평면도형의 이동', 'move4');
    setGen('4-1', '막대그래프', 'bar4');
    setGen('4-2', '삼각형', 'tri4');
    setGen('4-2', '사각형', 'quad4');
    setGen('4-2', '꺾은선그래프', 'line4');
    setGen('5-2', '합동과 대칭', 'sym5');
    setGen('5-2', '직육면체', 'cuboid5');
    setGen('6-1', '각기둥과 각뿔', 'prism6');
    setGen('6-1', '여러 가지 그래프', 'ratiograph6');
    setGen('6-2', '공간과 입체', 'stack6');
    setGen('6-2', '원기둥, 원뿔, 구', 'round6');
  };
})(typeof window !== 'undefined' ? window : globalThis);
