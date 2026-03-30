document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Intersection Observer for Fade-Up Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));


    /* --- Hero Canvas Particle Mesh Network --- */
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let particlesList = [];
    const maxParticles = 80;
    const connectionRadius = 150;
    
    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5; // slow speed
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1; // 1 to 3px
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)'; // Cyan glow
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particlesList.push(new Particle());
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear background

        // Update & Draw particles
        particlesList.forEach(p => p.update());
        
        // Draw connections
        for (let i = 0; i < particlesList.length; i++) {
            for (let j = i + 1; j < particlesList.length; j++) {
                const dx = particlesList[i].x - particlesList[j].x;
                const dy = particlesList[i].y - particlesList[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionRadius) {
                    // Opacity based on distance
                    const opacity = 1 - (distance / connectionRadius);
                    ctx.beginPath();
                    ctx.moveTo(particlesList[i].x, particlesList[i].y);
                    ctx.lineTo(particlesList[j].x, particlesList[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.4})`; // Purple line network
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw circles on top of lines
        particlesList.forEach(p => p.draw());
    }

    animate();

});
