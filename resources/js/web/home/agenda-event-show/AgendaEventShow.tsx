import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import PickerCalendar from "@/components/form/PickerCalendar";
import './sass/main.sass'
import Hours from "./Hours";
import OverView from "./Overview/Overview";


interface AgendaEventShowProps
{
    data: any
    onStore: () => void
    onUpdate: (data: any) => void
    onDestroy: () => void
}


interface AgendaEventShowState
{
    isSelected: boolean
    formData: {
        [key: string]: any
    }
    data: any
    dataHour: any
}

export default class AgendaEventShow extends React.Component<AgendaEventShowProps, AgendaEventShowState>
{

    constructor(props: AgendaEventShowProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            formData: { id: 0 },
            data: null,
            dataHour: null,
        }
    }

    componentDidMount(): void {
        if (this.props.data)
            this.search()
    }

    componentDidUpdate(prevProps: Readonly<AgendaEventShowProps>, prevState: Readonly<AgendaEventShowState>, snapshot?: any): void {
        if (this.props.data && prevProps.data !== this.props.data)
            this.search()
    }

    async search()
    {
        const url: string = `/agenda/search-day-counts`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const formData = {
            is_asc: false,
            date: this.props.data.date,
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
            console.log('Agenda Events', result)

            const events = result.data // 🔥 IMPORTANT

            this.setState({
                data: events,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    select()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
    }

    handleOnHourOnSelect(data: any)
    {
        console.log('Hour Events', data)
        this.setState({
            dataHour: { 
                date:  this.props.data.date,
                time: data,
            },
        })
    }

    handleOnStore()
    {
        this.search()
        this.props.onStore()
    }

    render()
    {
        if (!this.props.data)
            return (<></>)
        return (
            <div className={ "dialog-agenda-event-show" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Today's Events</h4>
                        <p>View all events scheduled for this date.</p>
                        <div className="date">{ this.props.data.date }</div>
                    </div>
                </div>
                <div className="dc-main">
                    <Hours data={ this.state.data }
                        onSelect={ (data) => this.handleOnHourOnSelect(data) } />
                    <OverView data={ this.state.dataHour } onStore={ () => this.handleOnStore() } />
                </div>
            </div>
        )
    }
}