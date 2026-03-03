import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';


interface AutomateProps
{
    data: any
}


interface AutomateState
{
    
}

export default class Automate extends React.Component<AutomateProps, AutomateState>
{

    constructor(props: AutomateProps)
    {
        super(props)
        this.state = {

        }
    }

    render()
    {
        return (
            <div className="automate">
                <div className="name">{ this.props.data.name }</div>
                <div className="description-short">{ this.props.data.description_short }</div>
                <div className="exec-date">
                    <div className="label">Exec Date:</div>
                    <div className="value">{ this.props.data.exec_info.date }</div>
                </div>
            </div>
        )
    }
}