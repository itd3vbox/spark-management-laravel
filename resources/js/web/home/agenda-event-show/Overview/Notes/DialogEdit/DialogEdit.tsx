import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

import Keywords from "@/components/form/Keywords";
import Links from "@/components/form/Links";

interface DialogEditProps
{
    data: any
    onUpdate: () => void
}


interface DialogEditState
{
    isSelected: boolean
    formData: {
        [key: string]: any
    }
}

export default class DialogEdit extends React.Component<DialogEditProps, DialogEditState>
{   
    refDialog: any

    constructor(props: DialogEditProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            formData: {
                title: '',
                content: '',
                keywords: [],
                links: [],
            },
        }
        this.refDialog = React.createRef();
    }

    select(data: any = null)
    {
        const formData: any = {}
        if (data)
        {
            formData['edit_url'] = `notes/${ data.id }`
            formData['title'] = data.title
            formData['content'] = data.content
            formData['keywords'] = data.keywords
            formData['links'] = data.links
        }

        this.setState(prevState => ({
            ...prevState,
            isSelected: !prevState.isSelected,
            formData: formData,
        }), () => {
            if (this.state.isSelected && this.refDialog.current) {
                this.refDialog.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    async update() 
    {
        const { formData } = this.state

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'PUT')
        for (const key in formData) 
        {
            if (key === 'description')
                multipartFormData.append(key, JSON.stringify({ content: formData[key] }))
            else
                multipartFormData.append(key, formData[key])
        }

        const url: string = formData['edit_url']

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
                keywords: data
            }
        }))
    }

    handleLinksOnUpdate(data: any)
    {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                links: data
            }
        }))
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.update()
    }
    
    render()
    {
        return (
            <div 
                ref={this.refDialog}
                className={ "dialog-edit" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <div className="frame"></div>
                    <div className="text">
                        <h4>Edit Note</h4>
                        <p>It is time to create a wonderful project.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <form onSubmit={ (event) => event.stopPropagation() }>
                        <div className="form-row">
                            <label htmlFor="dc-title">Title</label>
                            <input type="text" name="title" 
                                id="dc-title"
                                placeholder="Ex.: Alpha & Omega"
                                value={ this.state.formData.title }
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
                                onClick={(e) => this.handleSubmit(e)}>Update</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}