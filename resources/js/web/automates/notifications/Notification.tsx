import React from "react"
import {
    XMarkIcon,
    ExclamationTriangleIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';


interface NotificationProps
{
    
}


interface NotificationState
{
    
}

export default class Notification extends React.Component<any, NotificationState>
{

    constructor(props: any)
    {
        super(props)
        this.state = {

        }
    }

    render()
    {
        return (
            <div className={ "notification" + (this.props.order === 1 ? ' read' : '') }>
               <div className="icon">
                    <ExclamationTriangleIcon />
                </div>
                <div className="title-message">
                    <h6 className="title">Debug Project 1</h6>
                    <p className="message">Somme compilation error occured.</p>
                </div>          
                <div className="options">
                    <button type="button">
                        <XMarkIcon />                       
                    </button>
                </div>
            </div>
        )
    }
}