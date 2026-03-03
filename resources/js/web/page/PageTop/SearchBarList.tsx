import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    MagnifyingGlassIcon,
    MusicalNoteIcon,
    CalendarIcon,
    NewspaperIcon,
    GlobeAltIcon,
    PhotoIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

const APP_DOMAIN = import.meta.env.VITE_APP_DOMAIN;
const APP_URL = import.meta.env.VITE_APP_URL;

import Pagination from "@/components/pagination/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD6, faNoteSticky, faRobot } from "@fortawesome/free-solid-svg-icons";

interface SearchBarListProps
{
    type: number | 1
    data: any | null
    onPrev: () => void
    onNext: () => void
}

interface SearchBarListState
{
    isSelected: boolean
}

export default class SearchBarList extends React.Component<SearchBarListProps, SearchBarListState>
{
    constructor(props: SearchBarListProps)
    {
        super(props)
        this.state = {
            isSelected: this.props.data && this.props.data.data.length > 0,
        }
    }

    componentDidMount(): void {
        this.setState({
            isSelected: this.props.data && this.props.data.data.length > 0,
        })
    }

    componentDidUpdate(prevProps: Readonly<SearchBarListProps>, prevState: Readonly<SearchBarListState>, snapshot?: any): void {
        if (prevProps.data !== this.props.data)
        {
            this.setState({
                isSelected: this.props.data && this.props.data.data.length > 0,
            })
        }
    }

    select()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
    }

    handleOnClose()
    {
        this.select()
    }

    handleOnPrev()
    {
        this.props.onPrev()
    }

    handleOnNext()
    {
        this.props.onNext()
    }
   
    getAutomate(automate: any)
    {
        return (
            <a href={ automate.url } 
                className="item i-automate" key={ 'au-' + automate.id }>
                <div className="icon">
                    <FontAwesomeIcon icon={ faRobot } />
                </div>
                <div className="type">Automate</div>
                <div className="label">{ automate.title }</div>
            </a>
        )
    }

    getNote(note: any)
    {
        return (
            <a href={ note.url } 
                className="item i-note" key={ 'no-' + note.id }>
                <div className="icon">
                    <FontAwesomeIcon icon={ faNoteSticky } />
                </div>
                <div className="type">Note</div>
                <div className="label">{ note.title }</div>
            </a>
        )
    }

    getProject(project: any)
    {
        return (
            <a href={ project.url } 
                className="item i-project" key={ 'po-' + project.id }>
                <div className="icon">
                    <FontAwesomeIcon icon={ faDiceD6 } />
                </div>
                <div className="type">Project</div>
                <div className="label">{ project.title }</div>
            </a>
        )
    }

    getTask(task: any)
    {
        return (
            <a href={ task.url } 
                className="item i-task" key={ 'task-' + task.id }>
                <div className="icon">
                    <CheckCircleIcon />
                </div>
                <div className="type">Task</div>
                <div className="label">{ task.title }</div>
            </a>
        )
    }

    renderItems()
    {
        const elements: any = []
        const data = this.props.data ? this.props.data.data : []
        for (let index = 0; index < data.length; index++) 
        {
            const item = data[index]

            if (item.type === 'automate')
                elements.push(this.getAutomate(item))  
            else if (item.type === 'note')
                elements.push(this.getNote(item))  
            else if (item.type === 'project')
                elements.push(this.getProject(item)) 
            else if (item.type === 'task')
                elements.push(this.getTask(item))
        }
        return elements
    }

    renderPagination()
    {
        if (this.props.data && 
            (this.props.data.prev_page_url || this.props.data.next_page_url))
        {
            return (
                <div className="l-pagination">
                    <Pagination
                        hasNext={ this.props.data.next_page_url ? true : false }
                        hasPrev={ this.props.data.prev_page_url ? true : false }
                        onPrev={ () => this.handleOnPrev() }
                        onNext={ () => this.handleOnNext() } />
                </div>
            )
        }
    }

    render() {
        return (
            <div className={"list" + (this.state.isSelected ? ' selected' : '')}>
                <div className="l-close">
                    <button type="button" onClick={() => this.handleOnClose()}>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="l-items">
                    {this.renderItems()}
                </div>
                {this.renderPagination()}
            </div>
        );
    }

}