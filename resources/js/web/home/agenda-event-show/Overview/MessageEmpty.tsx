import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';


interface MessageEmptyProps
{
    
}


interface MessageEmptyState
{
    
}

export default class MessageEmpty extends React.Component<MessageEmptyProps, MessageEmptyState>
{

    constructor(props: MessageEmptyProps)
    {
        super(props)
        this.state = {

        }
    }

    render()
    {
        return (
            <div className="message-empty">
                <img src="/images/pattern.png" alt="" />
                <div className="text">
                    <h4>No events scheduled</h4>
                    <p>
                        There are no events planned for this time slot.
                        You can schedule a new one.
                    </p>
                </div>
            </div>
        )
    }
}