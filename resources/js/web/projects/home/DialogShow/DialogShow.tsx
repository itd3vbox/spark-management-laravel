import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import Task from "./Task";


interface DialogShowProps
{

}


interface DialogShowState
{
    isSelected: boolean
    tabsMenuItemSelected: number
    data: any
    dataTasks: any
}

export default class DialogShow extends React.Component<DialogShowProps, DialogShowState>
{

    constructor(props: DialogShowProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            tabsMenuItemSelected: 1,
            data: null,
            dataTasks: [],
        }
    }

    select(data: any = null)
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
            data: data,
            dataTasks: [],
        }, () => {
            if (this.state.isSelected)
                this.searchTasks()
        })
    }

    async searchTasks()
    {
        if (!this.state.data)
            return 

        const url: string = `/tasks/search`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        
        const multipartFormData = new FormData()
        //multipartFormData.append('_method', 'DELETE')

        // for (const key in formData) 
        // {
        //     if (formData.hasOwnProperty(key))
        //         multipartFormData.append(key, formData[key])
        // }
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    is_asc: false,
                    max: 20,
                    project_id: this.state.data.id,
                })
            })

            const result = await response.json()
            console.log(result)
            
            this.setState({
                dataTasks: result.data.data,
            })            
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

    renderTasks()
    {
        const elements: any = []
        for (let index = 0; index < this.state.dataTasks.length; index++) 
        {
            const data = this.state.dataTasks[index]
            elements.push(<Task key={ index } order={ index + 1 }
                data={ data } />)
        }
        return (elements)
    }

    render()
    {
        if (!this.state.data)
            return (<></>)
        return (
            <div className={ "dialog-show" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <img src={ this.state.data.image_info.path } alt="" />
                </div>
                <div className="dc-main">
                    <div className="m-tabs-menu">
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(1) }>Overview</button>
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(2) }>Tasks</button>
                    </div>
                    <div className="m-tabs-contents">
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 1 ? ' selected' : '')}>
                            <div className="c-overview">
                                <h4>{ this.state.data ? this.state.data.name : 'Project Unk.' }</h4>
                                <div className="id">#{this.state.data ? this.state.data.id : 0}</div>
                                <p className="description-short">{ this.state.data ? this.state.data.description_short : 'A good project to help me to build other projects.' }</p>
                            </div>
                        </div>
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 2 ? ' selected' : '')}>
                            <div className="c-tasks">
                                { this.renderTasks() }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}