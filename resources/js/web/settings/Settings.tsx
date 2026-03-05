import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import InputPassword from "@/components/form/InputPassword";


interface SettingsProps
{
    
}


interface SettingsState
{
    user: any
    formData: {
        name?: string;
        username?: string;
        email?: string;
        password?: string;
        password_confirmation?: string;
        avatar?: File | null;
        roles?: string | null;
    };
    errors?: { [key: string]: string };
}

export default class Settings extends React.Component<any, SettingsState>
{
   constructor(props: any)
    {
        super(props)
        this.state = {
            user: null,
            formData: {
                name: '',
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
                avatar: null,
                roles: null,
            },
            errors: {},
        }
    }

    componentDidMount(): void {
        this.searchAuth()
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<SettingsState>, snapshot?: any): void {
        if (this.state.user !== prevState.user)
        {
            this.setState({
                formData: {
                    name: this.state.user.name,
                    username: this.state.user.username,
                    email: this.state.user.email,
                    password: '',
                    password_confirmation: '',
                    avatar: null,
                    roles: null,
                }
            })
        }
    }

    async searchAuth()
    {
        const url: string = `/users/search-auth`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                //body: JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result)
            this.setState({
                ...this.state,
                user: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    async update() 
    {
        const { formData } = this.state;

        // Vérifier la confirmation du mot de passe
        if (formData.password && formData.password !== formData.password_confirmation) {
            this.setState({ errors: { password_confirmation: "Passwords do not match" } });
            return;
        }

        const url = `/settings`;
        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = tokenMetaTag?.getAttribute('content') || '';

        const multipartFormData = new FormData();
        multipartFormData.append('_method', 'PUT');
        if (formData.avatar) multipartFormData.append('avatar', formData.avatar);
        multipartFormData.append('name', formData.name || '');
        multipartFormData.append('username', formData.username || '');
        multipartFormData.append('email', formData.email || '');
        if (formData.password) multipartFormData.append('password', formData.password);
        if (formData.password_confirmation) multipartFormData.append('password_confirmation', formData.password_confirmation);
        multipartFormData.append('roles', formData.roles || '');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData
            });

            const result = await response.json();

            if (response.status !== 200) {
                this.setState({ errors: result.errors || {} });
            } else {
                console.log("Updated successfully", result);
                this.setState({ errors: {} });
            }
        } catch (error) {
            console.error("Error", error);
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

    handlePasswordOnUpdate(value: string) 
    {
        this.setState({
            formData: {
                ...this.state.formData,
                password: value
            }
        });
    }

    handlePasswordConfirmationOnUpdate(value: string) 
    {
        this.setState({
            formData: {
                ...this.state.formData,
                password_confirmation: value
            }
        });
    }

    handleOnSubmit()
    {
        this.update()
    }

    render()
    {
        if (!this.state.user)
            return (<></>)
        return (
            <div id="settings">
                
                <form className="s-form" onSubmit={ (e) => e.preventDefault() }>

                    <div className="block-avatar">
                        <label htmlFor="s-avatar">Avatar</label>
                        <ImageUploader
                            path={ this.state.user.avatar_info.path }
                            onUpload={(data: any) => this.handleImageOnUpload(data)} />
                    </div>

                    <div className="block-name">
                        <label htmlFor="s-name">Name</label>
                        <input type="text" id="s-name"
                            name="name"
                            value={ this.state.formData.name }
                            placeholder="Ex.:John Doe"
                            onChange={(e) => this.handleInputOnChange(e)} />
                    </div>

                    <div className="block-username">
                        <label htmlFor="s-username">Username</label>
                        <input type="text" id="s-username"
                            name="username"
                            value={ this.state.formData.username }
                            placeholder="Ex.:johndoe"
                            onChange={(e) => this.handleInputOnChange(e)} />
                    </div>
                        
                    <div className="block-email">
                        <label htmlFor="s-email">Email address</label>
                        <input type="email" id="s-email" 
                            name="email"
                            value={ this.state.formData.email }
                            placeholder="Ex.: contact@projectmanager.org"
                            onChange={(e) => this.handleInputOnChange(e)} />
                    </div>

                    <div className="block-password">
                        <label htmlFor="s-password">Password</label>
                        <InputPassword 
                            onChange={ (data: any) => this.handlePasswordOnUpdate(data) } />
                        <label htmlFor="s-password-confirmation">Password - Confirmation</label>
                        <InputPassword 
                            onChange={ (data: any) => this.handlePasswordConfirmationOnUpdate(data) } />
                        {this.state.errors?.password_confirmation && (
                            <p className="error">{this.state.errors.password_confirmation}</p>
                        )}
                    </div>

                    <div className="block-submit">
                        <button type="button" className="button-text"
                            onClick={ () => this.handleOnSubmit() }>Update</button>
                    </div>
                </form>

            </div>
        )
    }
}