import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    SparklesIcon,
    ArrowDownIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';


interface ProjectProps
{
    isSelected: boolean
    data: any
    onSelect: (data: any, isSelected: boolean) => void
}


interface ProjectState
{
    isMore: boolean
}

export default class Project extends React.Component<ProjectProps, ProjectState>
{

    constructor(props: ProjectProps)
    {
        super(props)
        this.state = {
            isMore: false,
        }
    }

    handleOnMore()
    {
        this.setState({
            isMore: !this.state.isMore,
        })
    }

    handleOnSelect()
    {
        this.props.onSelect(this.props.data, !this.props.isSelected)
    }

    render()
    {
        const project = this.props.data

        return (
            <div className={
                "project " 
                + (this.state.isMore ? ' more' : '')
                + (this.props.isSelected ? ' selected' : '')
            }>
                <div className="block-top">
                    <div className="icon">
                        <SparklesIcon />
                    </div>
                    <div className="id">#{ project.id }</div>
                    <div className="options">
                        <button type="button" className="button-icon btn-more"
                            onClick={ () => this.handleOnMore() }>
                            <ArrowDownIcon />
                        </button>
                        <button type="button" className="button-icon btn-select"
                            onClick={ () => this.handleOnSelect() }>
                            <CheckCircleIcon />
                        </button>
                    </div>
                </div>
                <div className="block-details">
                    <img src={ project.image_info.path } alt={ "Image - " + project.name } />
                    <h6>{ project.name }</h6>
                    <div className="description">
                        <p>{ project.description_short }</p>
                    </div>
                </div>
            </div>
        )
    }
}