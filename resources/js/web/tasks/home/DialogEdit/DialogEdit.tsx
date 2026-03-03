import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import Keywords from "@/components/form/Keywords";
import Links from "@/components/form/Links";
import Projects from "./Projects/Projects";
import Users from "./Users/Users";


interface DialogEditProps
{
    onEdit: () => void
}


interface DialogEditState
{
    isSelected: boolean
    formData: {
        [key: string]: any
    },
    data: any
    projectSelected: any
    userSelected: any
    tabsMenuItemSelected: number
}

export default class DialogEdit extends React.Component<DialogEditProps, DialogEditState>
{

    constructor(props: DialogEditProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            formData: {
                image: null,
                title: null,
                description_short: '',
                description: '',
                keywords: null,
                links: null,
            },
            data: null,
            projectSelected: null,
            userSelected: null,
            tabsMenuItemSelected: 1,
        }
    }
    
    select(data: any = null)
    {
        console.log('Task Edit', data)
        let formData: any = {
            image: null,
            title: '',
            description_short: '',
            description: '',
            keywords: null,
            links: null,
        }

        if (data)
        {
            formData['edit_url'] = `/tasks/${ data.id }` 
            formData['image'] = null
            formData['title'] = data.title
            formData['description_short'] = data.description_short
            formData['description'] = data.description
            formData['keywords'] = data.keywords
            formData['links'] = data.links   
        }

        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
            formData: formData,
            data: data,
            projectSelected: data ? data.project : null,
            userSelected: data && data.users.length ? data.users[0] : null,
        })
    }

    async store()
    {
        const url: string = `/tasks`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const { formData } = this.state

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'PUT')
        if (this.state.formData.image)
            multipartFormData.append('image', this.state.formData.image)
        multipartFormData.append('title', this.state.formData.title)
        multipartFormData.append('description_short', this.state.formData.description_short)
        multipartFormData.append('description', this.state.formData.description)
        multipartFormData.append('keywords', this.state.formData.keywords)
        multipartFormData.append('links', this.state.formData.links)
        
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
                    image: null,
                    title: '',
                    description_short: '',
                    description: '',
                    keywords: null,
                    links: null,
                }
            }, () => this.props.onEdit())
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }

    handleTabsMenuItemOnClick(index: number)
    {
        this.setState({
            ...this.state,
            tabsMenuItemSelected: index,
        })
    }

    handleImageOnUpload = (data: { file: File | null, url: string | null }) => {
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

    handleProjectOnSelect(data: any)
    {
        this.setState({
            projectSelected: data,
        })
    }

    handleUserOnSelect(data: any)
    {
        this.setState({
            userSelected: data,
        })
    }

    handleOnSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) 
    {
        event.preventDefault()
        this.store()
    }

    renderMainForm()
    {
        return (
            <form onSubmit={ (event) => event.preventDefault() }>
                <div className="form-row">
                    <label>Image</label>
                    <ImageUploader 
                        onUpload={this.handleImageOnUpload}/>
                    <p className="error">Message error.</p>
                </div>
                <div className="form-row">
                    <label htmlFor="dc-title">Title</label>
                    <input type="text" name="title" 
                        id="dc-title"
                        value={ this.state.formData.title }
                        placeholder="Ex.: Task"
                        onChange={(e) => this.handleInputOnChange(e)} />
                    <p className="error">Message error.</p>
                </div>
                <div className="form-row">
                    <label htmlFor="dc-description-short">Description Short</label>
                    <textarea name="description_short"
                        id="dc-description-short"
                        value={ this.state.formData.description_short }
                        placeholder="Ex.: ..."
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
                    <label htmlFor="dc-description">Links</label>
                    <Links 
                        data={ this.state.formData.links }
                        onUpdate={ (data: any) => this.handleLinksOnUpdate(data) } />
                    <p className="error">Message error.</p>
                </div>
            </form>
        )
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
                        <h4>Create Task</h4>
                        <p>It is time to create a new task.</p>
                        <form onSubmit={ (event) => event.preventDefault() }>
                            <button type="button"
                                onClick={ (event) => this.handleOnSubmit(event) }>Create</button>
                        </form>
                    </div>
                </div>
                <div className="dc-main">
                
                    <div className="m-tabs-menu">
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(1) }>Overview</button>
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(2) }>Project</button>
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(3) }>User</button>
                    </div>
                    <div className="m-tabs-contents">
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 1 ? ' selected' : '')}>
                            { this.renderMainForm() }
                        </div>
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 2 ? ' selected' : '')}>
                            <Projects 
                                projectSelected={ this.state.projectSelected }
                                onSelect={ (data) => this.handleProjectOnSelect(data) } />
                        </div>
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 3 ? ' selected' : '')}>
                            <Users
                                userSelected={ this.state.userSelected }
                                onSelect={ (data) => this.handleUserOnSelect(data) } />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}