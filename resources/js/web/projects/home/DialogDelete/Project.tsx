import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';


interface ProjectProps
{
    data: any
}


interface ProjectState
{

}

export default class Project extends React.Component<ProjectProps, ProjectState>
{
    constructor(props: ProjectProps)
    {
        super(props)
        this.state = {

        }
    }

    render()
    {
        if (!this.props.data)
            return (<></>)
        return (
            <div className="project">
                <div className="status-options">
                    <div className="status">
                        <div className="indicator"></div>
                        <div className="value">On Progess</div>
                    </div>
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
            </div>
        )
    }
}