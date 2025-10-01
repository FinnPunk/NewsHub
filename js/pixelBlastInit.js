// PixelBlast инициализация для vanilla JS проекта
// Vanilla JS версия с настройками из вашего примера

class PixelBlastVanilla {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            variant: options.variant || 'circle',
            pixelSize: options.pixelSize || 6,
            color: options.color || '#B19EEF',
            patternScale: options.patternScale || 3,
            patternDensity: options.patternDensity || 1.2,
            pixelSizeJitter: options.pixelSizeJitter || 0.5,
            enableRipples: options.enableRipples !== false,
            rippleSpeed: options.rippleSpeed || 0.4,
            rippleThickness: options.rippleThickness || 0.12,
            rippleIntensityScale: options.rippleIntensityScale || 1.5,
            speed: options.speed || 0.6,
            edgeFade: options.edgeFade || 0.25,
            transparent: options.transparent !== false
        };
        this.isInitialized = false;
        this.clicks = [];
        this.maxClicks = 10;
    }
    
    async init() {
        try {
            if (!window.THREE) {
                await this.loadThreeJS();
            }
            
            this.setupRenderer();
            this.setupScene();
            this.setupShaders();
            this.setupEventListeners();
            this.startAnimation();
            
            this.isInitialized = true;
        } catch (error) {
            this.createFallback();
        }
    }
    
    async loadThreeJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/three@0.158.0/build/three.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    setupRenderer() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'width: 100%; height: 100%; display: block;';
        
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: this.options.transparent,
            antialias: true
        });
        
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.container.appendChild(canvas);
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.clock = new THREE.Clock();
        
        const w = this.container.clientWidth || window.innerWidth;
        const h = this.container.clientHeight || window.innerHeight;
        this.renderer.setSize(w, h, false);
    }
    
    setupShaders() {
        const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            precision highp float;
            uniform vec3 uColor;
            uniform vec2 uResolution;
            uniform float uTime;
            uniform float uPixelSize;
            uniform float uScale;
            uniform float uDensity;
            uniform float uPixelJitter;
            uniform int uEnableRipples;
            uniform float uRippleSpeed;
            uniform float uRippleThickness;
            uniform float uRippleIntensity;
            uniform float uEdgeFade;
            uniform int uShapeType;
            
            const int MAX_CLICKS = 10;
            uniform vec2 uClickPos[MAX_CLICKS];
            uniform float uClickTimes[MAX_CLICKS];
            
            float Bayer2(vec2 a) {
                a = floor(a);
                return fract(a.x / 2.0 + a.y * a.y * 0.75);
            }
            
            float hash11(float n) {
                return fract(sin(n) * 43758.5453);
            }
            
            float vnoise(vec3 p) {
                vec3 ip = floor(p);
                vec3 fp = fract(p);
                float n000 = hash11(dot(ip + vec3(0.0), vec3(1.0, 57.0, 113.0)));
                float n100 = hash11(dot(ip + vec3(1.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
                float n010 = hash11(dot(ip + vec3(0.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
                float n110 = hash11(dot(ip + vec3(1.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
                vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
                float x0 = mix(n000, n100, w.x);
                float x1 = mix(n010, n110, w.x);
                return mix(x0, x1, w.y) * 2.0 - 1.0;
            }
            
            float fbm2(vec2 uv, float t) {
                vec3 p = vec3(uv * uScale, t);
                float amp = 1.0;
                float freq = 1.0;
                float sum = 0.0;
                for (int i = 0; i < 5; i++) {
                    sum += amp * vnoise(p * freq);
                    freq *= 1.25;
                    amp *= 1.0;
                }
                return sum * 0.5 + 0.5;
            }
            
            float maskCircle(vec2 p, float cov) {
                float r = sqrt(cov) * 0.25;
                float d = length(p - 0.5) - r;
                return cov * (1.0 - smoothstep(-0.01, 0.01, d * 2.0));
            }
            
            void main() {
                vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;
                float aspectRatio = uResolution.x / uResolution.y;
                
                vec2 pixelId = floor(fragCoord / uPixelSize);
                vec2 pixelUV = fract(fragCoord / uPixelSize);
                
                float cellPixelSize = 8.0 * uPixelSize;
                vec2 cellId = floor(fragCoord / cellPixelSize);
                vec2 cellCoord = cellId * cellPixelSize;
                vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);
                
                float base = fbm2(uv, uTime * 0.05);
                base = base * 0.5 - 0.65;
                
                float feed = base + (uDensity - 0.5) * 0.3;
                
                if (uEnableRipples == 1) {
                    for (int i = 0; i < MAX_CLICKS; i++) {
                        vec2 pos = uClickPos[i];
                        if (pos.x < 0.0) continue;
                        vec2 cuv = ((pos - uResolution * 0.5) / uResolution) * vec2(aspectRatio, 1.0);
                        float t = max(uTime - uClickTimes[i], 0.0);
                        float r = distance(uv, cuv);
                        float waveR = uRippleSpeed * t;
                        float ring = exp(-pow((r - waveR) / uRippleThickness, 2.0));
                        float atten = exp(-t) * exp(-10.0 * r);
                        feed = max(feed, ring * atten * uRippleIntensity);
                    }
                }
                
                float bayer = Bayer2(fragCoord / uPixelSize) - 0.5;
                float bw = step(0.5, feed + bayer);
                
                float h = fract(sin(dot(pixelId, vec2(127.1, 311.7))) * 43758.5453);
                float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
                float coverage = bw * jitterScale;
                
                float M = maskCircle(pixelUV, coverage);
                
                if (uEdgeFade > 0.0) {
                    vec2 norm = gl_FragCoord.xy / uResolution;
                    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
                    float fade = smoothstep(0.0, uEdgeFade, edge);
                    M *= fade;
                }
                
                gl_FragColor = vec4(uColor, M);
            }
        `;
        
        this.uniforms = {
            uResolution: { value: new THREE.Vector2(
                this.renderer.domElement.width,
                this.renderer.domElement.height
            )},
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(this.options.color) },
            uClickPos: { value: Array.from({ length: this.maxClicks }, () => new THREE.Vector2(-1, -1)) },
            uClickTimes: { value: new Float32Array(this.maxClicks) },
            uShapeType: { value: this.options.variant === 'circle' ? 1 : 0 },
            uPixelSize: { value: this.options.pixelSize * this.renderer.getPixelRatio() },
            uScale: { value: this.options.patternScale },
            uDensity: { value: this.options.patternDensity },
            uPixelJitter: { value: this.options.pixelSizeJitter },
            uEnableRipples: { value: this.options.enableRipples ? 1 : 0 },
            uRippleSpeed: { value: this.options.rippleSpeed },
            uRippleThickness: { value: this.options.rippleThickness },
            uRippleIntensity: { value: this.options.rippleIntensityScale },
            uEdgeFade: { value: this.options.edgeFade }
        };
        
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            transparent: true
        });
        
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
        
        this.clickIndex = 0;
    }
    
    setupEventListeners() {
        const canvas = this.renderer.domElement;
        
        // Обработчик для всей страницы (любые клики/касания)
        const handlePointer = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            // Используем координаты относительно окна
            const fx = e.clientX * scaleX;
            const fy = (window.innerHeight - e.clientY) * scaleY;
            
            this.uniforms.uClickPos.value[this.clickIndex].set(fx, fy);
            this.uniforms.uClickTimes.value[this.clickIndex] = this.uniforms.uTime.value;
            this.clickIndex = (this.clickIndex + 1) % this.maxClicks;
        };
        
        // Слушаем события на document для захвата всех кликов
        document.addEventListener('pointerdown', handlePointer, { passive: true });
        document.addEventListener('touchstart', handlePointer, { passive: true });
        
        // Также добавим движение мыши для интерактивности
        let isMoving = false;
        let moveTimeout;
        document.addEventListener('pointermove', (e) => {
            if (!isMoving) return;
            
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                isMoving = false;
            }, 100);
            
            handlePointer(e);
        }, { passive: true });
        
        document.addEventListener('pointerdown', () => {
            isMoving = true;
        }, { passive: true });
        
        // Resize
        window.addEventListener('resize', () => {
            const w = this.container.clientWidth || window.innerWidth;
            const h = this.container.clientHeight || window.innerHeight;
            this.renderer.setSize(w, h, false);
            this.uniforms.uResolution.value.set(
                this.renderer.domElement.width,
                this.renderer.domElement.height
            );
        });
    }
    
    startAnimation() {
        const animate = () => {
            this.uniforms.uTime.value = this.clock.getElapsedTime() * this.options.speed;
            this.renderer.render(this.scene, this.camera);
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }
    
    // Добавление случайного ripple эффекта
    addRandomRipple() {
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        // Случайные координаты
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        
        const fx = randomX * scaleX;
        const fy = (window.innerHeight - randomY) * scaleY;
        
        this.uniforms.uClickPos.value[this.clickIndex].set(fx, fy);
        this.uniforms.uClickTimes.value[this.clickIndex] = this.uniforms.uTime.value;
        this.clickIndex = (this.clickIndex + 1) % this.maxClicks;
    }
    
    // Запуск автоматических случайных ripple эффектов
    startAutoRipples(interval = 4000) {
        this.autoRippleInterval = setInterval(() => {
            this.addRandomRipple();
        }, interval);
    }
    
    // Остановка автоматических ripple
    stopAutoRipples() {
        if (this.autoRippleInterval) {
            clearInterval(this.autoRippleInterval);
            this.autoRippleInterval = null;
        }
    }
    
    createFallback() {
        this.container.style.background = 'linear-gradient(135deg, rgba(177, 158, 239, 0.1) 0%, rgba(6, 0, 16, 0.95) 100%)';
    }
    
    destroy() {
        // Останавливаем автоматические ripple
        this.stopAutoRipples();
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.material) this.material.dispose();
        if (this.mesh && this.mesh.geometry) this.mesh.geometry.dispose();
        if (this.renderer) this.renderer.dispose();
        
        // Очистка обработчиков событий
        // Note: В текущей реализации обработчики остаются, 
        // для полной очистки нужно сохранять ссылки на функции
    }
}

// Инициализация при загрузке страницы
async function initPixelBlast() {
    // Создаем контейнер для PixelBlast
    const container = document.createElement('div');
    container.id = 'pixelBlastBackground';
    container.className = 'pixel-blast-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -10;
        pointer-events: auto;
    `;
    
    // Вставляем контейнер в начало body
    document.body.insertBefore(container, document.body.firstChild);
    
    // Определяем цвет в зависимости от текущей темы
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeColor = currentTheme === 'dark' ? '#4A90E2' : '#FF6B47';
    
    // Настройки PixelBlast из вашего примера
    const pixelBlastConfig = {
        variant: 'circle',
        pixelSize: 6,
        color: themeColor, // Используем цвет в зависимости от темы
        patternScale: 3,
        patternDensity: 1.2,
        pixelSizeJitter: 0.5,
        enableRipples: true,
        rippleSpeed: 0.4,
        rippleThickness: 0.12,
        rippleIntensityScale: 1.5,
        speed: 0.6,
        edgeFade: 0.25,
        transparent: true
    };
    
    // Создаем и инициализируем PixelBlast
    const pixelBlast = new PixelBlastVanilla(container, pixelBlastConfig);
    await pixelBlast.init();
    
    // Запускаем автоматические случайные ripple эффекты (каждые 4 секунды)
    pixelBlast.startAutoRipples(4000);
    
    // Сохраняем экземпляр глобально
    window.pixelBlast = pixelBlast;
    
    // Обновление цвета и настроек при смене темы
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const theme = document.documentElement.getAttribute('data-theme');
                
                // Цвета для разных тем
                const colors = {
                    dark: '#4A90E2',   // Синий для темной темы
                    light: '#FF6B47'   // Оранжевый для светлой темы
                };
                
                const newColor = colors[theme] || colors.dark;
                
                if (pixelBlast.uniforms) {
                    // Меняем цвет
                    pixelBlast.uniforms.uColor.value.set(newColor);
                    
                    // Для светлой темы делаем эффект чуть заметнее
                    if (theme === 'light') {
                        pixelBlast.uniforms.uDensity.value = 1.3; // Больше плотность
                        pixelBlast.uniforms.uRippleIntensity.value = 1.8; // Ярче ripple
                    } else {
                        // Для темной темы возвращаем оригинальные значения
                        pixelBlast.uniforms.uDensity.value = 1.2;
                        pixelBlast.uniforms.uRippleIntensity.value = 1.5;
                    }
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// Запускаем инициализацию после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPixelBlast);
} else {
    initPixelBlast();
}
