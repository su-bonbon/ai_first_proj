import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

document.addEventListener('DOMContentLoaded', function() {

    // Three.js Scene
    let scene, camera, renderer, torus;

    function initThree() {
        const container = document.getElementById('hero-animation');
        if (!container) return;

        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Object
        const geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
        const material = new THREE.MeshStandardMaterial({ color: 0x38BDF8, metalness: 0.7, roughness: 0.4 });
        torus = new THREE.Mesh(geometry, material);
        scene.add(torus);

        // Lights
        const pointLight = new THREE.PointLight(0xffffff, 0.1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

        animate();
    }

    function onWindowResize() {
        const container = document.getElementById('hero-animation');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        torus.rotation.x += 0.001;
        torus.rotation.y += 0.005;
        torus.rotation.z += 0.001;

        renderer.render(scene, camera);
    }

    initThree();

    // Theme switcher logic
    const themeToggle = document.getElementById('checkbox');
    const htmlEl = document.documentElement;

    function switchTheme(e) {
        if (e.target.checked) {
            htmlEl.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    themeToggle.addEventListener('change', switchTheme, false);

    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (currentTheme) {
        htmlEl.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggle.checked = true;
        }
    } else if (prefersDark) {
        htmlEl.setAttribute('data-theme', 'dark');
    } else {
        htmlEl.setAttribute('data-theme', 'light');
        themeToggle.checked = true;
    }


    // Intersection Observer for fade-in animations
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('is-visible');
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

});
