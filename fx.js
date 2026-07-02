// Code of Meridaeia - Ambient FX
// Ember particle background for the game shell. Dependency-free canvas 2D.
// Performance rules: rAF only, particle count halves on small screens,
// rendering pauses when the tab is hidden, fully disabled under
// prefers-reduced-motion.

(function () {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const canvas = document.getElementById('bg-embers');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isSmall = matchMedia('(max-width: 768px)').matches;
    let W, H, embers = [], rafId = null;

    function sizeCanvas() {
        W = canvas.width = innerWidth;
        H = canvas.height = innerHeight;
    }

    function makeEmber() {
        return {
            x: Math.random() * W,
            y: H + Math.random() * H * 0.3,
            r: 0.8 + Math.random() * 2,
            vy: 0.2 + Math.random() * 0.7,
            vx: (Math.random() - 0.5) * 0.3,
            // mostly warm embers, some arcane indigo sparks
            hue: Math.random() < 0.65 ? 24 : 244,
            life: 0.25 + Math.random() * 0.45,
            phase: Math.random() * Math.PI * 2
        };
    }

    function initEmbers() {
        embers = Array.from({ length: isSmall ? 25 : 55 }, makeEmber);
    }

    function draw(t) {
        ctx.clearRect(0, 0, W, H);
        for (const e of embers) {
            e.y -= e.vy;
            e.x += e.vx + Math.sin(t / 950 + e.phase) * 0.22;
            if (e.y < -12) Object.assign(e, makeEmber(), { y: H + 12 });

            const flicker = 0.55 + 0.45 * Math.sin(t / 240 + e.phase);
            const alpha = e.life * flicker * Math.min(1, e.y / (H * 0.25));
            const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
            g.addColorStop(0, `hsla(${e.hue}, 95%, 62%, ${alpha})`);
            g.addColorStop(1, `hsla(${e.hue}, 95%, 55%, 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
            ctx.fill();
        }
        rafId = requestAnimationFrame(draw);
    }

    function start() {
        if (rafId === null) rafId = requestAnimationFrame(draw);
    }

    function stop() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    sizeCanvas();
    initEmbers();
    start();
    addEventListener('resize', () => { sizeCanvas(); initEmbers(); });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();
