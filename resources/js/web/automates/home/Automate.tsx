import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    StarIcon,
    PlayIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';


interface AutomateProps
{
    data: any
    onShow: () => void
    onEdit: () => void
    onDelete: () => void
    onExecute: () => void
}


interface AutomateState
{
    toolsIsSelected: boolean
    toolsStyle: any
}

export default class Automate extends React.Component<AutomateProps, AutomateState>
{
    refBlockTools: any

    constructor(props: AutomateProps)
    {
        super(props)
        this.state = {
            toolsIsSelected: false,
            toolsStyle: {},
        }

        this.refBlockTools = React.createRef()
    }

    async execute()
    {    
        const url: string = `/automates/${ this.props.data.id }/execute`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const formData = new FormData()
        //formData.append('_method', 'PATCH')
        //formData.append('status', String(this.props.data.status === 1 ? 2 : 1))

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
            this.props.onExecute()
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
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

    handleOnExecute()
    {
        this.execute()
    }

    handleShowOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onShow()
    }

    
    handleEditOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onEdit()
    }

    handleDeleteOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onDelete()
    }

    renderTools()
    {
        return (
            <div className={ 'block-tools' + (this.state.toolsIsSelected ? ' selected' : '') } 
                ref={ this.refBlockTools }
                onClick={ () => this.handleBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.toolsStyle }>
                    <button onClick={ (event) => this.handleShowOnClick(event) }>Show</button>
                    <button onClick={ (event) => this.handleEditOnClick(event) }>Edit</button>
                    <button onClick={ (event) => this.handleDeleteOnClick(event) }>Delete</button>
                </div>
            </div>
        )
    }

    render()
    {
        const automate = this.props.data
        
        return (
            <div className="automate">
                <div className="block-top">
                    <div className="icon">
                        <StarIcon />
                    </div>
                    <div className="options">
                        <button type="button"
                            onClick={ () => this.handleOnExecute() }>
                            <PlayIcon />
                        </button>
                        <button type="button"
                            onClick={ (event) => this.handleBlockToolsOnSelect(event) }>
                            <EllipsisVerticalIcon />
                        </button>
                    </div>
                </div>
                <div className="block-main">
                    <div className="name">{ automate.name }</div>
                    <div className="project">
                        <div className="label">Pr.:</div> 
                        <div className="value">{ automate.project.name }</div>
                    </div>
                    <div className="date-latest">
                        <div className="label">Done:</div>
                        <div className="date">{ automate.exec_info.date }</div>
                    </div>
                </div>
                <div className="block-bottom">
                    <div className="type">{ automate.type }</div>
                </div>
                { this.renderTools() }
            </div>
        )
    }
}