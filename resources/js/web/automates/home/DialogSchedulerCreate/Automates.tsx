import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    StarIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Pagination from "@/components/pagination/Pagination";
import Automate from "./Automate";


interface AutomatesProps
{
    project: any
    onAutomatesSelect: (data: any) => void
}


interface AutomatesState
{
    data: any
    dataAutomatesSelected: any
}

export default class Automates extends React.Component<AutomatesProps, AutomatesState>
{

    constructor(props: AutomatesProps)
    {
        super(props)
        this.state = {
            data: null,
            dataAutomatesSelected: [],
        }
    }

    componentDidMount(): void {
        this.search()
    }

    componentDidUpdate(prevProps: Readonly<AutomatesProps>, prevState: Readonly<AutomatesState>, snapshot?: any): void 
    {
        if ((prevProps.project && this.props.project === null)
            || (this.props.project && prevProps.project?.id !== this.props.project.id)) 
        {
            this.search()
        }
    }
    
    async search(url: string = `/automates/search`)
    {
        if (!this.props.project)
        {
            this.setState({
                data: null,
            })
            return 
        }

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const formData = {
            is_asc: false,
            max: 20,
            project_id: this.props.project.id,
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

    automateIsSelected(data: any)
    {
        return this.state.dataAutomatesSelected.some((automate: any) => automate.id === data.id)
    }

    handleOnPrev()
    {
        if (this.state.data && this.state.data.next_page_url)
            this.search(this.state.data.prev_page_url)
    }

    handleOnNext()
    {
        if (this.state.data && this.state.data.next_page_url)
            this.search(this.state.data.next_page_url)
    }

    handleAutomatesOnSelect(data: any)
    {
        const { dataAutomatesSelected } = this.state;
        const isSelected = this.automateIsSelected(data)
        let updatedSelected;

        if (isSelected)
            updatedSelected = dataAutomatesSelected.filter((selected: any) => selected.id !== data.id)
        else
            updatedSelected = [...dataAutomatesSelected, data]

        this.setState({
            dataAutomatesSelected: updatedSelected,
        }, () => this.props.onAutomatesSelect(this.state.dataAutomatesSelected))
    }

    // --- RENDER

    renderAutomates()
    {
        const data = this.state.data && this.state.data.data.length ? this.state.data.data : null
        if (!data)
            return (<></>)

        const elements: any = []
        for (let index = 0; index < data.length; index++) 
        {
            const automate = data[index]

            elements.push(
                <Automate key={index} data={ automate }
                    isSelected={ this.automateIsSelected(automate) }
                    onSelect={ (data: any) => this.handleAutomatesOnSelect(data) } />
            )
        }
        return (
            <div className="list">
                <div className="automates">
                    { elements }
                </div>
                <Pagination 
                    onPrev={ () => this.handleOnPrev() }
                    onNext={ () => this.handleOnNext() } />
            </div>
        )
    }

    renderMessageEmpty()
    {
        const data = this.state.data && this.state.data.data.length ? this.state.data.data : null
        if (data)
            return (<></>)

        return (
            <div className="message-empty">
                <div className="block-left">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBOAY2GirJ7l7jW5IV1WLf3J38e6lD3UAoXtip4yYhZmgjRfwHDizlxUgp2N6YfcwXKs&usqp=CAU" alt="" />
                </div>
                <div className="block-right">
                    <p>Please choose a project in order to select the available automata for it.</p>
                </div>
            </div>
        )
    }

    render()
    {
        return (
            <div className="c-automates">
                { this.renderAutomates() }
                { this.renderMessageEmpty() }
            </div>
        )
    }
}