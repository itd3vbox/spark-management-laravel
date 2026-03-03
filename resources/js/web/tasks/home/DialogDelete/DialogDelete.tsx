import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import Task from "./Task";


interface DialogDeleteProps
{
    onDelete: () => void
}


interface DialogDeleteState
{
    isSelected: boolean
    data: any
}

export default class DialogDelete extends React.Component<DialogDeleteProps, DialogDeleteState>
{

    constructor(props: DialogDeleteProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            data: null,
        }
    }

    select(data: any = null)
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
            data: data,
        })
    }

    async destroy()
    {
        if (!this.state.data)
            return 

        const url: string = `/tasks/${ this.state.data.id }`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'DELETE')

        // for (const key in formData) 
        // {
        //     if (formData.hasOwnProperty(key))
        //         multipartFormData.append(key, formData[key])
        // }
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData, //JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result)
            
            this.setState({
                isSelected: false,
                data: null,
            }, () => this.props.onDelete())            
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }

    handleOnDelete()
    {
        this.destroy()
    }

    render()
    {
        if (!this.state.data)
            return (<></>)
        return (
            <div className={ "dialog-delete" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Delete Task</h4>
                        <p>Be careful, you are about to delete this task.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <Task
                        data={ this.state.data }
                    />
                    <div className="confirmation">
                        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
                        <button type="button"
                            onClick={ () => this.handleOnDelete() }>Delete</button>
                    </div>
                </div>

            </div>
        )
    }
}