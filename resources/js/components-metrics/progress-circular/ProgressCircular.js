export default class ProgressCircular {
    element = null
    canvas = null
    data = {
        colorBackground: '#70536f',
        color: '#f9f871',
        label: "Done",
        value: 10.99, // entre 0 et 100
        animationIsEnabled: true,
        animationDuration: 2000, // en ms
        animationDelay: 2000 // en ms
    }

    progress = 0 // progress courant pour l’animation (0 → value)
    startTime = null
    animating = false

    constructor(arg) {
        this.element = arg.element ? arg.element : document.querySelector(arg.selector)
        if (arg.data) {
            this.data = { ...this.data, ...arg.data }
        }

        this.setup()
        this.addEventListeners()

        this.resizeObserver = new ResizeObserver(() => {
            this.resize()
        })
        this.resizeObserver.observe(this.element)
    }

    setup() {
        const rect = this.element.getBoundingClientRect()
        this.canvas = document.createElement('canvas')
        this.canvas.width = rect.width
        this.canvas.height = rect.height
        this.element.appendChild(this.canvas)
    }

    refresh() {
        this.canvas?.remove(); // supprime le canvas existant s'il y a
        this.setup();
        this.render();
        this.startAnimation()
    }

    resize() {
        const rect = this.element.getBoundingClientRect()
        this.canvas.width = rect.width
        this.canvas.height = rect.height
        this.render()
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseEvent(event))
        this.canvas.addEventListener('click', (event) => this.handleMouseEvent(event))
        this.canvas.addEventListener('touchstart', (event) => this.handleTouchEvent(event))
        this.canvas.addEventListener('touchend', (event) => this.handleTouchEvent(event))
    }

    handleMouseEvent(event) {
        const rect = this.canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        this.checkSquareHover(x, y)
    }

    handleTouchEvent(event) {
        const rect = this.canvas.getBoundingClientRect()
        const touch = event.touches[0]
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        this.checkSquareHover(x, y)
    }

    checkSquareHover(x, y) {
        // rien pour l’instant
    }

    drawBackgroundProgress() {
        const ctx = this.canvas.getContext('2d')
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.8
        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2
        const lineWidth = 10
        const radius = Math.max(0, (size / 2) - (lineWidth / 2))

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.strokeStyle = this.data.colorBackground
        ctx.lineWidth = lineWidth
        ctx.stroke()
    }


    drawProgress() 
    {
        const ctx = this.canvas.getContext('2d');
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.8;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const lineWidth = 10;

        // Calcul sécurisé du rayon
        const rawRadius = size / 2;
        const radius = Math.max(0, rawRadius - lineWidth / 2); // Évite un rayon négatif

        // Si le rayon est nul ou insuffisant, on saute le dessin
        if (radius <= 0) return;

        const progressPercent = Math.max(0, Math.min(1, this.progress / 100));

        ctx.beginPath();
        ctx.strokeStyle = this.data.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.arc(
            centerX,
            centerY,
            radius,
            -Math.PI / 2,
            -Math.PI / 2 + 2 * Math.PI * progressPercent
        );
        ctx.stroke();
    }


    drawLabelValue() 
    {
        const ctx = this.canvas.getContext('2d')
        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Label
        ctx.fillStyle = 'white'
        ctx.font = 'bold 20px Arial'
        const label = this.data.label ?? "Done"; // <- fallback
        ctx.fillText(label, centerX, centerY - 10)

        // Value animée
        ctx.fillStyle = this.data.color ?? '#f9f871'
        ctx.font = '30px Arial'
        const displayValue = typeof this.progress === 'number' ? this.progress.toFixed(2) : '0.00';
        ctx.fillText(`${displayValue}%`, centerX, centerY + 25)
    }


    render() {
        const ctx = this.canvas.getContext('2d')
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBackgroundProgress()
        this.drawProgress()
        this.drawLabelValue()
    }

    animationX() {
        this.animating = true
        this.startTime = performance.now()
        const duration = this.data.animationDuration
        const target = this.data.value

        const animate = (now) => {
            const elapsed = now - this.startTime
            const progress = Math.min(elapsed / duration, 1)
            this.progress = target * progress
            this.render()

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                this.animating = false
            }
        }

        requestAnimationFrame(animate)
    }

    startAnimation()
    {
        if (this.data.animationIsEnabled) {
            setTimeout(() => {
                this.animationX()
            }, this.data.animationDelay)
        } else {
            this.progress = this.data.value
            this.render()
        }
    }
}
