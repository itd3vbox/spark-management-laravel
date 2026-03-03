export default class ComponentMetric
{
    element = null
    canvas = null


    constructor(arg)
    {
        this.element = arg.element ? arg.element : document.querySelector(arg.selector)
        this.setup()
        this.addEventListeners()
    }

    setup()
    {
        const rect = this.element.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        console.log(this.element.getBoundingClientRect())
        this.canvas =  document.createElement('canvas')
        this.canvas.width = width // * 0.9
        this.canvas.height = height // * 0.9
        this.element.appendChild(this.canvas)
    }

    addEventListeners() 
    {
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseEvent(event))
        this.canvas.addEventListener('click', (event) => this.handleMouseEvent(event))
        this.canvas.addEventListener('touchstart', (event) => this.handleTouchEvent(event))
        this.canvas.addEventListener('touchend', (event) => this.handleTouchEvent(event))
    }

    handleMouseEvent(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.checkSquareHover(x, y);
    }

    handleTouchEvent(event) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.checkSquareHover(x, y);
    }

    checkSquareHover(x, y)
    {
        
    }
        
    drawXAxis() {
        
    }
    
    drawYAxis() {
    }
    

    drawSquares()
    {
    }

    render()
    {
        this.drawXAxis()
        this.drawYAxis()
        this.drawSquares()
    }
}