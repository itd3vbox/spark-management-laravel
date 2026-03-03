import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    PlayIcon,
} from '@heroicons/react/24/outline';
import ImageUploader from "@/components/image-uploader/ImageUploader";
import Task from "@/app/tasks/Task";


interface DialogShowProps
{
    onExecute: () => void
}


interface DialogShowState
{
    isSelected: boolean
    tabsMenuItemSelected: number
    data: any
    dataLog: any
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
            dataLog: '',
        }
    }

    select(data: any = null)
    {
        this.setState({
            isSelected: !this.state.isSelected,
            data: data,
        }, () => {
            if (this.state.isSelected)
                this.log()
        })
    }

    async log()
    {
        const formData = new FormData()
        //formData.append('_method', 'PATCH')
    
        const url: string = 'http://projectmanager.demo/api/automates/' + this.state.data.id + '/log'

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                //body: formData,
            })

            const result = await response.json()
            console.log(result)
            this.setState({
                dataLog: result.output,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    async execute()
    {    
        const url: string = `/automates/${ this.state.data.id }/execute`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const formData = new FormData()
        //formData.append('_method', 'PATCH')
        //formData.append('status', String(this.state.data.status === 1 ? 2 : 1))

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData,
            })

            const result = await response.json()
            console.log(result)
            this.setState({
                dataLog: result.output,
                data: {
                    ...this.state.data,
                    ...result.data,
                }
            }, () => this.props.onExecute())
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    handleTabsMenuItemOnClick(index: number)
    {
        this.setState({
            tabsMenuItemSelected: index,
        })
    }

    handleOnExecute()
    {
        this.execute()
    }

    renderProject()
    {
        return (
            <div className="project">
                <div className="block-zero">
                    <img src={ this.state.data.project.image_info.path } alt={ "Image Main" + this.state.data.project.name } />
                </div>
                <div className="block-main">
                    <h6>{ this.state.data.project.name }</h6>
                    <p className="description-short">{ this.state.data.project.description_short }</p>
                </div>
            </div>
        )
    }

    
    render()
    {
        const automate = this.state.data ? this.state.data : null
        if (!automate) 
            return <></> 

        return (
            <div className={ "dialog-show" + (this.state.isSelected ? ' selected' : '') }>
                <div className="dc-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="dc-zero">
                    <img src="https://cdn.dribbble.com/users/1392449/screenshots/17662830/media/0469c6e6dc9f96a2ac4266499f9723ee.png?compress=1&resize=1600x1200&vertical=top" alt="" />
                </div>
                <div className="dc-main">
                    <div className="m-tabs-menu">
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(1) }>Overview</button>
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(2) }>Log</button>
                    </div>
                    <div className="m-tabs-contents">
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 1 ? ' selected' : '')}>
                            <div className="c-overview">
                                <div className="automate">
                                    <h4>{ automate.name ? automate.name : 'Automate 1' }</h4>
                                    <p className="description-short">{ automate.description_short ? automate.description_short : 'A good project to help me to build other projects.' }</p>
                                    <div className="type">{ automate.type }</div>
                                    <div className="date">
                                        <div className="label">Exec. Done:</div>
                                        <div className="value">{ automate.exec_info.date }</div>
                                    </div>
                                    <div className="options">
                                        <button type="button" className="btn-play"
                                            onClick={ () => this.handleOnExecute() }>
                                            <PlayIcon />
                                        </button>
                                    </div>
                                </div>
                                { this.renderProject() }
                                <div className="description">
                                    <h3>Description</h3>
                                    <div className="d-content">
                                        <p>{ automate.description }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 2 ? ' selected' : '')}>
                           <div className="c-log">
                                <pre><code>{ this.state.dataLog }</code></pre>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}