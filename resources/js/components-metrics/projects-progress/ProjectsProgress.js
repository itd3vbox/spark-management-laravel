export default class ProjectsProgress
{
    element = null
    elementList = null

    data = [
        // { logo: '/images/project-cube.png', name: 'Project 1', progress: 20.00 },
        // { logo: '/images/project-cube.png', name: 'Project 2', progress: 88.11 },
        // { logo: '/images/project-cube.png', name: 'Project 3', progress: 44.33 }
    ]

    constructor(arg)
    {
        this.element = arg.element 
            ? arg.element 
            : document.querySelector(arg.selector)

        this.elementList = document.createElement('div')
        this.elementList.classList.add('projects-progress')

        this.element.appendChild(this.elementList)

        this.setup()
    }

    setup()
    {
        this.renderList()
    }

    refresh() 
    {
        // Supprime l'ancienne liste
        if (this.elementList && this.elementList.parentNode) {
            this.element.removeChild(this.elementList);
        }

        // Recrée une nouvelle div pour la liste
        this.elementList = document.createElement('div');
        this.elementList.classList.add('projects-progress');
        this.element.appendChild(this.elementList);

        // Rebuild complet avec les nouvelles données
        this.renderList();
    }


    // Génère un item dynamique
    getItem(item)
    {
        return `
            <div class="item"> 
                <div class="logo">
                    <img src="${item.logo}" alt="${item.name}"> 
                </div>
                <div class="info">
                    <div class="name">${item.name}</div>
                    <div class="progress-bar-value">
                        <div class="progress-bar">
                            <div class="progress" data-progress="${item.progress}">
                            </div>
                        </div>
                        <div class="value">${item.progress.toFixed(2)}%</div>
                    </div>
                </div>
            </div>
        `
    }

    renderList()
    {
        const html = this.data
            .map(item => this.getItem(item))
            .join('')

        this.elementList.innerHTML = html

        // 🔥 lance l’animation après insertion DOM
        this.animateProgress()
    }

    animateProgress()
    {
        const bars = this.elementList.querySelectorAll('.progress')

        bars.forEach(bar => {
            const value = bar.dataset.progress

            // force le navigateur à appliquer width:0 avant transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.width = value + '%'
                })
            })
        })
    }

    render()
    {
        this.renderList()
    }
}
