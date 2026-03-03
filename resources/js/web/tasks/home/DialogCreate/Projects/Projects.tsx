import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Pagination from "@/components/pagination/Pagination";
import Project from "./Project";


interface ProjectsProps
{
    projectSelected: any
    onSelect: (data: any) => void
}


interface ProjectsState
{
    data: any
    projectSelected: any
}

export default class Projects extends React.Component<ProjectsProps, ProjectsState>
{

    constructor(props: ProjectsProps)
    {
        super(props)
        this.state = {
            data: null,
            projectSelected: null,
        }
    }

    componentDidMount(): void {
        this.search()
    }

    async search(url: string = `/projects/search`)
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
            console.log(result.data)
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

    handleOnPrev()
    {
        if (this.state.data && this.state.data.prev_page_url)
            this.search(this.state.data.prev_page_url)
    }

    handleOnNext()
    {
        if (this.state.data && this.state.data.next_page_url)
            this.search(this.state.data.next_page_url)
    }

    handleProjectOnSelect(data: any)
    {
        this.setState({
            projectSelected: data,
        })
    }

    renderList()
    {
        const elements: any = []
        const projects = this.state.data && this.state.data.data.length ? this.state.data.data : null

        if (!projects)
            return (<></>)

        for (let index = 0; index < projects.length; index++) {
            const project = projects[index];
            elements.push(<Project key={ project.id }
                data={ project }
                isSelected={ this.state.projectSelected && this.state.projectSelected.id === project.id }
                onSelect={ (data) => this.handleProjectOnSelect(data) } />)
        }
        return (
            <>
                <div className="list">{ elements }</div>
                <Pagination 
                    onPrev={ () => this.handleOnPrev() }
                    onNext={ () => this.handleOnNext() } />
            </>
        )   
    }

    renderMessageEmpty()
    {
        const projects = this.state.data && this.state.data.data.length ? this.state.data.data : null

        if (projects)
            return (<></>)
        
        return (
            <div className="message-empty">
                <div className="block-frame">
                    <img src="/images/project-cube.png" alt="" />
                </div>
                <div className="block-text">
                    <div className="text">
                        <h4>Lorem ipsum dolor sit amet.</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, quod!</p>
                    </div>
                </div>
            </div>
        )
    }

    render()
    {
        return (
            <div className="projects">
                { this.renderList() }
                { this.renderMessageEmpty() }
            </div>
        )
    }
}