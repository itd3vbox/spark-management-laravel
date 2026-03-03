import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';


interface PaginationProps
{
    onPrev: () => void
    onNext: () => void
}


interface PaginationState
{
    
}

export default class Pagination extends React.Component<any, PaginationState>
{

    constructor(props: any)
    {
        super(props)
        this.state = {

        }
    }

    handlOnPrev()
    {
        this.props.onPrev()
    }

    handleOnNext()
    {
        this.props.onNext()
    }

    render()
    {
        return (
            <div className="pagination">
                <button type="button" className="btn-prev" 
                    onClick={ () => this.handlOnPrev() }>
                    <ArrowLeftIcon />
                </button>
                <button type="button" className="btn-next"
                    onClick={ () => this.handleOnNext() }>
                    <ArrowRightIcon />
                </button>
            </div>
        )
    }
}