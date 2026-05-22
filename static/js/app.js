document.addEventListener('DOMContentLoaded', () => {
    
    // --- PRELOADER & TYPEWRITER ---
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                initTypewriter();
            }, 1000);
        }
    }, 2000);

    function initTypewriter() {
        const text = "Defying Gravity through Code and Art. Welcome to my creative dimension.";
        const el = document.querySelector('.typewriter');
        if(el) {
            el.innerHTML = '';
            let i = 0;
            function type() {
                if (i < text.length) {
                    el.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, 30);
                }
            }
            type();
        }
    }

    // --- AUDIO CONTROLS (Foolproof Audio Context) ---
    // Instead of relying on HTML <audio>, we construct it purely in JS
    let bgMusic = new Audio();
    // Assuming Flask structure: /static/audio/ambient.mp3
    bgMusic.src = "/static/audio/ambient.mp3"; 
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    const muteBtn = document.getElementById('mute-btn');
    const volSlider = document.getElementById('volume-slider');
    let musicStarted = false;

    // Listen for the absolute first interaction anywhere
    const playMusicOnInteract = () => {
        if (!musicStarted) {
            bgMusic.play().then(() => {
                musicStarted = true;
                console.log("Audio started successfully!");
            }).catch(e => {
                console.log("Audio blocked by browser, waiting for stricter interaction.");
            });
            // Remove listeners once it tries to start
            document.removeEventListener('click', playMusicOnInteract);
            document.removeEventListener('scroll', playMusicOnInteract);
            document.removeEventListener('keydown', playMusicOnInteract);
        }
    };

    document.addEventListener('click', playMusicOnInteract);
    document.addEventListener('scroll', playMusicOnInteract);
    document.addEventListener('keydown', playMusicOnInteract);

    if(muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(bgMusic.muted) {
                bgMusic.muted = false;
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            } else {
                bgMusic.muted = true;
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
        });
    }

    if(volSlider) {
        volSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            bgMusic.volume = e.target.value;
        });
    }

    // --- THEME CONTROLS ---
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.toggle('light-mode');
            if(document.body.classList.contains('light-mode')){
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
            } else {
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
            }
        });
    }

    // --- CUSTOM CURSOR ---
    const cursor = document.getElementById('custom-cursor');
    const cursorLight = document.getElementById('cursor-light');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        if(cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        if(cursorLight) cursorLight.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const interactiveElements = document.querySelectorAll('a, button, .glass-card, .skill-card, .social-icon');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => { if(cursor) cursor.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { if(cursor) cursor.classList.remove('hover'); });
    });

    // --- SCROLL REVEALS & PROGRESS BARS ---
    if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach(el => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: "top 85%", toggleClass: "active", once: true }
            });
        });

        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const circle = card.querySelector('.progress-ring__circle');
                const score = parseInt(card.getAttribute('data-score'));
                const radius = circle.r.baseVal.value;
                const circumference = radius * 2 * Math.PI;
                circle.style.strokeDashoffset = circumference - (score / 100) * circumference;
            });
            
            card.addEventListener('mouseleave', () => {
                const circle = card.querySelector('.progress-ring__circle');
                const radius = circle.r.baseVal.value;
                const circumference = radius * 2 * Math.PI;
                circle.style.strokeDashoffset = circumference;
            });
        });
    }

    // --- THREE.JS BACKGROUND ---
    const bgCanvas = document.getElementById('webgl-canvas');
    if(bgCanvas && typeof THREE !== 'undefined') {
        const bgScene = new THREE.Scene();
        bgScene.fog = new THREE.FogExp2(0x030305, 0.001);
        
        const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        bgCamera.position.z = 30;
        
        const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 100; }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05, color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        bgScene.add(particlesMesh);

        const mouseLight = new THREE.PointLight(0xd16bff, 2, 50);
        bgScene.add(mouseLight);

        // --- THREE.JS HERO ELEMENT ---
        const heroContainer = document.getElementById('hero-3d-container');
        const heroScene = new THREE.Scene();
        const heroCamera = new THREE.PerspectiveCamera(45, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 100);
        heroCamera.position.z = 10;
        
        const heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroContainer.appendChild(heroRenderer.domElement);

        const coreGeometry = new THREE.IcosahedronGeometry(2, 1);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000, emissive: 0xd16bff, emissiveIntensity: 0.5,
            wireframe: true, transparent: true, opacity: 0.9,
        });
        const heroCore = new THREE.Mesh(coreGeometry, coreMaterial);
        heroScene.add(heroCore);

        const cageGeometry = new THREE.IcosahedronGeometry(2.5, 0);
        const cageMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 });
        const heroCage = new THREE.Mesh(cageGeometry, cageMaterial);
        heroScene.add(heroCage);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        heroScene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 5, 5);
        heroScene.add(dirLight);

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.02 + (mouseX * 0.0001);
            particlesMesh.rotation.x = elapsedTime * 0.01 + (mouseY * 0.0001);
            particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 2;
            
            const vec = new THREE.Vector3();
            const pos = new THREE.Vector3();
            vec.set((mouseX / window.innerWidth) * 2 - 1, -(mouseY / window.innerHeight) * 2 + 1, 0.5);
            vec.unproject(bgCamera);
            vec.sub(bgCamera.position).normalize();
            const distance = -bgCamera.position.z / vec.z;
            pos.copy(bgCamera.position).add(vec.multiplyScalar(distance));
            mouseLight.position.copy(pos);

            bgRenderer.render(bgScene, bgCamera);

            heroCore.rotation.y += 0.005;
            heroCore.rotation.x += 0.002;
            heroCage.rotation.y -= 0.003;
            heroCage.rotation.z += 0.001;
            
            heroCore.position.y = Math.sin(elapsedTime * 2) * 0.2;
            heroCage.position.y = Math.sin(elapsedTime * 2) * 0.2;

            const targetRotX = (mouseY - window.innerHeight/2) * 0.001;
            const targetRotY = (mouseX - window.innerWidth/2) * 0.001;
            
            heroCore.rotation.x += (targetRotX - heroCore.rotation.x) * 0.1;
            heroCore.rotation.y += (targetRotY - heroCore.rotation.y) * 0.1;

            heroRenderer.render(heroScene, heroCamera);
        }
        animate();

        window.addEventListener('resize', () => {
            bgCamera.aspect = window.innerWidth / window.innerHeight;
            bgCamera.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
            
            if (heroContainer) {
                heroCamera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
                heroCamera.updateProjectionMatrix();
                heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
            }
        });
    }
});