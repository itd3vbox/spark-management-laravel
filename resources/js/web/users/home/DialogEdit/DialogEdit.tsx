import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    UserIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import ChoicesMultipleRadio from "@/components/form/ChoicesMultipleRadio";
import InputPasswordGenerator from "@/components/form/InputPasswordGenerator";


interface DialogEditProps
{
    onUpdate: () => void
}


interface DialogEditState
{
    isSelected: boolean
    data: any
    formData: {
        [key: string]: any
    }
}

export default class DialogEdit extends React.Component<DialogEditProps, DialogEditState>
{

    constructor(props: DialogEditProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            data: null,
            formData: {
                avatar: null,
                name: '',
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
                roles: '',
            },
        }
    }

    select(data: any = null)
    {
        let formData = this.state.formData
        if (data)
        {
            formData = {
                avatar: null,
                name: data.name,
                username: data.username,
                email: data.email,
                password: '',
                password_confirmation: '',
                roles: data.roles,
            }
            
        }
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
            data: data,
            formData: formData,
        })
    }

    async update() 
    {
        const url: string = `/users/${ this.state.data.id }`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const { formData } = this.state

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'PUT')
        if (formData.avatar)
            multipartFormData.append('avatar', formData.avatar)
        multipartFormData.append('name', formData.name)
        multipartFormData.append('username', formData.username)
        multipartFormData.append('email', formData.email)
        multipartFormData.append('password', formData.password)
        multipartFormData.append('password_confirmation', formData.password_confirmation)
        multipartFormData.append('roles', formData.roles)
        
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
            
            this.props.onUpdate()
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }

    handleImageOnUpload(data: { file: File | null, url: string | null })
    {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                avatar: data.file 
            }
        }))
    }

    handleInputOnChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) 
    {
        const { name, value } = event.target
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }))
    }

    handleOnRoles(data: any)
    {
        console.log(data)
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                roles: data, 
            }
        }))
    }

    handlePasswordOnChange(data: string)
    {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                password: data, 
            }
        }))
    }

    handlePasswordConfirmationOnChange(data: string)
    {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                password_confirmation: data, 
            }
        }))
    }

    handleOnSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.update()
    }
    
    // --- RENDER

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

    renderUser()
    {
        const user = this.state.data

        return (
            <div className="user">
                <div className="block-top">
                    <div className="date-from">{ user.days_since_joined }</div>
                </div>
                <div className="block-core">
                    <div className="avatar-id">
                        <div className="avatar">
                            <img src={ user.avatar_info.path } alt="Avatar" />
                        </div>
                        <div className="id">
                            <div className="label">ID:</div>
                            <div className="value">{ user.id }</div>
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
        )
    }

    render()
    {
        if (!this.state.data)
            return (<></>)
        return (
            <div className={ "dialog-edit" + (this.state.isSelected ? ' selected' : '') }>
                <div className="de-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="de-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Edit User</h4>
                        <p>Review and update this user's profile and access rights.</p>
                    </div>
                </div>
                <div className="de-main">
                    { this.renderUser() }
                    <p>You are about to update this user's information.</p>
                    <form onSubmit={ (event) => event.preventDefault() }>
                        <div className="form-row">
                            <label>Avatar</label>
                            <ImageUploader 
                                path={ this.state.data.avatar_info.path }
                                onUpload={(data: any) => this.handleImageOnUpload(data)}/>
                        </div>
                        <div className="form-row">
                            <label htmlFor="de-name">Name</label>
                            <input type="text" name="name" 
                                id="de-name"
                                value={ this.state.formData ? this.state.formData.name : '' }
                                placeholder="Ex.: Jane Doe"
                                onChange={(e) => this.handleInputOnChange(e)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="de-username">Username</label>
                            <input type="text" name="username" 
                                id="de-username"
                                value={ this.state.formData ? this.state.formData.username : '' }
                                placeholder="Ex.: #janedoe"
                                onChange={(e) => this.handleInputOnChange(e)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="de-name">Email</label>
                            <input type="email" name="email" 
                                id="de-email"
                                value={ this.state.formData ? this.state.formData.email : '' }
                                placeholder="Ex.: janedoe@pm.demo"
                                onChange={(e) => this.handleInputOnChange(e)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="de-password">Password</label>
                            <InputPasswordGenerator
                                value={ this.state.formData.password ? this.state.formData.password : '' }
                                onChange={(data: any) => this.handlePasswordOnChange(data)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="de-password-confirmation">Password Confirmation</label>
                            <InputPasswordGenerator
                                value={ this.state.formData.password_confirmation ? this.state.formData.password_confirmation : '' }
                                onChange={(data: any) => this.handlePasswordConfirmationOnChange(data)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="de-roles">Roles</label>
                            <ChoicesMultipleRadio 
                                choices={ ['ADMIN', 'GUEST', 'DEVELOPER', 'GRAPHIST'] }
                                selectedChoices={ this.state.formData.roles }
                                onUpdate={ (data: any) => this.handleOnRoles(data) }/>
                        </div>
                        <div className="form-row fr-submit">
                            <button type="button"
                                className="button-text"
                                onClick={(e) => this.handleOnSubmit(e)}>Update</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}