import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import Event from "./Event";
import Pagination from "@/components/pagination/Pagination";
import Masonry from "./Masonry";
import DialogCreate from "./DialogCreate/DialogCreate";
import DialogEdit from "./DialogEdit/DialogEdit";


interface NotesProps
{
    data: any
    onEventEdit: (data: any) => void
    onEventDelete: (data: any) => void
    onClose: any
}


interface NotesState
{
    
}

export default class Notes extends React.Component<NotesProps, NotesState>
{
    refDialogCreate: any
    refDialogEdit: any
    
    constructor(props: NotesProps)
    {
        super(props)
        this.state = {

        }
        this.refDialogCreate = React.createRef()
        this.refDialogEdit = React.createRef()
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

    handleEventOnEdit(data: any)
    {
        this.props.onEventEdit(data)
    }
    
    handleEventOnDelete(data: any)
    {
        this.props.onEventDelete(data)
    }

    handleEventOnClose()
    {
        this.setState({
            dataSelected: null,
            isModeDelete: false,
        })
    }

    handleEventOnDestroy()
    {
        this.setState({
            dataSelected: null,
            isModeDelete: false,
        })
    }
    
    handleOnClose()
    {
        this.props.onClose()
    }

    handleOnCreate()
    {
        this.refDialogCreate.current.select()
    }

    handleOnStore()
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

    renderList()
    {
 
        return (
            <div className="list">
                <Masonry items={ [] } />
                <Pagination />
            </div>
        )
    }

    render()
    {
        const _event = this.props.data

        return (
            <div className="notes">
                <Event data={ _event }
                    onEdit={ (data: any) => this.handleEventOnEdit(data) }
                    onDelete={ (data: any) => this.handleEventOnDelete(data) } />
                <div className="options">
                    <button type="button" className="btn-create"
                        onClick={ () => this.handleOnCreate() }>
                        <PlusIcon />
                    </button>
                    <button type="button" className="btn-close"
                        onClick={ () => this.handleOnClose() }>
                        <XMarkIcon />
                    </button>
                </div>
                { this.renderList() }
                <DialogCreate ref={ this.refDialogCreate }
                    onCreate={ () => this.handleOnCreate() } />
                <DialogEdit ref={ this.refDialogEdit }
                    onUpdate={ () => this.handleOnUpdate() } />
            </div>
        )
    }
}