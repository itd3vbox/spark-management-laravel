import React from "react"
import {
    XMarkIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import Note from "./Note";
import DialogCreate from "./DialogCreate/DialogCreate";
import Pagination from "@/components/pagination/Pagination";
import DialogEdit from "./DialogEdit/DialogEdit";
import DialogShow from "./DialogShow/DialogShow";

interface NotesProps
{
    
}


interface NotesState
{
    data: any
}

export default class Notes extends React.Component<NotesProps, NotesState>
{
    refDialogCreate: any
    refDialogEdit: any
    refDialogShow: any

    constructor(props: any)
    {
        super(props)
        this.state = {
            data: null,
        }
        this.refDialogCreate = React.createRef()
        this.refDialogEdit = React.createRef()
        this.refDialogShow = React.createRef()
    }

    componentDidMount(): void {
        this.search()
    }

    async search()
    {
        const url: string = `/notes/search`

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

    handleOnDelete()
    {
        this.search()
    }

    handleOnShow(data: any)
    {
        this.refDialogShow.current.select(data)
    }

    renderNotes()
    {
        const notes = this.state.data ? this.state.data.data : []
        let elements: any = []
        for (let index = 0; index < notes.length; index++) 
        {
            const note = notes[index]
            elements.push(
                <Note key={ note.id }
                    data={ note }
                    onEdit={ (data) => this.handleOnEdit(data) }
                    onDelete={ () => this.handleOnDelete() }
                    onShow={ (data) => this.handleOnShow(data) } />
            )
        }

        return elements
    }

    render()
    {
        return (
            <div id="notes">
                <div className="p-options">
                    <div className="options">
                        <button type="button" className="btn-create"
                            onClick={ () => this.handleDialogCreateOnSelect() }>
                           <PlusIcon />
                        </button>
                    </div>
                    <div className="dialogs"></div>
                </div>
                <div className="p-list">
                    { this.renderNotes() }
                </div>
                <Pagination />
                <DialogCreate ref={ this.refDialogCreate }
                    onCreate={ () => this.handleOnCreate() } />
                <DialogEdit ref={ this.refDialogEdit }
                    onUpdate={ () => this.handleOnUpdate() } />
                <DialogShow ref={ this.refDialogShow } />
            </div>
        )
    }
}