import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';


interface ProjectProps
{
    onShow: any
    onEdit: any
    onDelete: any
    data: any
}


interface ProjectState
{
    toolsIsSelected: boolean
    toolsStyle: any
}

export default class Project extends React.Component<ProjectProps, ProjectState>
{

    refBlockTools: any

    constructor(props: ProjectProps)
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

    handleShowOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onShow(this.props.data)
    }

    handleEditOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onEdit(this.props.data)
    }

    handleDeleteOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onDelete(this.props.data)
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
        return (
            <div className="project">
                <div className="status-options">
                    <div className="status">
                        <div className="indicator"></div>
                        <div className="value">On Progess</div>
                    </div>
                    <button className="btn-more" type="button"
                        onClick={ (event) => this.handleBlockToolsOnSelect(event) }>
                        <EllipsisVerticalIcon />
                    </button>
                </div>
                <img src={ this.props.data.image_info.path } className="card-img-top" alt={ this.props.data.name }/>
                <div className="content">
                    <h6>{ this.props.data.name }</h6>
                    <div className="id">#{ this.props.data.id }</div>
                    <p className="description-short">{ this.props.data.description_short }</p>
                    <div className="date-updated">
                        <CalendarIcon />
                        <div className="value">2024-12-31</div>
                    </div>
                    <div className="progress">
                        <div className="progress-bar" style={{ width: '42%' }}></div>
                    </div>                  
                </div>
                { this.renderTools() }
            </div>
        )
    }
}