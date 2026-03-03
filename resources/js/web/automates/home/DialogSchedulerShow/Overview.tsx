import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Pagination from "@/components/pagination/Pagination";
import Scheduler from "./Scheduler";


interface OverviewProps
{
    isNeedSearch: boolean
}


interface OverviewState
{
    data: any
    dataAutomatesScheduler: any
}

export default class Overview extends React.Component<OverviewProps, OverviewState>
{

    constructor(props: OverviewProps)
    {
        super(props)
        this.state = {
            data: {
                keywords: '',
            },
            dataAutomatesScheduler: null,
        }
    }

    componentDidMount(): void {
        this.search()
    }

    componentDidUpdate(prevProps: Readonly<OverviewProps>, prevState: Readonly<OverviewState>, snapshot?: any): void {
        if (prevProps.isNeedSearch !== this.props.isNeedSearch)
            this.search()
    }

    async search(url: string = `/automates-scheduler/search`)
    {
        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const formData = {
            is_asc: false,
            max: 20,
            keywords: this.state.data.keywords,
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
                ...this.state,
                dataAutomatesScheduler: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    // --- RENDER ---

    renderAutomatesSchedulers()
    {
        if (!this.state.dataAutomatesScheduler || !this.state.dataAutomatesScheduler.data.length)
            return (<></>)

        const elements: any = []
        const dataAutomatesScheduler = this.state.dataAutomatesScheduler.data

        for (let index = 0; index < dataAutomatesScheduler.length; index++)
        {
            const data = dataAutomatesScheduler[index]

            elements.push(
                <Scheduler key={ data.id } data={ data } />
            )
        }

        return (
            <div className="list">
                <div className="automates-schedulers">
                    { elements }
                </div>
                <Pagination />
            </div>
        )
    }

    renderMessageEmpty()
    {
        if (this.state.dataAutomatesScheduler && this.state.dataAutomatesScheduler.data.length)
            return (<></>)

        return (
            <div className="message-empty">
                <div className="block-leff"></div>
                <div className="block-right">
                    <div className="text">
                        <p>Nothing planned for the moment!</p>
                    </div>
                </div>
            </div>
        )
    }

    render()
    {
        return (
            <div className="c-overview">
                { this.renderAutomatesSchedulers() }
                { this.renderMessageEmpty() }
            </div>
        )
    }
}