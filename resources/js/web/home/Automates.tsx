import React from "react"
import {
    PlayIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';


interface AutomatesProps
{
    
}


interface AutomatesState
{
    data: any
}

export default class Automates extends React.Component<any, AutomatesState>
{

    constructor(props: any)
    {
        super(props)
        this.state = {
            data: null,
        }
    }

    
    componentDidMount(): void 
    {
        this.search()
    }

    async search()
    {
        const formData = {
            is_asc: false,
            max: 2,
        }
    
        const url: string = `/automates/search`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result)
            this.setState({
                data: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    async execute(data: any)
    {
        const url: string = `/automates/${data.id}/execute`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const formData = new FormData()
        //formData.append('_method', 'PATCH')
        formData.append('status', String(data.status === 1 ? 2 : 1))

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData,
            })

            const result = await response.json()
            console.log(result)
            this.search()
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    handleOnExecute(data: any)
    {
        this.execute(data)
    }

    renderAutomates()
    {
        const automates: any = []
        const automatesData: any = this.state.data ? this.state.data.data : []

        for (let index = 0; index < automatesData.length && index < 5; index++) 
        {
            const automate = automatesData[index]
            automates.push(
                <div className={ "automate" + (index === 0 ? ' on-progress' : '') } key={ index }>
                    <div className="icon">
                        <ClockIcon />
                    </div>
                    <div className="name">{ automate.name }</div>
                    <div className="duration">{ automate.exec_info.value_text }</div>
                    <button type="button"
                        onClick={ () => this.handleOnExecute(automate) }>
                        <PlayIcon />
                    </button>
                </div>
            )
        }
        return automates
    }

    render()
    {
        return (
            <div className="h-automates">
                <div className="label">
                    <h6>Automates <span className="total">(5)</span></h6>
                </div>
                <div className="list">
                    { this.renderAutomates() }
                </div>
            </div>
        )
    }
}