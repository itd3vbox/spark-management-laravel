import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Pagination from "@/components/pagination/Pagination";


interface LogsProps
{
    
}


interface LogsState
{
    
}

export default class Logs extends React.Component<LogsProps, LogsState>
{

    constructor(props: LogsProps)
    {
        super(props)
        this.state = {

        }
    }

    renderLogs()
    {
        return (
            <div className="list">
                <div className="automates"></div>
                <Pagination />
            </div>
        )
    }

    render()
    {
        return (
            <div className="c-automates">
                { this.renderLogs() }
            </div>
        )
    }
}