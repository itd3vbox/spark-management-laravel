import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    SparklesIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

import Project from "./Project";

import Tasks from "./Tasks";
import Automates from "./Automates";
import Notifications from "./Notifications";

import './sass/main.sass';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faDiceD6, faRobot, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import ProjectsMetrics from "./ProjectsMetrics";
import Agenda from "./Agenda";

interface HomeProps
{
    
}


interface HomeState
{
    dataMain: any
    dataProjects: any
}

export default class Home extends React.Component<HomeProps, HomeState>
{

    constructor(props: HomeProps)
    {
        super(props)
        this.state = {
            dataMain: {
                total_users: 0,
                total_projects: 0,
                total_tasks: 0,
                total_automates: 0,
                progress_projects_total: 0,
            },
            dataProjects: null,
        }
    }

    componentDidMount(): void 
    {
        this.searchMainData()
        this.searchProjects()
    }

    async searchMainData()
    {
        const url: string = `/app/main-data`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            })

            const result = await response.json()
            console.log(result)
            this.setState({
                dataMain: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    async searchProjects()
    {
        const formData = {
            is_asc: false,
            max: 1,
        }
    
        const url: string = `/projects/search`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
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
            console.log('Projects', result)
            this.setState({
                dataProjects: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    renderProjects()
    {
        const projects: any = []
        const projectsData: any = this.state.dataProjects ? this.state.dataProjects.data : []

        console.log(projectsData)
        for (let index = 0; index < projectsData.length && index < 1; index++) 
        {
            const project = projectsData[index]
            projects.push(
                <Project key={project.id}
                    data={ project }
                    onShow={ () => null } />
            )
        }

        return projects
    }

    render()
    {
        return (
            <div id="home">
                <div className="h-zero">
                    <div className="block-zero">
                        <img src="/images/project-manager.png" alt="" />
                    </div>
                    <div className="block-indicators">
                        <div className="indicator">
                            <div className="label">Projects</div>
                            <div className="icon-value">
                                <div className="icon">
                                    <FontAwesomeIcon icon={ faDiceD6 } />
                                </div>
                                <div className="value">{ this.state.dataMain.total_projects }</div>
                            </div>
                        </div>
                        <div className="indicator">
                            <div className="label">Tasks</div>
                            <div className="icon-value">
                                <div className="icon">
                                    <FontAwesomeIcon icon={ faCheckCircle } />
                                </div>
                                <div className="value">{ this.state.dataMain.total_tasks }</div>
                            </div>
                        </div>
                        <div className="indicator">
                            <div className="label">Automates</div>
                            <div className="icon-value">
                                <div className="icon">
                                    <FontAwesomeIcon icon={ faRobot } />
                                </div>
                                <div className="value">{ this.state.dataMain.total_automates }</div>
                            </div>
                        </div>
                        <div className="indicator">
                            <div className="label">Users</div>
                            <div className="icon-value">
                                <div className="icon">
                                    <FontAwesomeIcon icon={ faUserGroup } />
                                </div>
                                <div className="value">{ this.state.dataMain.total_users }</div>
                            </div>
                        </div>
                    </div>
                    <Agenda />
                </div>
                <div className="h-projects">
                    <div className="block-zero">
                        <ProjectsMetrics
                            data={ this.state.dataMain.progress_projects_total } />
                    </div>
                    <div className="block-projects">                    
                        { this.renderProjects() }
                    </div>
                </div>
                <div className="h-tasks-automates-notifications">
                   <Tasks />
                   <Automates />
                   <Notifications />
                </div>
            </div>
        )
    }
}