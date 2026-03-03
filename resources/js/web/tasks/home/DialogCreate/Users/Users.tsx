import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Pagination from "@/components/pagination/Pagination";
import User from "./User";

interface UsersProps
{
    userSelected: any
    onSelect: (data: any) => void
}

interface UsersState
{
    data: any
    userSelected: any
}

export default class Users extends React.Component<UsersProps, UsersState>
{

    constructor(props: UsersProps)
    {
        super(props)
        this.state = {
            data: null,
            userSelected: null,
        }
    }

    componentDidMount(): void {
        this.search()
    }

    async search(url: string = `/users/search`)
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

    handleUserOnSelect(data: any)
    {
        this.setState({
            userSelected: data,
        })
    }

    renderList()
    {
        const elements: any = []
        const users = this.state.data && this.state.data.data.length ? this.state.data.data : null

        if (!users)
            return (<></>)

        for (let index = 0; index < users.length; index++) {
            const user = users[index];
            elements.push(<User key={ user.id }
                data={ user }
                isSelected={ this.state.userSelected && this.state.userSelected.id === user.id }
                onSelect={ (data) => this.handleUserOnSelect(data) } />)
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
        const users = this.state.data && this.state.data.data.length ? this.state.data.data : null

        if (users)
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
            <div className="users">
                { this.renderList() }
                { this.renderMessageEmpty() }
            </div>
        )
    }
}