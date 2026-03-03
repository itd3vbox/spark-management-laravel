import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Calendar from '@/components/calendar/Calendar';
import AgendaEventShow from "./agenda-event-show/AgendaEventShow";

interface AgendaProps
{
    
}


interface AgendaState
{
    data: any
    dataEvents: any
    dataCurrentDate: any
}

export default class Agenda extends React.Component<AgendaProps, AgendaState>
{
    refDialogShow: any

    constructor(props: AgendaProps)
    {
        super(props)
        this.state = {
            data: null,
            dataEvents: [],
            dataCurrentDate: null,
        }

        this.refDialogShow = React.createRef()
    }

    componentDidMount(): void {
        this.search()
    }

    async search()
    {
        const formData = {
            is_asc: false,
            max: 100,
        }
    
        const url: string = `/agenda/search-month-counts`

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
            console.log('Agenda Events', result)

            const events = result.data // 🔥 IMPORTANT

            const calendarData = events.map((event: any) => ({
                date: event.date,
                data: {
                    total: event.total,
                }
            }))

            this.setState({
                data: result.data,
                dataEvents: calendarData,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    handleOnStore()
    {
        this.search()
    }

    handleOnUpdate()
    {
        this.search()
    }
    
    handleOnDestroy()
    {
        this.search()
    }

    handleOnShow(data: any)
    {   
        console.log('Calendar', data)
        this.setState({
            dataCurrentDate: data,
        }, () => this.refDialogShow.current.select())
            
    }

    render()
    {
        return (
            <>
                <Calendar 
                    // [
                    //     { date: '2026-02-21', data: { info: "Meeting" } },
                    //     { date: '2026-02-30', data: { info: "Deadline" } },
                    // ]
                    data={this.state.dataEvents}
                    onDate={ (data: any) => this.handleOnShow(data) } />
                <AgendaEventShow
                    ref={ this.refDialogShow }
                    data={ this.state.dataCurrentDate }
                    onStore={ () => this.handleOnStore() }
                    onUpdate={ (data) => this.handleOnUpdate() }
                    onDestroy={ () => this.handleOnDestroy() } />
            </>
        )
    }
}