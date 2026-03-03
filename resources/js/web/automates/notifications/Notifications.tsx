import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Notification from "./Notification";
import Pagination from "@/components/pagination/Pagination";

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
        let elements: any = []
        for (let index = 0; index < 10; index++) 
        {
            elements.push(
                <Notification key={ index } order={ index + 1 } />
            )
        }

        return elements
    }

    render()
    {
        return (
            <div id="notifications">
                <div className="p-list">
                    { this.renderNotifications() }
                </div>
                <Pagination />
            </div>
        )
    }
}