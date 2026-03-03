import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    CalendarDaysIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import Event from "./Event";
import Edit from "./Edit";
import Delete from "./Delete";
import Notes from "./Notes/Notes";


interface EventsProps
{
    data: any   
}


interface EventsState
{
    data: any
    dataSelected: any
    isModeEdit: boolean
    isModeDelete: boolean
    isModeNotes: boolean
}

export default class Events extends React.Component<EventsProps, EventsState>
{

    constructor(props: EventsProps)
    {
        super(props)
        this.state = {
            data: null,
            dataSelected: null,
            isModeEdit: false,
            isModeDelete: false,
            isModeNotes: false,
        }
    }

    componentDidMount(): void {
        this.search()
    }

    componentDidUpdate(prevProps: Readonly<EventsProps>) 
    {
        if (
            this.props.data &&
            (
                !prevProps.data || // si pas de prevProps.data, on déclenche
                this.props.data.date !== prevProps.data.date ||
                this.props.data.time.hours !== (prevProps.data?.time?.hours)
            )
        ) {
            this.search();
        }
    }

    async search()
    {
        const url: string = `/agenda/search`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const rawHours = this.props.data.time.hours; // "00h00m"
        // Transformer "00h00m" => "00:00"
        const formattedHours = rawHours.replace('h', ':').replace('m', ''); 

        const formData = {
            is_asc: false,
            date: this.props.data.date,
            hours: formattedHours
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

    handleOnEdit(data: any)
    {
        this.setState({
            dataSelected: data,
            isModeEdit: true,
        })
    }

    handleEditOnClose()
    {
        this.setState({
            dataSelected: null,
            isModeEdit: false,
        })
    }

    handleEditOnUpdate()
    {

    }

    handleOnDelete(data: any)
    {
        this.setState({
            dataSelected: data,
            isModeDelete: true,
        })
    }

    handleDeleteOnClose()
    {
        this.setState({
            dataSelected: null,
            isModeDelete: false,
        })
    }

    handleDeleteOnDestroy()
    {
        this.setState({
            dataSelected: null,
            isModeDelete: false,
        })
    }

    handleOnNotes(data: any)
    {
        this.setState({
            dataSelected: data,
            isModeNotes: true,
        })
    }

    handleNotesOnClose()
    {
        this.setState({
            dataSelected: null,
            isModeNotes: false,
        })
    }

    renderEvents()
    {
        const data = this.state.data && this.state.data.data ? this.state.data.data : []
        const elements: any = []
        for (let index = 0; index < data.length; index++) 
        {
            const _event = data[index];
            elements.push(
                <Event key={ _event.id } data={ _event }
                    onEdit={ (data: any) => this.handleOnEdit(data) }
                    onDelete={ (data: any) => this.handleOnDelete(data) }
                    onNotes={ (data: any) => this.handleOnNotes(data) } />
            )
        }
        return (elements)
    }

    render()
    {
        if (!this.props.data)
            return (<></>)
        return (
            <div className="events">
                { this.state.isModeNotes == true && (<Notes data={ this.state.dataSelected }
                    onEventEdit={ (data: any) => this.handleOnEdit(data) }
                    onEventDelete={ (data: any) => this.handleOnDelete(data) }
                    onClose={ () => this.handleNotesOnClose() } />) }
                { this.state.isModeEdit == true && (<Edit 
                    data={  this.state.dataSelected } 
                    onClose={ () => this.handleEditOnClose() }
                    onUpdate={ () => this.handleEditOnUpdate() } />) }
                { this.state.isModeDelete == true && (<Delete 
                    data={  this.state.dataSelected } 
                    onClose={ () => this.handleDeleteOnClose() }
                    onDestroy={ () => this.handleDeleteOnDestroy() } />) }
                { this.state.isModeEdit == false && this.state.isModeDelete == false && this.state.isModeNotes == false &&  this.renderEvents() }
            </div>
        )
    }
}