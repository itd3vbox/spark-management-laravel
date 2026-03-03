import React from "react"
import {
    XMarkIcon,
    CheckCircleIcon,
    ArrowDownIcon,
    CheckIcon,
    EllipsisVerticalIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';


interface TaskProps
{
    data: any
    onEdit: (data: any) => void
    onDelete: () => void
    onShow: (data: any) => void
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

    handleBlockToolsOnSelectOnly()
    {
        this.setState({
            ...this.state,
            toolsIsSelected: false,
        })
    }

    handleOnShow()
    {
        this.props.onShow(this.props.data)
    }

    handleOnEdit()
    {
        this.props.onEdit(this.props.data)
    }

    handleOnDelete()
    {
        this.destroy()
    }

    renderTools()
    {
        return (
            <div className={ 'block-tools' + (this.state.toolsIsSelected ? ' selected' : '') } 
                ref={ this.refBlockTools }
                onClick={ () => this.handleBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.toolsStyle }>
                    <button onClick={ () => this.handleOnShow() }>Show</button>
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
                        <div className="value">2026-01-01</div>
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
                </div>
                { this.renderTools() }
            </div>
        )
    }
}