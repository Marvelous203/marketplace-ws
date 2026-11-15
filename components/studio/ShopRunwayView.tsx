'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { showToast } from './Toast';

const MODELS =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042056_1a704ff7-b0e5-4a9f-bbda-62392b819fb6.png&w=3840&q=85';
const PIECES =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042057_080e85b0-b4aa-4072-8eb9-2304c7baf42b.png&w=2400&q=85';

const LOOKS = [
  [12, 176],
  [178, 330],
  [331, 470],
  [476, 633],
  [634, 767],
  [767, 956],
];
const Y0 = 48,
  Y1 = 496,
  FIRST = 15;

const CATEGORIES = [
  { id: 'all', label: 'All Looks' },
  { id: 'tops', label: 'Tops / Áo' },
  { id: 'bottoms', label: 'Bottoms / Quần' },
  { id: 'dresses', label: 'Dresses / Váy' },
  { id: 'acc', label: 'Accessories / Phụ Kiện' },
];

interface ItemDef {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  name: string;
  price: string;
  cat: string;
  lookIdx: number;
}

const ITEMS: ItemDef[] = [
  { x0: 26, x1: 224, y0: 28, y1: 214, name: 'Feather Jacket', price: '$2,900', cat: 'tops', lookIdx: 0 },
  { x0: 304, x1: 412, y0: 22, y1: 236, name: 'Satin Wide Leg Trousers', price: '$1,450', cat: 'bottoms', lookIdx: 0 },
  { x0: 530, x1: 666, y0: 12, y1: 242, name: 'Pleated Dress', price: '$2,200', cat: 'dresses', lookIdx: 1 },
  { x0: 752, x1: 922, y0: 100, y1: 146, name: 'Gold Waist Belt', price: '$420', cat: 'acc', lookIdx: 1 },
  { x0: 70, x1: 176, y0: 246, y1: 466, name: 'Satin Trench Dress', price: '$2,350', cat: 'dresses', lookIdx: 2 },
  { x0: 294, x1: 422, y0: 294, y1: 432, name: 'Top Handle Bag', price: '$980', cat: 'acc', lookIdx: 2 },
  { x0: 508, x1: 688, y0: 240, y1: 452, name: 'Billow Sleeve Blouse', price: '$860', cat: 'tops', lookIdx: 3 },
  { x0: 780, x1: 890, y0: 252, y1: 466, name: 'Tie Waist Trousers', price: '$740', cat: 'bottoms', lookIdx: 3 },
  { x0: 64, x1: 178, y0: 484, y1: 698, name: 'Powder Long Coat', price: '$1,980', cat: 'tops', lookIdx: 4 },
  { x0: 316, x1: 396, y0: 482, y1: 698, name: 'Ivory Straight Trousers', price: '$690', cat: 'bottoms', lookIdx: 4 },
  { x0: 530, x1: 672, y0: 508, y1: 682, name: 'Sculpted Ruffle Top', price: '$1,120', cat: 'tops', lookIdx: 5 },
  { x0: 754, x1: 916, y0: 484, y1: 700, name: 'Pleated Maxi Skirt', price: '$1,340', cat: 'bottoms', lookIdx: 5 },
];

const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
const KB = [0, 0, 1.5, 4, 8, 12, 17];
const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

