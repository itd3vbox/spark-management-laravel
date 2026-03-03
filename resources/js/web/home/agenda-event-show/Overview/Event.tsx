import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';


interface EventProps
{
    data: any
    onEdit: any
    onDelete: any
    onNotes: any
}


interface EventState
{
    toolsIsSelected: boolean
    toolsStyle: any
}

export default class Event extends React.Component<EventProps, EventState>
{
    refBlockTools: any

    constructor(props: EventProps)
    {
        super(props)
        this.state = {
            toolsIsSelected: false,
            toolsStyle: {},
        }
        this.refBlockTools = React.createRef()
    }

    handleBlockToolsOnSelect(event: any)
    {
        
        const element = event.currentTarget
        const objetRect = element.getBoundingClientRect() //button
        
        const objectRectClient = this.refBlockTools.current.getBoundingClientRect()
        
        const style = {
            display: 'block',
            top: objetRect.top + 'px',
            right: (window.innerWidth - objetRect.left) + 'px',
        }
        this.setState({
            ...this.state,
            toolsStyle: style,
            toolsIsSelected: true,
        })

    }

    handleBlockToolsOnSelectOnly()
    {
        this.setState({
            ...this.state,
            toolsIsSelected: false,
        })
    }

    handleOnEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onEdit(this.props.data)
    }

    handleOnDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onDelete(this.props.data)
    }

    handleOnNotes(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onNotes(this.props.data)
    }

    renderTools()
    {
        return (
            <div className={ 'block-tools' + (this.state.toolsIsSelected ? ' selected' : '') } 
                ref={ this.refBlockTools }
                onClick={ () => this.handleBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.toolsStyle }>
                    <button onClick={ (event) => this.handleOnEdit(event) }>Edit</button>
                    <button onClick={ (event) => this.handleOnDelete(event) }>Delete</button>
                    <button onClick={ (event) => this.handleOnNotes(event) }>Notes</button>
                </div>
            </div>
        )
    }

    render()
    {
        const _event = this.props.data
        return (
            <div className="event">
                    
                    <div className="label">
                        <div className="icon">
                            <CalendarDaysIcon />
                        </div>
                        <h6 className="title">{ _event.title }</h6>
                        <div className="options">
                            <button type="button"
                                onClick={ (event) => this.handleBlockToolsOnSelect(event) }>
                                <EllipsisVerticalIcon />
                            </button>
                        </div>
                    </div>
                    <div className="note">{ _event.note }</div>
                    { this.renderTools() }
                </div>
        )
    }
}