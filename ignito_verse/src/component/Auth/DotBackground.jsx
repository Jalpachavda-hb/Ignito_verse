import React, { useEffect, useRef } from 'react';

/**
 * Interactive Dot Background Canvas
 * Features:
 * - Fluid, high-DPI responsive dot grid
 * - Interactive mouse hover repulsion & spring physics
 * - Glowing multi-colored gradient on hover (Brand Purple #7f489f, Pink #e11d48, Navy Blue)
 * - Soft ambient breathing wave
 * - Interactive cursor spotlight halo & subtle connective lines
 * - Interactive click ripple wave
 */
export default function DotBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Grid configuration
    const spacing = 32; // Dot spacing in px
    let dots = [];

    // Mouse tracking state
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovered: false,
      radius: 160 // Interaction radius in px
    };

    // Ripples on click
    const ripples = [];

    class Dot {
      constructor(originX, originY) {
        this.originX = originX;
        this.originY = originY;
        this.x = originX;
        this.y = originY;
        this.vx = 0;
        this.vy = 0;
        this.baseRadius = 1.6;
        this.radius = 1.6;
        this.alpha = 0.18;
        this.color = '127, 72, 159'; // Brand purple default
      }

      update(time) {
        // 1. Calculate ambient gentle wave offset
        const wave = Math.sin(time * 0.002 + this.originX * 0.015 + this.originY * 0.015) * 1.5;
        let targetX = this.originX;
        let targetY = this.originY + wave;

        // 2. Mouse interaction (Repulsion / Elastic Displacement)
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        let hoverFactor = 0;
        if (mouse.isHovered && dist < mouse.radius && dist > 0) {
          const raw = 1 - dist / mouse.radius;
          hoverFactor = raw * raw * (3 - 2 * raw); // Smooth ease-in-out

          // Repulsive push away from cursor
          const angle = Math.atan2(dy, dx);
          const pushDistance = hoverFactor * 18;
          targetX += Math.cos(angle) * pushDistance;
          targetY += Math.sin(angle) * pushDistance;
        }

        // 3. Ripple shockwaves
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          const rdx = this.x - r.x;
          const rdy = this.y - r.y;
          const rdist = Math.hypot(rdx, rdy);
          const diff = Math.abs(rdist - r.currentRadius);
          
          if (diff < r.thickness) {
            const rippleForce = (1 - diff / r.thickness) * (1 - r.currentRadius / r.maxRadius);
            const rAngle = Math.atan2(rdy, rdx);
            targetX += Math.cos(rAngle) * rippleForce * 14;
            targetY += Math.sin(rAngle) * rippleForce * 14;
            hoverFactor = Math.max(hoverFactor, rippleForce * 0.8);
          }
        }

        // 4. Spring Physics (Hooke's Law with damping)
        const spring = 0.12;
        const friction = 0.82;
        this.vx += (targetX - this.x) * spring;
        this.vy += (targetY - this.y) * spring;
        this.vx *= friction;
        this.vy *= friction;
        this.x += this.vx;
        this.y += this.vy;

        // 5. Dynamic Sizing & Colors based on proximity
        if (hoverFactor > 0.01) {
          this.radius = this.baseRadius + hoverFactor * 2.4;
          this.alpha = 0.2 + hoverFactor * 0.75;

          // Gradient color shifting: Pink/Crimson (#e11d48) near center -> Violet/Purple (#7f489f) -> Sapphire (#3b82f6)
          if (hoverFactor > 0.6) {
            this.color = '225, 29, 72'; // Ignito pink
          } else if (hoverFactor > 0.3) {
            this.color = '127, 72, 159'; // Ignito brand purple
          } else {
            this.color = '59, 130, 246'; // Vivid sapphire
          }
        } else {
          this.radius = this.baseRadius;
          this.alpha = 0.18;
          this.color = '127, 72, 159';
        }
      }

      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        context.fill();
      }
    }

    // Initialize/Rebuild grid on resize
    function initGrid() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = offsetX + c * spacing;
          const oy = offsetY + r * spacing;
          dots.push(new Dot(ox, oy));
        }
      }
    }

    initGrid();

    // Mouse movement event listener
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      if (cx >= 0 && cx <= width && cy >= 0 && cy <= height) {
        ripples.push({
          x: cx,
          y: cy,
          currentRadius: 0,
          maxRadius: 220,
          thickness: 45,
          speed: 6
        });
      }
    };

    // Touch event support for tablets / touchscreens
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.isHovered = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.isHovered = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize observer to handle dynamic viewport changes
    const resizeObserver = new ResizeObserver(() => {
      initGrid();
    });
    resizeObserver.observe(canvas);

    // Animation render loop
    let lastTime = performance.now();
    const render = (time) => {
      // Smooth mouse interpolation for buttery motion
      if (mouse.isHovered) {
        mouse.x += (mouse.targetX - mouse.x) * 0.18;
        mouse.y += (mouse.targetY - mouse.y) * 0.18;
      } else {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle interactive cursor spotlight glow
      if (mouse.isHovered && mouse.x > -500) {
        const spotlight = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius * 1.15
        );
        spotlight.addColorStop(0, 'rgba(127, 72, 159, 0.08)');
        spotlight.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
        spotlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.currentRadius += r.speed;
        if (r.currentRadius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 3. Update & Draw dots
      const activeDots = [];
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.update(time);
        dot.draw(ctx);

        if (dot.alpha > 0.3) {
          activeDots.push(dot);
        }
      }

      // 4. Subtle connective constellation lines between active dots near cursor
      const maxConnectDist = spacing * 1.45;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < activeDots.length; i++) {
        for (let j = i + 1; j < activeDots.length; j++) {
          const d1 = activeDots[i];
          const d2 = activeDots[j];
          const ldx = d1.x - d2.x;
          const ldy = d1.y - d2.y;
          const lineDist = Math.hypot(ldx, ldy);

          if (lineDist < maxConnectDist) {
            const lineAlpha = (1 - lineDist / maxConnectDist) * Math.min(d1.alpha, d2.alpha) * 0.45;
            ctx.strokeStyle = `rgba(127, 72, 159, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="captiq-dot-bg-canvas"
      aria-hidden="true"
    />
  );
}
