import React from "react"
import {
    XMarkIcon,
    ArrowDownIcon,
    CheckCircleIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';


interface TaskProps
{
    data: any
    order: number
}


interface TaskState
{
    isSelected: boolean
}

export default class Task extends React.Component<TaskProps, TaskState>
{

    constructor(props: any)
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

    render()
    {
        return (
            <div className={"task" + (this.state.isSelected ? ' selected' : '')}>
                <div className="t-top">
                    <div className="number">{ this.props.order }</div>
                    <div className="title">{ this.props.data.title }</div>
                    <div className="options">
                        <button type="button" className="btn-status">
                            <CheckCircleIcon />                       
                        </button>
                        <button type="button" onClick={ () => this.handleOnSelect() }>
                            <ArrowDownIcon />                       
                        </button>
                    </div>
                </div>
                <div className="t-main">
                    <div className="id">#{ this.props.data.id }</div>
                    <div className="status">
                        <div className="label">Status</div>
                        <div className="shape-value">
                            <div className="shape"></div>
                            <div className="value">{ this.props.data.status_info.value_text }</div>
                        </div>
                    </div>
                    <h6>Description - Short</h6>
                    <p className="description-short">{ this.props.data.description_short }</p>
                    <h6>Description</h6>
                    <p className="description">{ this.props.data.description }</p>
                </div>
            </div>
        )
    }
}