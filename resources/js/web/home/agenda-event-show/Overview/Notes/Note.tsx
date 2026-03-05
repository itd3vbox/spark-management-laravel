import React from "react"
import {
    XMarkIcon,
    CheckCircleIcon,
    ArrowDownIcon,
    CheckIcon,
    EllipsisVerticalIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDribbble, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";


interface TaskProps
{
    data: any
    onEdit: (data: any) => void
    onDelete: () => void
}


interface TaskState
{
    toolsIsSelected: boolean
    toolsStyle: any
}

export default class Task extends React.Component<TaskProps, TaskState>
{
    refBlockTools: any

    constructor(props: TaskProps)
    {
        super(props)
        this.state = {
            toolsIsSelected: false,
            toolsStyle: {},
        }

        this.refBlockTools = React.createRef()
    }

    async destroy()
    {
        const url: string = `/notes/${ this.props.data.id }` 

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'DELETE')

        // for (const key in formData) 
        // {
        //     if (formData.hasOwnProperty(key))
        //         multipartFormData.append(key, formData[key])
        // }
    
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
            
            this.props.onDelete()         
        } 
        catch (error) 
        {
            console.error('Error', error)
        }
    }

    handleBlockToolsOnSelect(event: any)
    {
        
        const element = event.currentTarget
        const objetRect = element.getBoundingClientRect() //button
        
        const objectRectClient = this.refBlockTools.current.getBoundingClientRect()
        
        const style = {
            display: 'block',
            top: objetRect.top + 'px',
            right: (window.innerWidth - objetRect.left) + 'px',
        }
        this.setState({
            ...this.state,
            toolsStyle: style,
            toolsIsSelected: true,
        })

    }

    getIcon(link: string) {
        if (link.includes('github.com')) {
            return (<FontAwesomeIcon icon={faGithub} />);
        } else if (link.includes('dribbble.com')) {
            return (<FontAwesomeIcon icon={faDribbble} />);
        } else {
            return (<FontAwesomeIcon icon={faGlobe} />);
        }
    }

    handleBlockToolsOnSelectOnly()
    {
        this.setState({
            ...this.state,
            toolsIsSelected: false,
        })
    }

    handleOnEdit()
    {
        this.props.onEdit(this.props.data)
    }

    handleOnDelete()
    {
        this.destroy()
    }

    renderKeywords()
    {
        const keywords: any = this.props.data.keywords ? JSON.parse(this.props.data.keywords) : []
        const elements: any = []
        for (let index = 0; index < keywords.length; index++) {
            const keyword = keywords[index];
            elements.push(
                <div className="keyword">{ keyword }</div>
            )
        }
        return (
            <div className="keywords">{ elements }</div>
        )
    }

    renderLinks() {

        const links: any = this.props.data.links ? JSON.parse(this.props.data.links) : []
        const elements: any = []
        for (let index = 0; index < links.length; index++) {
            const link = links[index];
            elements.push(
                <a href={link} target="_blank" rel="noopener noreferrer" className="button-icon btn-link">
                    {this.getIcon(link)}
                </a>
            )
        }
        return (
            <div className="links">{ elements }</div>
        )
    }

    renderTools()
    {
        return (
            <div className={ 'block-tools' + (this.state.toolsIsSelected ? ' selected' : '') } 
                ref={ this.refBlockTools }
                onClick={ () => this.handleBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.toolsStyle }>
                    <button onClick={ () => this.handleOnEdit() }>Edit</button>
                    <button onClick={ () => this.handleOnDelete() }>Delete</button>
                </div>
            </div>
        )
    }
    
    render()
    {
        const computeContent = (content: string, max: number = 300): string => {
            if (!content) return ''

            return content.length > max
                ? content.substring(0, max) + '…'
                : content
        }


        return (
            <div className={"note"}>
                <div className="t-top">
                    <div className="date">
                        <div className="icon">
                            <CalendarIcon />
                        </div>
                        <div className="value">{ this.props.data.date_info.updated_at }</div>
                    </div>
                    <div className="options">
                        <button type="button" className="button-icon"
                            onClick={ (event) => this.handleBlockToolsOnSelect(event) }>
                            <EllipsisVerticalIcon />
                        </button>
                    </div>
                </div>
                <div className="t-main">
                    <h6 className="title">{ this.props.data.title }</h6>
                    <div className="content">
                        <p>{ computeContent(this.props.data.content) }</p>
                    </div>
                    { this.renderKeywords() }
                    { this.renderLinks() }
                </div>
                { this.renderTools() }
            </div>
        )
    }
}