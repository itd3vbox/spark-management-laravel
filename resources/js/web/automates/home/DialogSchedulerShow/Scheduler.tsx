import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Automate from "./Automate";


interface SchedulerProps
{
    data: any
}


interface SchedulerState
{
    
}

export default class Scheduler extends React.Component<SchedulerProps, SchedulerState>
{

    constructor(props: SchedulerProps)
    {
        super(props)
        this.state = {

        }
    }

    renderAutomates()
    {
        const elements = []
        const dataAutomates = this.props.data.automates
        
        for (let index = 0; index < dataAutomates.length; index++)
        {
            const data = dataAutomates[index]

            elements.push(<Automate 
                key={ data.id }
                data={ data }    
            />)
        }

        return elements
    }

    render()
    {
        return (
            <div className="scheduler">
                <div className="block-top">
                    <h6>Scheduler</h6>
                    <div className="exec-date">
                        <div className="label">Execution Date:</div>
                        <div className="value">2024-12-10 10:00</div>
                    </div>
                    <div className="project">
                        <div className="label">Project</div>
                        <div className="name">{ this.props.data.project.name }</div>
                    </div>
                </div>
                <div className="block-core">
                    { this.renderAutomates() }
                </div>
            </div>
        )
    }
}