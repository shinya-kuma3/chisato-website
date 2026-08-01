"use client";

import { useEffect, useRef } from "react";

/**
 * マウスカーソルを追従する、メインカラー(ティール)の小さな光る球体。
 * 球体は z-index:45、イラスト(.illust-frame など)は z-index:46 に置いてあるため、
 * カーソルがイラストの上に来ると、球体はイラストの背後に回り込んで追従する
 * (不透明なイラストに隠れて通り抜けるように見える)。
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 動きを抑える設定の端末、マウスのない端末では無効化
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      visible = true;
    };

    const onLeave = () => {
      visible = false;
    };

    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = visible ? "1" : "0";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cursor-glow-layer" aria-hidden="true">
      <div className="cursor-glow" ref={ref} />
    </div>
  );
}
