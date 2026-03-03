import React from "react"
import {
    XMarkIcon,
    CheckCircleIcon,
    ArrowDownIcon,
    CheckIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';


interface TaskProps
{
    data: any
    order: number
    onEdit: (data: any) => void
    onUpdate: () => void
    onDelete: (data: any) => void
}


interface TaskState
{
    isSelected: boolean
    toolsIsSelected: boolean
    toolsStyle: any
}

export default class Task extends React.Component<TaskProps, TaskState>
{
    refBlockTools: any

    constructor(props: TaskProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            toolsIsSelected: false,
            toolsStyle: {},
        }
        
        this.refBlockTools = React.createRef()
    }

    async updateStatus(status: number = 0)
    {
        const url: string = `/tasks/${ this.props.data.id }/status`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'PATCH')
        multipartFormData.append('status', String(status))

        // for (const key in formData) 
        // {
        //     if (formData.hasOwnProperty(key))
        //         multipartFormData.append(key, formData[key])
        // }
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData, //JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result)
            
            this.props.onUpdate()         
        } 
        catch (error) 
        {
            console.error('Error', error)
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

    handleOnSelect()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
    }

    handleOnEdit()
    {
        this.props.onEdit(this.props.data)
    }

    handleOnDelete()
    {
        this.props.onDelete(this.props.data)
    }

    handleStatusOnUpdate(status: number = 0)
    {
        this.updateStatus(status)
    }

    renderTools()
    {
        return (
            <div className={ 'block-tools' + (this.state.toolsIsSelected ? ' selected' : '') } 
                ref={ this.refBlockTools }
                onClick={ () => this.handleBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.toolsStyle }>
                    <button onClick={ (event) => this.handleOnEdit() }>Edit</button>
                    <button onClick={ (event) => this.handleOnDelete() }>Delete</button>
                </div>
            </div>
        )
    }

    renderUser()
    {   
        if (!this.props.data.users.length)
            return (<></>)
        const user = this.props.data.users[0]
        
        return (
            <div className="block-user">
                <div className="avatar">
                    <img src={ user.avatar_info.path } alt="Avatar" />
                </div>
                <div className="username">#{ user.username }</div>
            </div>
        )
    }

    render()
    {
        const description = this.props.data.description 
            ? JSON.parse(this.props.data.description).content
            : '...'

        return (
            <div className={"task" + (this.state.isSelected ? ' selected' : '')}>
                <div className="t-top">
                    <div className="number">{ this.props.order }</div>
                    <div className="title">{ this.props.data.title }</div>
                    <div className="options">
                        <button type="button" className={"btn-status" + (this.props.data.status === 1 ? ' done' : '') }
                            onClick={ () => this.handleStatusOnUpdate(this.props.data.status === 1 ? 2 : 1) }>
                            { this.props.data.status === 1 && (<CheckCircleIcon />) }
                            { this.props.data.status !== 1 && (<CheckIcon />) }                 
                        </button>
                        <button type="button" className="btn-more"
                            onClick={ () => this.handleOnSelect() }>
                            <ArrowDownIcon />                       
                        </button>
                        <button type="button" className="btn-options"
                            onClick={ (event) => this.handleBlockToolsOnSelect(event) }>
                            <EllipsisVerticalIcon />
                        </button>
                    </div>
                </div>
                <div className="t-main">
                    <div className="block-project">
                        <div className="block-left">
                            <img src={ this.props.data.project.image_info.path } className="card-img-top" alt="..."/>
                        </div>
                        <div className="block-right">
                            <h4>{ this.props.data.project.name }</h4>
                            <div className="id">#{ this.props.data.project.id }</div>
                            <p className="description-short">{ this.props.data.project.description_short }</p>
                        </div>
                    </div>
                    { this.renderUser() }
                    <div className="block-task">
                        <div className="id">#{ this.props.data.id }</div>
                        <div className="status">
                            <div className="info"></div>
                            <div className="label">Status</div>
                            <div className="shape-value-options">
                                <div className="shape-value">
                                    <div className="shape"></div>
                                    <div className="value">{ this.props.data.status_info.value_text }</div>
                                </div>
                                <div className="options">
                                    <button type="button"
                                        onClick={ () => this.handleStatusOnUpdate(0) }>RESET</button>
                                    <button type="button"
                                        onClick={ () => this.handleStatusOnUpdate(2) }>START</button>
                                    <button type="button"
                                        onClick={ () => this.handleStatusOnUpdate(1) }>DONE</button>
                                </div>
                            </div>
                        </div>
                        <h6>Description - Short</h6>
                        <p className="description-short">{ this.props.data.description_short }</p>
                        <h6>Description</h6>
                        <p className="description-short">{ description }</p>                      
                    </div>
                </div>
                { this.renderTools() }
            </div>
        )
    }
}