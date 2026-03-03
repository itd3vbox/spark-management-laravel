import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";


interface DialogDeleteProps
{
    onDelete: () => void
}


interface DialogDeleteState
{
    isSelected: boolean
    data: any
    formData: {
        [key: string]: any
    }
}

export default class DialogDelete extends React.Component<DialogDeleteProps, DialogDeleteState>
{

    constructor(props: DialogDeleteProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            data: null,
            formData: {},
        }
    }

    select(data: any = null)
    {
        const formData: any = {}
        if (data)
        {
            formData['edit_url'] = `/users/${ data.id }`
        }
        
        console.log(formData)

        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
            formData: formData,
            data: data,
        })
    }

    async delete() 
    {
        const url: string = this.state.formData['edit_url']

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

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
            this.setState({
                isSelected: false,
            }, () => this.props.onDelete())
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

    renderRoles()
    {
        const elements: any = []
        const roles = JSON.parse(this.state.data.roles)
        for(let index = 0; index < roles.length && index < 2; index++)
        {
            const role = roles[index]
            elements.push(
                <div className="role" key={ index }>{ role }</div>
            )
        }
        if (roles.length > 2)
            elements.push(
                <div className="role" key={ 2 }><PlusIcon/></div>
            )
        return elements
    }
    
    render()
    {
        const user = this.state.data

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
                        <h4>Delete User</h4>
                        <p>Permanently remove this user account from the system.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <div className="user">
                        <div className="block-top">
                            <div className="date-from">
                                { user.days_since_joined }
                            </div>
                        </div>
                        <div className="block-core">
                            <div className="avatar-id">
                                <div className="avatar">
                                    <img src={ user.avatar_info.path } alt="" />
                                </div>
                                <div className="id">
                                    <div className="label">ID:</div>
                                    <div className="value">#{ user.id }</div>
                                </div>
                            </div>
                            <div className="details">
                                <div className="username">#{ user.username }</div>
                                <div className="roles">
                                    { this.renderRoles() }
                                </div>
                            </div>
                            <div className="indicators">
                                <div className="indicator">
                                    <div className="label">Projects</div>
                                    <div className="value">{ user.total_projects }</div>
                                </div>
                                <div className="indicator">
                                    <div className="label">Tasks</div>
                                    <div className="value">{ user.total_tasks }</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>You are about to permanently delete this user.</p>
                    <form onSubmit={ (event) => event.stopPropagation() }>
                        <div className="form-row">
                            <button type="button" 
                                onClick={(e) => this.handleOnSubmit(e)}>Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}