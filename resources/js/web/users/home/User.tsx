import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';


interface UserProps
{
    isAdmin: boolean
    canDelete: boolean
    data: any
    onShow: (data: any) => void
    onEdit: (data: any) => void
    onDelete: (data: any) => void
}


interface UserState
{
    toolsIsSelected: boolean
    toolsStyle: any
}

export default class User extends React.Component<UserProps, UserState>
{
    refBlockTools: any

    constructor(props: UserProps)
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
        //this.props.onShow(this.props.data)
    }

    
    handleEditOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onEdit(this.props.data)
    }

    handleDeleteOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.props.onDelete(this.props.data)
    }

    // --- RENDER ---

    renderTools()
    {
        return (
            <div className={ 'block-tools' + (this.state.toolsIsSelected ? ' selected' : '') } 
                ref={ this.refBlockTools }
                onClick={ () => this.handleBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.toolsStyle }>
                    { this.props.isAdmin === true && (
                            <button onClick={ (event) => this.handleEditOnClick(event) }>Edit</button>
                        ) }
                    { this.props.isAdmin === true &&  this.props.canDelete === true && (
                            <button onClick={ (event) => this.handleDeleteOnClick(event) }>Delete</button>
                        ) }
                    <button onClick={ (event) => this.handleShowOnClick(event) }>Show</button>
                </div>
            </div>
        )
    }

    renderRoles()
    {
        const elements: any = []
        const roles = JSON.parse(this.props.data.roles)
        for(let index = 0; index < roles.length && index < 2; index++)
        {
            const role = roles[index]
            elements.push(
                <div className="role" key={ index }>{ role }</div>
            )
        }
        if (roles.length > 2)
            elements.push(
                <div className="role" key={ 2 }><PlusIcon/></div>
            )
        return elements
    }

    render()
    {
        const user = this.props.data

        return (
            <div className="user">
                <div className="block-top">
                    <div className="date-from">{ user.days_since_joined }</div>
                    <div className="options">
                        <button type="button" className="button-icon"
                            onClick={ (event) => this.handleBlockToolsOnSelect(event) }>
                            <EllipsisVerticalIcon />
                        </button>
                    </div>
                </div>
                <div className="block-core">
                    <div className="avatar-id">
                        <div className="avatar">
                            <img src={ user.avatar_info.path } alt="Avatar" />
                        </div>
                        <div className="id">
                            <div className="label">ID:</div>
                            <div className="value">{ user.id }</div>
                        </div>
                    </div>
                    <div className="details">
                        <div className="username">#{ user.username }</div>
                        <div className="roles">
                            { this.renderRoles() }
                        </div>
                    </div>
                    <div className="indicators">
                        <div className="indicator">
                            <div className="label">Projects</div>
                            <div className="value">{ user.total_projects }</div>
                        </div>
                        <div className="indicator">
                            <div className="label">Tasks</div>
                            <div className="value">{ user.total_tasks }</div>
                        </div>
                    </div>
                </div>
                { this.renderTools() }
            </div>
        )
    }
}