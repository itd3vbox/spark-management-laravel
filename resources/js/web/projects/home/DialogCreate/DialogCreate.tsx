import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import Keywords from "@/components/form/Keywords";
import Links from "@/components/form/Links";


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
                title: '',
                description_short: '',
                description: '',
                website: '',
                keywords: null,
                links: null,
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
        const url: string = `/projects`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const { formData } = this.state
        const multipartFormData = new FormData()
        //multipartFormData.append('_method', 'POST')

        if (this.state.formData.image)
            multipartFormData.append('image', this.state.formData.image)
        multipartFormData.append('name', this.state.formData.name)
        multipartFormData.append('description_short', this.state.formData.description_short)
        multipartFormData.append('description', this.state.formData.description)
        multipartFormData.append('links', this.state.formData.links)
        multipartFormData.append('keywords', this.state.formData.keywords)
        multipartFormData.append('website', this.state.formData.website)
    

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
                    name: '',
                    description_short: '',
                    description: '',
                    website: '',
                    keywords: null,
                    links: null,
                }
            }, () => this.props.onCreate())

        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }

    
    handleOnImageUpload = (data: { file: File | null, url: string | null }) => {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                image: data.file 
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
                        <h4>Create Project</h4>
                        <p>It is time to create a wonderful project.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <form onSubmit={ (event) => event.preventDefault() }>
                        <div className="form-row">
                            <label>Image</label>
                            <ImageUploader 
                                onUpload={this.handleOnImageUpload}/>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-name">Name</label>
                            <input type="text" name="name" 
                                id="dc-name"
                                value={ this.state.formData.name }
                                placeholder="Ex.: Project Manager"
                                onChange={(e) => this.handleInputOnChange(e)} />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-description-short">Description Short</label>
                            <textarea name="description_short" 
                                id="dc-description-short"
                                placeholder="Ex.: ..."
                                value={ this.state.formData.description_short }
                                onChange={(e) => this.handleInputOnChange(e)}></textarea>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-description">Description</label>
                            <textarea name="description" 
                                id="dc-description"
                                value={ this.state.formData.description }
                                placeholder="Ex.: ..."
                                onChange={(e) => this.handleInputOnChange(e)}></textarea>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-description">Keywords</label>
                            <Keywords 
                                data={ this.state.formData.keywords }
                                onUpdate={ (data: any) => this.handleKeywordsOnUpdate(data) } />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-website">Website</label>
                            <input type="url" name="website" 
                                id="dc-website"
                                value={ this.state.formData.website }
                                placeholder="Ex.: https://projectmanager.app"
                                onChange={(e) => this.handleInputOnChange(e)} />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-description">Links</label>
                            <Links 
                                data={ this.state.formData.links }
                                onUpdate={ (data: any) => this.handleLinksOnUpdate(data) } />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <button type="button" onClick={(e) => this.handleOnSubmit(e)}>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}