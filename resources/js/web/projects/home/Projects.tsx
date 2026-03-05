import React from "react"
import {
    XMarkIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import Project from "./Project";
import DialogCreate from "./DialogCreate/DialogCreate";
import DialogShow from "./DialogShow/DialogShow";
import DialogDelete from "./DialogDelete/DialogDelete";
import Pagination from "@/components/pagination/Pagination";
import DialogEdit from "./DialogEdit/DialogEdit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD6 } from "@fortawesome/free-solid-svg-icons";


interface ProjectsProps
{
}


interface ProjectsState
{
    data: any
}

export default class Projects extends React.Component<ProjectsProps, ProjectsState>
{
    refDialogCreate: any
    refDialogShow: any
    refDialogEdit: any
    refDialogDelete: any

    constructor(props: ProjectsProps)
    {
        super(props)
        this.state = {
            data: [],
        }
        this.refDialogCreate = React.createRef()
        this.refDialogShow = React.createRef()
        this.refDialogEdit = React.createRef()
        this.refDialogDelete = React.createRef()
    }

    componentDidMount(): void 
    {
        this.search()
    }

    async search()
    {
        const url: string = `/projects/search`

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
            console.log(result)
            this.setState({
                ...this.state,
                data: result,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    handleDialogCreateOnSelect()
    {
        this.refDialogCreate.current.select()
    }

    handleDialogShowOnSelect(data: any)
    {
        this.refDialogShow.current.select(data)
    }

    handleDialogEditOnSelect(data: any)
    {
        this.refDialogEdit.current.select(data)
    }

    handleDialogDeleteOnSelect(data: any)
    {
        this.refDialogDelete.current.select(data)
    }

    handleOnCreate()
    {
        this.search()
    }

    handleOnEdit()
    {
        this.search()
    }

    handleOnDestroy()
    {
        this.search()
    }

    renderProjects()
    {
        const projects = this.state.data.data ? this.state.data.data.data : []
        let elements: any = []

        if (!projects.length)
            return (<></>)

        for (let index = 0; index < projects.length; index++) 
        {
            const project = projects[index]
            elements.push(
                <Project key={ index } 
                    data={project}
                    onShow={ (data: any) => this.handleDialogShowOnSelect(data) }
                    onEdit={ (data: any) => this.handleDialogEditOnSelect(data) }
                    onDelete={ (data: any) => this.handleDialogDeleteOnSelect(data) } />
            )
        }

        return (
            <div className="p-list">
                <div className="projects">{ elements }</div>
                <Pagination />
            </div>
        )
    }

    renderMessageEmpty()
    {
        const projects = this.state.data?.data?.data || []

        if (projects.length)
            return (<></>)

        return (
            <div className="p-message-empty">
                <div className="icon">
                    <FontAwesomeIcon icon={ faDiceD6 } />
                </div>
                <div className="text">
                    <h4>No Projects Found</h4>
                    <p>There are currently no projects available to display.</p>
                </div>
            </div>
        )
    }

    render()
    {
        const userMetaTag = document.querySelector('meta[name="user-is-admin"]');
        let userIsAdmin = userMetaTag?.getAttribute('content') === '1';

        return (
            <>
                <div className="p-options">
                    <div className="options">
                        { userIsAdmin === true && (
                            <button type="button" className="btn-create"
                                onClick={ () => this.handleDialogCreateOnSelect() }>
                            <PlusIcon />
                            </button>
                        ) }
                    </div>
                    <div className="dialogs"></div>
                </div>
                { this.renderProjects() }
                { this.renderMessageEmpty() }
                <DialogCreate 
                    ref={ this.refDialogCreate }
                    onCreate={ () => this.handleOnCreate() } />
                <DialogEdit 
                    ref={ this.refDialogEdit }
                    onEdit={ () => this.handleOnEdit() } />
                <DialogDelete
                    ref={ this.refDialogDelete }
                    onDelete={ () => this.handleOnDestroy() } />
                <DialogShow 
                    ref={ this.refDialogShow } data={ {} } />
            </>
        )
    }
}