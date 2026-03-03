import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';


interface DeleteProps
{
    data: any
    onClose: any
    onDestroy: () => void
}


interface DeleteState
{
    
}

export default class Delete extends React.Component<DeleteProps, DeleteState>
{

    constructor(props: DeleteProps)
    {
        super(props)
        this.state = {

        }
    }

    async delete()
    {
        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

    
        const url: string = `/agenda/${this.props.data.id}`

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'DELETE')

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData, //JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result)

            this.props.onDestroy()
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }
    
    handleOnSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.delete()
    }

    handleOnClose(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.props.onClose()
    }

    render()
    {
        if (!this.props.data)
            return (<></>)
        return (
            <div className="delete">
                <div className="dd-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Delete Agenda Event</h4>
                        <p>
                            You are about to permanently delete this event.
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="dd-main">
                    <div className="event">           
                        <div className="label">
                            <div className="icon">
                                <CalendarDaysIcon />
                            </div>
                            <h6 className="title">{ this.props.data.title }</h6>
                        </div>
                        <div className="note">{ this.props.data.note }</div>
                    </div>
                    <p>
                        Are you sure you want to delete all events scheduled for this time slot? 
                        This action cannot be undone.
                    </p>
                    <form onSubmit={ (event) => event.preventDefault() }>
                        <div className="form-row fr-options">
                            <button type="button"
                                onClick={ (event) => this.handleOnSubmit(event) }>Delete</button>
                            <button type="button"
                                onClick={ (event) => this.handleOnClose(event) }>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}