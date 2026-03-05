import React from "react"
import {
    XMarkIcon,
    PlusIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Task from "./Task";
import DialogCreate from "./DialogCreate/DialogCreate";
import Pagination from "@/components/pagination/Pagination";
import DialogEdit from "./DialogEdit/DialogEdit";
import DialogDelete from "./DialogDelete/DialogDelete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";

interface TasksProps
{
    
}


interface TasksState
{
    data: any
}

export default class Tasks extends React.Component<any, TasksState>
{
    refDialogCreate: any
    refDialogEdit: any
    refDialogDelete: any

    constructor(props: any)
    {
        super(props)
        this.state = {
            data: null,
        }
        this.refDialogCreate = React.createRef()
        this.refDialogEdit = React.createRef()
        this.refDialogDelete = React.createRef()
    }

    componentDidMount(): void {
        this.search()
    }

    async search()
    {
        const url: string = `/tasks/search`

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

    handleDialogCreateOnSelect()
    {
        this.refDialogCreate.current.select()
    }
    
    handleOnCreate()
    {
        this.search()
    }

    handleOnEdit(data: any)
    {
        this.refDialogEdit.current.select(data)
    }

    handleOnUpdate()
    {
        this.search()
    }

    handleOnDelete(data: any)
    {
        this.refDialogDelete.current.select(data)
    }

    handleOnDestroy()
    {
        this.search()
    }

    renderTasks()
    {
        const tasks = this.state.data ? this.state.data.data : []
        let elements: any = []

        if (!tasks.length)
            return (<></>)

        for (let index = 0; index < tasks.length; index++) 
        {
            elements.push(
                <Task key={ index } order={index + 1}
                    data={ tasks[index] }
                    onEdit={ (data) => this.handleOnEdit(data) }
                    onUpdate={ () => this.handleOnUpdate() }
                    onDelete={ (data) => this.handleOnDelete(data) } />
            )
        }

        return (
            <div className="p-list">
                <div className="tasks">{ elements }</div>
                <Pagination />
            </div>
        )
    }

    renderMessageEmpty() 
    {
        const tasks = this.state.data ? this.state.data.data : []

        if (tasks.length) return (<></>)

        return (
            <div className="p-message-empty">
                <div className="icon">
                    <CheckCircleIcon />
                </div>
                <div className="text">
                    <h4>No Tasks Available</h4>
                    <p>There are currently no tasks to display.</p>
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
                { this.renderTasks() }
                { this.renderMessageEmpty() }
                <DialogCreate ref={ this.refDialogCreate }
                    onCreate={ () => this.handleOnCreate() } />
                <DialogEdit ref={ this.refDialogEdit }
                    onEdit={ () => this.handleOnUpdate() } />
                <DialogDelete
                    ref={ this.refDialogDelete }
                    onDelete={ () => this.handleOnDestroy() } />
            </>
        )
    }
}