const N = LOOKS.length;
const wrap = (x: number, n: number) => ((x % n) + n) % n;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export default function ShopRunwayView() {
  const { addItem } = useCart();
  const [activeCat, setActiveCat] = useState('all');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);

  const stateRef = useRef({
    p: 0,
    target: 0,
    last: 0,
    down: false,
    sx: 0,
    st: 0,
    moved: 0,
    wheelT: null as NodeJS.Timeout | null,
    mx: 0,
    my: 0,
    cx: 0,
    cy: 0,
    W: 0,
    H: 0,
    base: 0,
    cardS: 0,
    activeCat: 'all',
  });

  stateRef.current.activeCat = activeCat;

  // Toggle favorite on rail items
  const toggleFav = (idx: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    showToast(favorites.has(idx) ? 'Removed from saved' : 'Saved piece');
  };

  // Add to cart from rail item
  const handleAddToCart = (item: ItemDef) => {
    const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 500;
    const priceVND = numericPrice * 25000;

    addItem({
      productId: `runway-${item.lookIdx}-${item.cat}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: item.name,
      priceVND,
      size: 'M',
      color: `Runway Look ${FIRST + item.lookIdx}`,
      quantity: 1,
      imageFile: `runway-look-${FIRST + item.lookIdx}`,
      lookId: item.lookIdx,
    });
    showToast(`Added ${item.name} to cart`);
  };

  // Switch category and snap depth to matching look
  const handleSelectCat = (catId: string) => {
    setActiveCat(catId);
    if (catId !== 'all') {
      const matched = ITEMS.find((it) => it.cat === catId);
      if (matched) {
        const targetLookIdx = matched.lookIdx;
        const currentSnap = Math.round(stateRef.current.target);
        const diff = wrap(targetLookIdx - currentSnap, N);
        stateRef.current.target =
          currentSnap + (diff > N / 2 ? diff - N : diff);
      }
    }
  };

  useEffect(() => {
    const stage = stageRef.current;
    const rail = railRef.current;
    const line = lineRef.current;
    const ring = ringRef.current;
    const roll = rollRef.current;
    if (!stage || !rail || !line || !ring || !roll) return;

    // Create model DOM elements
    const modelEls = LOOKS.map(([a, b], i) => {
      const e = document.createElement('div');
      e.className = 'm';
      e.dataset.i = String(i);
      e.style.position = 'absolute';
      e.style.left = '0';
      e.style.top = '0';
      e.style.transformOrigin = '0 0';
      e.style.pointerEvents = 'none';

      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', `${a} ${Y0} ${b - a} ${Y1 - Y0}`);
      s.setAttribute('aria-hidden', 'true');
      s.style.display = 'block';
      s.style.width = '100%';
      s.style.height = '100%';

      const f = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      f.setAttribute('x', String(a));
      f.setAttribute('y', String(Y0));
      f.setAttribute('width', String(b - a));
      f.setAttribute('height', String(Y1 - Y0));
      f.setAttribute('viewBox', `${a} ${Y0} ${b - a} ${Y1 - Y0}`);

      const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttribute('href', MODELS);
      img.setAttribute('width', '960');
      img.setAttribute('height', '540');

      f.appendChild(img);
      s.appendChild(f);
      e.appendChild(s);
      line.appendChild(e);

      return {
        e,
        r: (b - a) / (Y1 - Y0),
      };
    });

    // Populate roll counter
    roll.innerHTML = '';
    for (let i = 0; i <= N; i++) {
      const b = document.createElement('b');
      b.textContent = String(FIRST + (i % N));
      b.style.display = 'block';
      b.style.fontWeight = '400';
      b.style.height = '38px';
      roll.appendChild(b);
    }

    const updateSize = () => {
      const s = stateRef.current;
      s.W = stage.clientWidth;
      s.H = stage.clientHeight;
      s.base = s.H * 1.2;
      s.cardS = rail.clientHeight / 3;

      modelEls.forEach((m) => {
        m.e.style.width = `${m.r * s.base}px`;
        m.e.style.height = `${s.base}px`;
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Main animation painter
    const paint = () => {
      const s = stateRef.current;
      const { p, W, H, base, cardS, activeCat: currentCat } = s;

      // 1. Paint people
      modelEls.forEach((m, i) => {
        let d = wrap(i - p, N);
        if (d > N - 1) d -= N;
        const k = clamp(d + 1, 0, 6);
        const a = Math.floor(k);
        const b = Math.min(6, a + 1);
        const t = k - a;
        const mix = (A: number[]) => A[a] + (A[b] - A[a]) * t;

        const h = mix(KH) * H;
        const scale = h / base;
        const w = h * m.r;
        const x = mix(KX) * W - w / 2;
        const y = mix(KF) * H - h;

        m.e.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;

        const f = mix(KB) / scale;
        const fs = f < 0.2 ? 'none' : `blur(${f.toFixed(1)}px)`;
        const o = mix(KO).toFixed(3);

        m.e.style.filter = fs;
        m.e.style.opacity = o;
        m.e.style.zIndex = String(100 - Math.round(d * 10));
      });

      // 2. Paint cards on rail
      const all = cardS * ITEMS.length;
      const cardNodes = rail.querySelectorAll<HTMLElement>('.card');
      cardNodes.forEach((c, i) => {
        let y = wrap(i * cardS - p * 2 * cardS, all);
        if (y > all - cardS) y -= all;
        c.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        c.style.height = `${cardS}px`;

        const itemCat = c.dataset.cat;
        if (currentCat !== 'all' && itemCat !== currentCat) {
          c.style.opacity = '0.35';
          c.style.filter = 'grayscale(60%)';
        } else {
          c.style.opacity = '1';
          c.style.filter = 'none';
        }
      });

      // 3. Paint rolling counter
      const firstChildH = roll.firstElementChild
        ? (roll.firstElementChild as HTMLElement).offsetHeight
        : 38;
      roll.style.transform = `translate3d(0, ${(-wrap(p, N) * firstChildH).toFixed(1)}px, 0)`;
    };

    let animId: number;
    const loop = (now: number) => {
      const s = stateRef.current;
      const dt = Math.min(50, now - s.last) || 16;
      s.last = now;

      s.p += (s.target - s.p) * (1 - Math.exp(-dt * 0.0072));
      if (Math.abs(s.target - s.p) < 0.0004) s.p = s.target;

      paint();

      s.cx += (s.mx - s.cx) * 0.32;
      s.cy += (s.my - s.cy) * 0.32;
      ring.style.transform = `translate3d(${s.cx.toFixed(1)}px, ${s.cy.toFixed(1)}px, 0)`;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Event listeners
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') ring.classList.add('show');
    };
    const handlePointerLeave = () => ring.classList.remove('show');
    const handlePointerMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const s = stateRef.current;
      s.mx = e.clientX - r.left;
      s.my = e.clientY - r.top;
      if (!s.down) return;
      const dx = e.clientX - s.sx;
      s.moved = Math.max(s.moved, Math.abs(dx));
      const pull = Math.max(150, s.W * 0.2);
      s.target = s.st + dx / pull;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return;
      const s = stateRef.current;
      s.down = true;
      stage.style.cursor = 'grabbing';
      s.sx = e.clientX;
      s.st = s.target;
      s.moved = 0;
      stage.setPointerCapture(e.pointerId);
      ring.classList.add('drag');
    };

    const handleRelease = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.down) return;
      s.down = false;
      stage.style.cursor = 'grab';
      ring.classList.remove('drag');
      if (s.moved < 6) {
        const hit = document
          .elementsFromPoint(e.clientX, e.clientY)
          .find((x) => x.classList && x.classList.contains('m')) as HTMLElement;
        if (hit && hit.dataset.i) {
          let d = wrap(Number(hit.dataset.i) - s.target, N);
          d = Math.round(d);
          if (d > 0 && d < N) s.target = Math.round(s.target) + d;
        }
      } else {
        s.target = Math.round(s.target);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      s.target += clamp(e.deltaY + e.deltaX, -120, 120) / 420;
      if (s.wheelT) clearTimeout(s.wheelT);
      s.wheelT = setTimeout(() => {
        s.target = Math.round(s.target);
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        s.target = Math.round(s.target) + 1;
      }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        s.target = Math.round(s.target) - 1;
      }
    };

    stage.addEventListener('pointerenter', handlePointerEnter);
    stage.addEventListener('pointerleave', handlePointerLeave);
    stage.addEventListener('pointermove', handlePointerMove);
    stage.addEventListener('pointerdown', handlePointerDown);
    stage.addEventListener('pointerup', handleRelease);
    stage.addEventListener('pointercancel', handleRelease);
    stage.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
      stage.removeEventListener('pointerenter', handlePointerEnter);
      stage.removeEventListener('pointerleave', handlePointerLeave);
      stage.removeEventListener('pointermove', handlePointerMove);
      stage.removeEventListener('pointerdown', handlePointerDown);
      stage.removeEventListener('pointerup', handleRelease);
      stage.removeEventListener('pointercancel', handleRelease);
      stage.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      line.innerHTML = '';
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        left: '24px',
        top: '96px',
        width: '1552px',
        height: '788px',
        background: 'rgba(24, 23, 28, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.28)',
        borderRadius: '24px',
        backdropFilter: 'blur(26px) saturate(140%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.35), 0 20px 48px -18px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 10,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* CATEGORY CAROUSEL NAV BAR */}
      <div
        className="cat-bar wide"
        style={{
          height: '56px',
          padding: '0 28px',
          borderBottom: '1px solid var(--line)',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: 'var(--ink-3)',
            textTransform: 'uppercase',
            marginRight: '8px',
          }}
        >
          Runway Filter
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCat(cat.id)}
              style={{
                fontSize: '12px',
                letterSpacing: '0.12em',
                padding: '7px 18px',
                borderRadius: '99px',
                border: isActive
                  ? '1px solid #fff'
                  : '1px solid var(--line)',
                background: isActive
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.06)',
                boxShadow: isActive ? 'var(--glow)' : 'none',
                color: isActive ? '#fff' : 'var(--ink-2)',
                transition: 'all .25s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* MAIN VIEW: 3D RUNWAY STAGE + PRODUCT RAIL */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 372px',
          flex: 1,
          minHeight: 0,
          position: 'relative',
        }}
      >
        {/* 3D Depth Runway Stage */}
        <section
          ref={stageRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            touchAction: 'pan-y',
            userSelect: 'none',
            cursor: 'grab',
            background:
              'radial-gradient(110% 80% at 50% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(18, 16, 22, 0.6) 100%)',
          }}
          tabIndex={0}
        >
          <div ref={lineRef} style={{ position: 'absolute', inset: 0 }} />

          {/* Runway Editorial Info */}
          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              left: '42px',
              top: '32px',
              width: '380px',
              pointerEvents: 'none',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-syne, Syne), sans-serif',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: 1.2,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Spring Summer 2027
            </h2>
            <p
              style={{
                marginTop: '12px',
                fontSize: '13px',
                lineHeight: 1.6,
                letterSpacing: '0.015em',
                color: 'var(--ink-2)',
              }}
            >
              A study in softness and strength. The runway lookbook from Maison
              Vell blends delicate textures and modern silhouettes in real-time
              depth.
            </p>
          </div>

          {/* Rolling Look Counter */}
          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              left: '42px',
              bottom: '36px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                lineHeight: '38px',
                letterSpacing: '0.14em',
                gap: '0.4em',
                fontFamily: 'var(--font-syne, Syne), sans-serif',
                fontWeight: 700,
              }}
            >
              <span>LOOK</span>
              <div
                style={{
                  height: '38px',
                  overflow: 'hidden',
                  width: '50px',
                }}
              >
                <span
                  ref={rollRef}
                  style={{
                    display: 'block',
                    willChange: 'transform',
                  }}
                />
              </div>
            </div>
            <span
              style={{
                display: 'inline-block',
                marginTop: '8px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-2)',
                borderBottom: '1px solid var(--line)',
                paddingBottom: '3px',
              }}
            >
              Interactive 3D Depth
            </span>
          </div>

          {/* Interactive Pointer Follower Ring */}
          <div
            ref={ringRef}
            className="ring"
            style={{
              position: 'absolute',
              zIndex: 4,
              left: 0,
              top: 0,
              width: '46px',
              height: '46px',
              margin: '-23px 0 0 -23px',
              border: '2.5px solid #fff',
              borderRadius: '99px',
              pointerEvents: 'none',
              opacity: 0,
              transition:
                'width .22s cubic-bezier(.2,.8,.2,1), height .22s cubic-bezier(.2,.8,.2,1), margin .22s cubic-bezier(.2,.8,.2,1), opacity .2s',
            }}
          />
        </section>

        {/* Product Rail on the Right */}
        <aside
          ref={railRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(28, 26, 32, 0.65)',
            borderLeft: '1px solid var(--line)',
            minHeight: 0,
          }}
        >
          {ITEMS.map((item, idx) => {
            const isFav = favorites.has(idx);
            const isAlt = idx % 2 === 1;

            return (
              <article
                key={idx}
                className="card"
                data-cat={item.cat}
                data-look={item.lookIdx}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px 20px',
                  willChange: 'transform',
                  background: isAlt
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'opacity .3s, filter .3s',
                }}
              >
                {/* Favorite heart */}
                <button
                  className="fav"
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '16px',
                    width: '24px',
                    height: '24px',
                    zIndex: 2,
                    color: '#fff',
                  }}
                  aria-pressed={isFav}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(idx);
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    style={{
                      width: '100%',
                      height: '100%',
                      fill: isFav ? '#ff6584' : 'none',
                      stroke: isFav ? '#ff6584' : 'currentColor',
                      strokeWidth: 1.5,
                      transition: 'fill .2s',
                    }}
                  >
                    <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
                  </svg>
                </button>

                {/* Cropped Sprite Shot */}
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'block',
                    padding: '8px 0',
                  }}
                >
                  <svg
                    viewBox={`${item.x0} ${item.y0} ${item.x1 - item.x0} ${item.y1 - item.y0}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  >
                    <svg
                      x={item.x0}
                      y={item.y0}
                      width={item.x1 - item.x0}
                      height={item.y1 - item.y0}
                      viewBox={`${item.x0} ${item.y0} ${item.x1 - item.x0} ${item.y1 - item.y0}`}
                    >
                      <image href={PIECES} width={960} height={720} />
                    </svg>
                  </svg>
                </div>

                {/* Metadata & Add to Cart button */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'end',
                    marginTop: '8px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: '12px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#fff',
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      style={{
                        display: 'block',
                        marginTop: '4px',
                        fontSize: '13px',
                        color: 'var(--ink-2)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.price}
                    </span>
                  </div>

                  <button
                    className="add"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid var(--line)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      transition: 'transform .2s, background .2s',
                    }}
                    aria-label={`Add ${item.name} to cart`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    <svg className="ic" viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
