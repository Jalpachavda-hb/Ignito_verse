import React, { useEffect, useRef } from 'react';

/**
 * Professional Interactive Constellation / Particle Network Background
 * 
 * Features:
 * - Fluid, ambient drifting particles in brand-harmonized executive tones
 * - Elegant, subtle connective lines between nearby dots (network mesh)
 * - Dynamic mouse hover interaction:
 *    * Lines smoothly connect cursor to all nearby dots
 *    * Dots illuminate and gently gravitate toward the cursor
 *    * Enhanced connection lines between dots in the cursor's field
 *    * Smooth luminous nexus node at cursor position
 * - Crisp High-DPI canvas rendering with butter-smooth 60/120fps animation
 * - Graceful window resize and tab visibility handling
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

    // Elegant brand color palette: Ignito Purple, Deep Indigo, Vivid Violet, Soft Slate
    const COLOR_PALETTES = [
      { r: 127, g: 72,  b: 159 }, // #7f489f (Ignito Brand Purple)
      { r: 99,  g: 102, b: 241 }, // #6366f1 (Indigo Accent)
      { r: 168, g: 85,  b: 247 }, // #a855f7 (Bright Violet)
      { r: 59,  g: 130, b: 246 }, // #3b82f6 (Sapphire Blue)
      { r: 217, g: 70,  b: 239 }, // #d946ef (Soft Magenta)
    ];

    // Mouse tracking state
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovered: false,
      radius: 175, // Radius within which mouse connects to dots
      intensity: 0 // Smooth transition factor for mouse entering/leaving
    };

    let particles = [];
    const maxConnectDist = 125; // Distance threshold for dot-to-dot line connections

    class Particle {
      constructor(w, h, isInitial = false) {
        this.reset(w, h, isInitial);
      }

      reset(w, h, isInitial = false) {
        this.x = isInitial ? Math.random() * w : (Math.random() > 0.5 ? -10 : w + 10);
        this.y = isInitial ? Math.random() * h : Math.random() * h;
        
        // Very gentle, ambient drifting speed (smooth & non-distracting)
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.28 + Math.random() * 0.42;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        // Size & visual characteristics
        this.baseRadius = 1.8 + Math.random() * 1.5;
        this.radius = this.baseRadius;
        this.baseAlpha = 0.35 + Math.random() * 0.25;
        this.alpha = this.baseAlpha;

        // Palette assignment
        const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
        this.r = palette.r;
        this.g = palette.g;
        this.b = palette.b;

        // Hover reaction state
        this.hoverEffect = 0;
      }

      update(w, h) {
        // Natural ambient drift
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around borders with soft margin
        const margin = 20;
        if (this.x < -margin) this.x = w + margin;
        if (this.x > w + margin) this.x = -margin;
        if (this.y < -margin) this.y = h + margin;
        if (this.y > h + margin) this.y = -margin;

        // Mouse hover interaction: gentle magnetic attraction & brightening
        if (mouse.intensity > 0.01 && mouse.x > -500) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius && dist > 1) {
            const factor = (1 - dist / mouse.radius) * mouse.intensity;
            this.hoverEffect += (factor - this.hoverEffect) * 0.15;

            // Gentle, smooth magnetic pull toward cursor (subtle, non-jarring)
            const pullForce = factor * 0.65;
            this.x += (dx / dist) * pullForce;
            this.y += (dy / dist) * pullForce;
          } else {
            this.hoverEffect += (0 - this.hoverEffect) * 0.08;
          }
        } else {
          this.hoverEffect += (0 - this.hoverEffect) * 0.08;
        }

        // Dynamic size & alpha based on hover proximity
        this.radius = this.baseRadius + this.hoverEffect * 1.8;
        this.alpha = Math.min(0.9, this.baseAlpha + this.hoverEffect * 0.5);
      }

      draw(context) {
        // Soft outer glow when hovered
        if (this.hoverEffect > 0.08) {
          context.beginPath();
          context.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
          context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.hoverEffect * 0.22})`;
          context.fill();
        }

        // Main particle dot
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
        context.fill();
      }
    }

    // Initialize or re-populate particles based on screen dimensions
    function initParticles() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Balanced density: ~85 particles on 1080p, clamped between 50 and 110
      const area = width * height;
      const targetCount = Math.min(115, Math.max(50, Math.floor(area / 16000)));

      particles = [];
      for (let i = 0; i < targetCount; i++) {
        particles.push(new Particle(width, height, true));
      }
    }

    initParticles();

    // Event listeners for fluid mouse and touch tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

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
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Dynamic resize observer for responsive canvas adjustments
    const resizeObserver = new ResizeObserver(() => {
      initParticles();
    });
    resizeObserver.observe(canvas);

    // Main 60fps render loop
    const render = () => {
      // Smooth interpolation for mouse movement and enter/leave transitions
      if (mouse.isHovered) {
        mouse.x += (mouse.targetX - mouse.x) * 0.16;
        mouse.y += (mouse.targetY - mouse.y) * 0.16;
        mouse.intensity += (1 - mouse.intensity) * 0.12;
      } else {
        mouse.intensity += (0 - mouse.intensity) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw connective lines between nearby dots (constellation mesh)
      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i];
        p1.update(width, height);

        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            // Ambient line opacity
            const baseFactor = 1 - dist / maxConnectDist;
            let lineAlpha = baseFactor * 0.18;

            // If either particle is near the active mouse, illuminate the connective line
            const boost = Math.max(p1.hoverEffect, p2.hoverEffect);
            if (boost > 0.05) {
              lineAlpha += boost * 0.28;
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(127, 72, 159, ${lineAlpha})`;
            ctx.lineWidth = 0.75 + boost * 0.45;
            ctx.stroke();
          }
        }
      }

      // 2. Dynamic Mouse Connections: On mouse hover, connect lines from cursor to dots
      if (mouse.intensity > 0.02 && mouse.x > -500) {
        // Draw soft ambient aura at cursor center
        const cursorGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius * 0.95
        );
        cursorGlow.addColorStop(0, `rgba(127, 72, 159, ${0.12 * mouse.intensity})`);
        cursorGlow.addColorStop(0.5, `rgba(99, 102, 241, ${0.05 * mouse.intensity})`);
        cursorGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 0.95, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();

        // Connect cursor to every dot within hover radius
        for (let i = 0; i < pLen; i++) {
          const p = particles[i];
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const factor = (1 - dist / mouse.radius) * mouse.intensity;
            const lineAlpha = factor * 0.65; // Crisp, visible, premium connection

            // Elegant gradient line connecting cursor to dot
            const lineGrad = ctx.createLinearGradient(mouse.x, mouse.y, p.x, p.y);
            lineGrad.addColorStop(0, `rgba(168, 85, 247, ${lineAlpha})`);
            lineGrad.addColorStop(1, `rgba(${p.r}, ${p.g}, ${p.b}, ${lineAlpha * 0.75})`);

            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 1.0 + factor * 0.8;
            ctx.stroke();
          }
        }

        // Draw central interactive cursor nexus node
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(127, 72, 159, ${0.85 * mouse.intensity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 5.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.45 * mouse.intensity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 3. Draw all dots on top of the lines for crisp visual depth
      for (let i = 0; i < pLen; i++) {
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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
