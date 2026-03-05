import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

import Keywords from "@/components/form/Keywords";
import Links from "@/components/form/Links";

interface DialogCreateProps
{
    data: any
    onStore: () => void
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
    refDialog: any

    constructor(props: DialogCreateProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            formData: {
                title: '',
                content: '',
                keywords: null,
                links: null,
            },
        }
        this.refDialog = React.createRef();
    }

    select() {
        this.setState(
            prevState => ({ ...prevState, isSelected: !prevState.isSelected }),
            () => {
                // scroll only if it's now selected
                if (this.state.isSelected && this.refDialog.current) {
                    this.refDialog.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        );
    }

    async store()
    {
        const url: string = `/notes`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const { formData } = this.state

        const multipartFormData = new FormData()
        //multipartFormData.append('_method', 'PUT')
        for (const key in formData) 
        {
            multipartFormData.append(key, formData[key])
        }

        multipartFormData.append('event_id', this.props.data.id)
        
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
                    title: '',
                    content: '',
                    keywords: [],
                    links: [],
                }
            }, () => this.props.onStore())
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
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

    handleKeywordsOnUpdate(data: any)
    {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                keywords: data,
            }
        }))
    }

    handleLinksOnUpdate(data: any)
    {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                links: data,
            }
        }))
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.store()
    }

    render()
    {
        return (
            <div ref={this.refDialog} 
                className={ "dialog-create" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                   <div className="frame"></div>
                    <div className="text">
                        <h4>Create Note</h4>
                        <p>Write down your ideas, thoughts, or important information.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <form onSubmit={ (event) => event.preventDefault() }>
                        <div className="form-row">
                            <label htmlFor="dc-title">Title</label>
                            <input type="text" name="title" 
                                id="dc-title"
                                value={ this.state.formData.title }
                                placeholder="Ex.: Alpha & Omega"
                                onChange={(e) => this.handleInputOnChange(e)} />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-content">Content</label>
                            <textarea name="content"
                                id="dc-content"
                                value={ this.state.formData.content }
                                placeholder="Ex.: ..."
                                onChange={(e) => this.handleInputOnChange(e)}></textarea>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-content">Keywords</label>
                            <Keywords      
                                data={ this.state.formData.keywords }                         
                                onUpdate={ (data: any) => this.handleKeywordsOnUpdate(data) }
                                />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-content">Links</label>
                            <Links
                                data={ this.state.formData.links }   
                                onUpdate={ (data: any) => this.handleLinksOnUpdate(data) }
                                />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <button type="button"
                                onClick={ (event) => this.handleSubmit(event) }>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}