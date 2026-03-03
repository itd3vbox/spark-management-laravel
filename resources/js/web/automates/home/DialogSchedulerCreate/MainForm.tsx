import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    ArrowDownIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Calendar from "@/components/calendar/Calendar";
import PickerTime from "@/components/picker-time/PickerTime";
import Project from "./Project";
import Pagination from "@/components/pagination/Pagination";
import { time } from "console";

interface MainFormProps
{
    onProjectSelect: (data: any) => void
    automatesSelected: any[]
    onCreate: (data: any) => void
}


interface MainFormState
{
    data: any
    dataProjects: any
    projectSelected: any
}

export default class MainForm extends React.Component<MainFormProps, MainFormState>
{

    constructor(props: any)
    {
        super(props)
        this.state = {
            data: {
                date: null,
                time: null,
                project: '',
                description_short: '',
            },
            dataProjects: null,
            projectSelected: null,
        }
    }

    async store()
    {
        const url = `/automates-scheduler`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const automates = this.props.automatesSelected.map(automate => automate.id)
        const automatesId = JSON.stringify(automates)

        console.log(automatesId)

        const formData = {
            date: this.state.data.date,
            time: this.state.data.time,
            project: this.state.projectSelected ? this.state.projectSelected.id : null,
            description_short: this.state.data.description_short,
            automates: automatesId,
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

            if (response.status !== 201)
                return 

            this.setState({
                data: {
                    date: '',
                    time: '',
                    project: '',
                    description_short: '',
                },
                projectSelected: null,
                dataProjects: null,
            }, () => {
                this.props.onCreate(result.data)
            })
            
            
        } 
        catch (error) 
        {
            console.error('Error create', error)
        }
    }

    async searchProjects(url: string = `/projects/search`)
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
            keywords: this.state.data.project,
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
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
                dataProjects: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    handleOnDate(date: any)
    {
        console.log('date ...', date)
        this.setState({
            data: {
                ...this.state.data,
                date: date.toText,
            }
        })
    }

    handleOnTime(time: any)
    {
        console.log('time ...', time)
        this.setState({
            data: {
                ...this.state.data,
                time: time.toText,
            }
        })
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) 
    {
        const { name, value } = event.target
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                [name]: value
            }
        }))
    }

    handleProjectsOnSearch()
    {
        this.searchProjects()
    }

    handleOnSelect(data: any, isSelected: boolean)
    {
        this.setState({
            projectSelected: isSelected ? data : null,
        }, () => {
            this.props.onProjectSelect(this.state.projectSelected)
        })
    }
    
    handleProjectsOnPrev()
    {
        if (this.state.dataProjects && this.state.dataProjects.next_page_url)
            this.searchProjects(this.state.dataProjects.prev_page_url)
    }

    handleProjectsOnNext()
    {
        if (this.state.dataProjects && this.state.dataProjects.next_page_url)
            this.searchProjects(this.state.dataProjects.next_page_url)
    }

    handleOnCreate()
    {
        this.store()
    }

    // --- RENDER

    renderProjects()
    {
        const data = this.state.dataProjects && this.state.dataProjects.data.length ? this.state.dataProjects.data : null
        if (!data)
            return (<></>)
        
        const elements: any = []

        for (let index = 0; index < data.length; index++)
        {
            const project = data[index]
            elements.push(
                <Project key={ index }
                    data={ project }
                    isSelected={ this.state.projectSelected && this.state.projectSelected.id === project.id }
                    onSelect={ (data: any, isSelected: boolean) => this.handleOnSelect(data, isSelected) } />
            ) 
        }

        return (
            <div className="list">
                <div className="projects">
                    { elements }
                </div>
                <Pagination 
                    onPrev={ () => this.handleProjectsOnPrev() }
                    onNext={ () => this.handleProjectsOnNext() } />
            </div>
        )
    }

    render()
    {
        return (
            <div className="c-main-form">
                <form>
                    <div className="form-row">
                        <label>Date</label>
                        <Calendar onDate={ (date: any) => this.handleOnDate(date) }/>
                        <p className="error">Message error.</p>
                    </div>
                    <div className="form-row">
                        <label>Time</label>
                        <PickerTime onTime={ (time: any) => this.handleOnTime(time) } />
                        <p className="error">Message error.</p>
                    </div>
                    <div className="form-row fr-project">
                        <label>Project</label>
                        <input type="text" 
                            name="project" 
                            placeholder="Ex.: Project Manager ..."
                            onChange={(e) => this.handleInputChange(e)} 
                            value={ this.state.data.project }
                            id="dc-project" />
                        <button type="button"
                            className="button-icon"
                            onClick={ () => this.handleProjectsOnSearch() }>
                            <MagnifyingGlassIcon />
                        </button>
                        <p className="error">Message error.</p>
                        { this.renderProjects() }
                    </div>
                    <div className="form-row">
                        <label htmlFor="dc-description-short">Description Short</label>
                        <textarea name="description_short" 
                            id="dc-description-short"
                            onChange={(e) => this.handleInputChange(e)}
                            value={ this.state.data.description_short } 
                            placeholder="Ex.: ..."></textarea>
                        <p className="error">Message error.</p>
                    </div>
                    <div className="form-row">
                        <label htmlFor="dc-automates">Automates</label>
                        <p>Choose your Automates (curr.: <span className="value">{ this.props.automatesSelected.length }</span> ).</p>
                        <p className="error">Message error.</p>
                    </div>
                    <div className="form-row fr-submit">
                        <button type="button"
                            onClick={ () => this.handleOnCreate() }>Create</button>
                    </div>
                </form>
            </div>
        )
    }
}