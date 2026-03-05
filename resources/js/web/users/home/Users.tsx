import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    PlusIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import DialogCreate from "./DialogCreate/DialogCreate";
import Pagination from "@/components/pagination/Pagination";
import DialogEdit from "./DialogEdit/DialogEdit";
import DialogDelete from "./DialogDelete/DialogDelete";
import User from "./User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UsersProps
{
    isAdmin: boolean
    auth: any
}


interface UsersState
{
    data: any
}

export default class Users extends React.Component<UsersProps, UsersState>
{
    refDialogCreate: any
    refDialogEdit: any
    refDialogDelete: any

    constructor(props: UsersProps)
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
        const url: string = `/users/search`

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

    handleOnUpdate()
    {
        this.search()
    }

    handleOnDelete()
    {
        this.search()
    }

    renderUsers()
    {
        const users = this.state.data ? this.state.data.data : []
        const elements: any = []
        
        if (!users.length)
            return (<></>)

        for (let index = 0; index < users.length; index++) 
        {
            const user = users[index]
            elements.push(
                <User key={ index }
                    isAdmin={ this.props.isAdmin }
                    canDelete={ this.props.auth.id !== user.id }
                    data={ user }
                    onShow={ () => null }
                    onEdit={ (data) => this.handleDialogEditOnSelect(data) }
                    onDelete={ (data) => this.handleDialogDeleteOnSelect(data) } />
            )
        }

        return (
            <div className="p-list">
                <div className="users">{ elements }</div>
                <Pagination />
            </div>
        )
    }

    renderMessageEmpty()
    {
        const users = this.state.data ? this.state.data.data : []

        if (users.length)
            return (<></>)

        return (
            <div className="p-message-empty">
                <div className="icon">
                    <UserGroupIcon />
                </div>
                <div className="text">
                    <h4>No Users Found</h4>
                    <p>There are currently no users available to display.</p>
                </div>
            </div>
        )
    }

    render()
    {
        return (
            <>
                <div className="p-options">
                    <div className="options">
                        { this.props.isAdmin === true && (
                            <button type="button" className="btn-create"
                                onClick={ () => this.handleDialogCreateOnSelect() }>
                            <PlusIcon />
                            </button>
                        ) }
                    </div>
                    <div className="dialogs"></div>
                </div>
                { this.renderUsers() }
                { this.renderMessageEmpty() }
                <DialogCreate ref={ this.refDialogCreate }
                    onCreate={ () => this.handleOnCreate() } />
                <DialogEdit ref={ this.refDialogEdit }
                    onUpdate={ () => this.handleOnUpdate() } />
                <DialogDelete ref={ this.refDialogDelete }
                    onDelete={ () => this.handleOnDelete() } />
            </>
        )
    }
}