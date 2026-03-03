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
}


interface TaskState
{
    isSelected: boolean
}

export default class Task extends React.Component<TaskProps, TaskState>
{
    constructor(props: TaskProps)
    {
        super(props)
        this.state = {
            isSelected: false,
        }
    }

    handleOnSelect()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
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
                    <div className="title">{ this.props.data.title }</div>
                     <div className="options">
                        <button type="button" className="btn-more"
                            onClick={ () => this.handleOnSelect() }>
                            <ArrowDownIcon />                       
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
                            </div>
                        </div>
                        <h6>Description - Short</h6>
                        <p className="description-short">{ this.props.data.description_short }</p>
                        <h6>Description</h6>
                        <p className="description-short">{ description }</p>                      
                    </div>
                </div>
            </div>
        )
    }
}