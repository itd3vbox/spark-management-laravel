import React from "react"
import {
    XMarkIcon,
    PlusIcon,
    StarIcon,
    PlayIcon,
    EllipsisVerticalIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import Pagination from "@/components/pagination/Pagination";
import DialogCreate from "./DialogCreate/DialogCreate";
import DialogShow from "./DialogShow/DialogShow";
import DialogDelete from "./DialogDelete/DialogDelete";
import Automate from "./Automate";

import DialogSchedulerShow from "./DialogSchedulerShow/DialogSchedulerShow";
import DialogSchedulerCreate from "./DialogSchedulerCreate/DialogSchedulerCreate";


interface AutomatizationProps
{
    
}


interface AutomatizationState
{
    data: any
    schedulerBlockToolsIsSelected: boolean
    schedulerBlockToolsStyle: any
}

export default class Automatization extends React.Component<AutomatizationProps, AutomatizationState>
{
    refSchedulerBlockTools: any
    refDialogCreate: any
    refDialogShow: any
    refDialogDelete: any

    refDialogSchedulerShow: any
    refDialogSchedulerCreate: any

    constructor(props: AutomatizationProps)
    {
        super(props)
        this.state = {
            data: null,
            schedulerBlockToolsIsSelected: false,
            schedulerBlockToolsStyle: {},
        }
        this.refSchedulerBlockTools = React.createRef()
        this.refDialogCreate = React.createRef()
        this.refDialogShow = React.createRef()
        this.refDialogDelete = React.createRef()
        this.refDialogSchedulerShow = React.createRef()
        this.refDialogSchedulerCreate = React.createRef()
    }

    componentDidMount(): void 
    {
        this.search()
    }

    async search(url: string = `/automates/search`)
    {
        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const formData = {
            is_asc: false,
            max: 20,
            with_project: true,
        }
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result)
            this.setState({
                ...this.state,
                data: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    handleSchedulerBlockToolsOnSelect(event: any)
    {
        
        const element = event.currentTarget
        const objetRect = element.getBoundingClientRect() //button
        
        const objectRectClient = this.refSchedulerBlockTools.current.getBoundingClientRect()
        
        const style = {
            display: 'block',
            top: objetRect.top + 'px',
            right: (window.innerWidth - objetRect.left) + 'px',
        }
        this.setState({
            ...this.state,
            schedulerBlockToolsStyle: style,
            schedulerBlockToolsIsSelected: true,
        })

    }
    
    handleSchedulerBlockToolsOnSelectOnly()
    {
        this.setState({
            ...this.state,
            schedulerBlockToolsIsSelected: false,
        })
    }
    
    handleDialogCreateOnSelect()
    {
        this.refDialogCreate.current.select()
    }

    handleDialogShowOnSelect(automate: any)
    {
        this.refDialogShow.current.select(automate)
    }

    handleDialogEditOnSelect(automate: any)
    {
        //this.refDialogShow.current.select(automate)
    }

    handleDialogDeleteOnSelect(automate: any)
    {
        //this.refDialogShow.current.select(automate)
    }

    handleDialogSchedulerShowOnSelect()
    {
        this.refDialogSchedulerShow.current.select()
    }

    handleDialogSchedulerCreateOnSelect()
    {
        this.refDialogSchedulerCreate.current.select()
    }

    handleAutomateOnExecute()
    {
        this.search()
    }

    handleOnCreate()
    {
        this.search()
    }

    handleOnPrev()
    {
        const url = this.state.data && this.state.data.prev_page_url 
            ? this.state.data.prev_page_url : null
        if (url)
            this.search(url)
    }

    handleOnNext()
    {
        const url = this.state.data && this.state.data.next_page_url 
            ? this.state.data.next_page_url : null
        if (url)
            this.search(url)
    }

    // -- RENDER

    renderSchedulerBlockTools()
    {
        return (
            <div className={ 'scheduler-block-tools' + (this.state.schedulerBlockToolsIsSelected ? ' selected' : '') } 
                ref={ this.refSchedulerBlockTools }
                onClick={ () => this.handleSchedulerBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.schedulerBlockToolsStyle }>
                    <button onClick={ (event) => this.handleDialogSchedulerShowOnSelect() }>Show</button>
                    <button onClick={ (event) => this.handleDialogSchedulerCreateOnSelect() }>Create</button>
                </div>
            </div>
        )
    }

    renderAutomates()
    {
        const automates = this.state.data ? this.state.data.data : []
        let elements: any = []
        for (let index = 0; index < automates.length; index++) 
        {
            const automate = automates[index]

            elements.push(
                <Automate 
                    key={ index } data={ automate }
                    onShow={ () => this.handleDialogShowOnSelect(automate) }
                    onEdit={ () => this.handleDialogEditOnSelect(automate) }
                    onDelete={ () => this.handleDialogDeleteOnSelect(automate) }
                    onExecute={ () => this.handleAutomateOnExecute() } />
            )
        }
        return elements
    }

    render()
    {
        return (
            <div id="automatization">
                <div className="a-block-top">
                    <div className="block-zero">
                        <button type="button" className="btn-create"
                            onClick={ () => this.handleDialogCreateOnSelect() }>
                            <PlusIcon />
                        </button>
                        <button type="button" className="btn-scheduler"
                            onClick={ (event) => this.handleSchedulerBlockToolsOnSelect(event) }>
                            <CalendarIcon />
                        </button>
                        { this.renderSchedulerBlockTools() }
                    </div>
                    <div className="block-metrics"></div>
                </div>
                <div className="a-block-main">
                    <div className="list">
                        { this.renderAutomates() }
                    </div>
                    <Pagination
                        onPrev={ () => this.handleOnPrev() }
                        onNext={ () => this.handleOnNext() } />
                </div>
                <DialogCreate ref={ this.refDialogCreate }
                    onCreate={ () => this.handleOnCreate() } />
                <DialogShow ref={ this.refDialogShow }
                    onExecute={ () => this.handleAutomateOnExecute() } />
                <DialogDelete ref={ this.refDialogDelete } />
                <DialogSchedulerShow ref={ this.refDialogSchedulerShow } />
                <DialogSchedulerCreate ref={ this.refDialogSchedulerCreate } />
            </div>
        )
    }
}