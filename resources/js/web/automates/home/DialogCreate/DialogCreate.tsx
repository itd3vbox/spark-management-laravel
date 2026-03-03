import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";


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
            formData: {},
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
        
        const url: string = `/automates`

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
            if (key === 'description')
                multipartFormData.append(key, JSON.stringify({ content: formData[key] }))
            else
                multipartFormData.append(key, formData[key])
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
            this.props.onCreate()
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }

    handleImageUpload = (data: { file: File | null, url: string | null }) => {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                image: data.file 
            }
        }))
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) 
    {
        const { name, value } = event.target
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
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
            <div className={ "dialog-create" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <img src="https://cdn.dribbble.com/users/1392449/screenshots/17662830/media/0469c6e6dc9f96a2ac4266499f9723ee.png?compress=1&resize=1600x1200&vertical=top" alt="" />
                    <div className="text">
                        <h4>Create Automate</h4>
                        <p>It is time to create a new task for your project.</p>
                    </div>
                </div>
                <div className="dc-main">
                    <form onSubmit={ (event) => event.stopPropagation() }>
                        <div className="form-row">
                            <label>Project ID</label>
                            <input type="text" 
                                name="project_id" 
                                id="dc-project-id"
                                placeholder="Ex.: 10"
                                onChange={(e) => this.handleInputChange(e)}  />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-name">Name</label>
                            <input type="text" name="name" id="dc-name"
                                placeholder="Ex.: Generator Doc"
                                onChange={(e) => this.handleInputChange(e)}  />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-type">Type</label>
                            <input type="text" 
                                name="type" id="dc-type"
                                placeholder="Ex.: Test"
                                onChange={(e) => this.handleInputChange(e)} />
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-description-short">Description Short</label>
                            <textarea name="description_short" id="dc-description-short"
                                onChange={(e) => this.handleInputChange(e)} 
                                placeholder="Ex.: ..."></textarea>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-description">Description</label>
                            <textarea name="description" id="dc-description"
                                placeholder="Ex.: ..."
                                onChange={(e) => this.handleInputChange(e)} ></textarea>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <label htmlFor="dc-command">Command</label>
                            <textarea name="command" id="dc-command"
                                onChange={(e) => this.handleInputChange(e)} 
                                placeholder="Ex.: /user/machine/automate.sh"></textarea>
                            <p className="error">Message error.</p>
                        </div>
                        <div className="form-row">
                            <button type="button" onClick={ (event) => this.handleSubmit(event) }>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}