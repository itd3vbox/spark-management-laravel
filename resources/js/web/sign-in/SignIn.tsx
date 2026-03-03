import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    AtSymbolIcon,
    KeyIcon,
} from '@heroicons/react/24/outline';

import InputPassword from '@/components/form/InputPassword'

import './sass/main.sass'

interface SignInProps
{

}

interface SignInState
{
    errors: string[]
    data: any
    error?: string
}

export default class SignIn extends React.Component<SignInProps, SignInState>
{

    constructor(props: SignInProps)
    {
        super(props)
        this.state = {
            errors: [],
            data: {
                email: '',
                password: '',
            },
            error: '',
        }
    }

    async signIn()
    {
        const url = `/authenticate`
        
        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }
        
        try {

            const formData = new FormData()
            //formData.append('_method', 'PUT')
            formData.append('email', this.state.data.email) 
            formData.append('password', this.state.data.password) 
    
            // const email = this.state.data.email
            // const password = this.state.data.password

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body:  formData,
            })
        
            if (!response.ok) {
                const errorData = await response.json()
                this.setState({
                    error: errorData.error || 'An unknown error occurred.'
                });
                throw new Error(errorData.message || 'Network response was not ok')
            }
            
            const data = await response.json()
            console.log('Sign in successful:', data)
        
            if (data.redirect)
                window.location.href = data.redirect
        } 
        catch (error: any) {
            console.error('Sign in error:', error)
        }
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    {
        let data = this.state.data
        data[event.target.name] = event.target.value 
        this.setState({
            ...this.state,
            data: data,
        })
    }

    handlePasswordOnChange(password: string)
    {
        this.setState({
            data: {
                ...this.state.data,
                password: password,
            }
        })
    }

    handleOnSignIn()
    {
        this.signIn()
    }

    render()
    {
        return (
            <>
                <div className="si-block-left">
                    <img src="/images/project-manager.png" alt="" />
                </div>
                <div className="si-block-right">
                    <div className="wrapper">
                        <h1>Project Manager - Space</h1>
                        <p>Ready for a new adventure.</p>
                        <h4>Sign In</h4>
                        <form onSubmit={ (event: React.FormEvent<HTMLFormElement>) => event.preventDefault() }>
                            <div className="form-row">
                                <label htmlFor="email">Email</label>
                                <div className="input-icon">
                                    <input type="email" name="email" id="email" 
                                        placeholder="admin@sparkmanagement.demo"
                                        defaultValue={this.state.data.name_first}
                                        onChange={this.handleInputChange} />
                                    <div className="icon">
                                        <AtSymbolIcon />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <label htmlFor="password">Password</label>
                                <div className="input-icon">
                                    <InputPassword
                                        hasIcon={ true }
                                        onChange={ (password: any) => this.handlePasswordOnChange(password) }/>
                                </div>
                            </div>
                            <div className="form-row">
                                <button type="button" className="button-text"
                                    onClick={ () => this.handleOnSignIn() }>Sign In</button>
                            </div>
                            <div className="form-errors">
                                {this.state.error && <p>{this.state.error}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}