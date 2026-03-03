import React from "react"
import {
    ExclamationTriangleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';


interface NotificationsProps
{
    
}


interface NotificationsState
{
    
}

export default class Notifications extends React.Component<any, NotificationsState>
{

    constructor(props: any)
    {
        super(props)
        this.state = {

        }
    }

    renderNotifications()
    {
        const notifications: any = []

        for (let index = 0; index < 5; index++) 
        {
            notifications.push(
                <div className={ "notification" + (index === 0 ? ' read' : '') } key={ index }>
                    <div className="icon">
                        <ExclamationTriangleIcon />
                    </div>
                    <div className="title-message">
                        <h6 className="title">Debug Project 1</h6>
                        <p className="message">Somme compilation error occured.</p>
                    </div>                    
                    <button type="button">
                        <XMarkIcon />                       
                    </button>
                </div>
            )
        }
        return notifications
    }

    render()
    {
        return (
            <div className="h-notifications">
            {/* Reusable Component ... copy this model */}
                <div className="label">
                    <h6>Notifications <span className="total">(5)</span></h6>
                </div>
                <div className="list">
                    { this.renderNotifications() }
                </div>
            </div>
        )
    }
}