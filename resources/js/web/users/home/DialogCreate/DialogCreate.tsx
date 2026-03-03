import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import ChoicesMultipleRadio from "@/components/form/ChoicesMultipleRadio";
import InputPasswordGenerator from "@/components/form/InputPasswordGenerator";


interface DialogCreateProps
{
    onCreate: () => void
}


interface DialogCreateState
{
    isSelected: boolean
    formData: {
        [key: string]: any
    }
}

export default class DialogCreate extends React.Component<DialogCreateProps, DialogCreateState>
{

    constructor(props: DialogCreateProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            formData: {
                avatar: null,
                name: '',
                username: '',
                email: '',
                password: '',
                roles: '',
            },
        }
    }

    select()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
    }

    async store()
    {
        const url: string = `/users`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const { formData } = this.state

        const multipartFormData = new FormData()
        // multipartFormData.append('_method', 'PUT')
        if (formData.avatar)
            multipartFormData.append('avatar', formData.avatar)
        multipartFormData.append('name', formData.name)
        multipartFormData.append('username', formData.username)
        multipartFormData.append('email', formData.email)
        multipartFormData.append('password', formData.password)
        multipartFormData.append('roles', formData.roles)
        
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
                formData: {
                    avatar: null,
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    roles: null,
                }
            }, () => this.props.onCreate())
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

    handleOnSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.store()
    }

    render()
    {
        return (
            <div className={ "dialog-create" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Create User</h4>
                        <p>It is time to create a new user.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <form onSubmit={ (event) => event.preventDefault() }>
                        <div className="form-row">
                            <label>Avatar</label>
                            <ImageUploader 
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
                            <label htmlFor="de-name">Password</label>
                            <InputPasswordGenerator
                                value={ this.state.formData.password ? this.state.formData.password : '' }
                                onChange={(data: any) => this.handlePasswordOnChange(data)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="de-roles">Roles</label>
                            <ChoicesMultipleRadio 
                                choices={ ['ADMIN', 'GUEST', 'DEVELOPER', 'GRAPHIST'] }
                                selectedChoices={ this.state.formData.roles }
                                onUpdate={ (data: any) => this.handleOnRoles(data) }/>
                        </div>
                        <div className="form-row">
                            <button type="button"
                                onClick={ (event) => this.handleOnSubmit(event) }>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}