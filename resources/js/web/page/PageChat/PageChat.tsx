import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import ChatInput from "@/components/form/ChatInput";

import './sass/main.sass'
import Message from "./Message";

interface PageChatProps
{
    
}


interface PageChatState
{
    isSelected: boolean
    dataMessages: any
    dataUsers: any
    dataForm: any
    toolsIsSelected: boolean
    toolsStyle: any
}

export default class PageChat extends React.Component<PageChatProps, PageChatState>
{
    refBlockTools: any
    searchOnceInProgress = false

    constructor(props: PageChatProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            dataMessages: null,
            dataUsers: null,
            dataForm: {
                content: '',
            },
            toolsIsSelected: false,
            toolsStyle: {},
        }
        this.refBlockTools = React.createRef()
    }

    componentDidMount(): void {
        this.search(); 

        const userMetaTag = document.querySelector('meta[name="user-id"]');
        const userId = userMetaTag ? Number(userMetaTag.getAttribute('content')) : null;

        if (!userId) return;

        if (!window._chatSubscriptions) {
            window._chatSubscriptions = true;

            Echo.channel('chat-message.global')
                .listen('ChatMessage', (e: any) => {
                    console.log('Global message:', e);
                    this.searchOnce();
                });

            Echo.private(`chat-message.${userId}`)
                .listen('ChatMessage', (e: any) => {
                    console.log('Private message:', e);
                    this.searchOnce();
                });
        }

        Echo.join('chat-user')
            .here((users: any) => {
                this.updateUsers(users)
            })
            .joining((user: any) => {
                this.addUser(user)
            })
            .leaving((user: any) => {
                this.removeUser(user)
            })
    }

    componentDidUpdate(prevProps: Readonly<PageChatProps>, prevState: Readonly<PageChatState>, snapshot?: any): void {
        const container = document.querySelector('.pc-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    select()
    {
        this.setState({
            isSelected: !this.state.isSelected,
        })
    }

    async search() {
       
        const url: string = `/chat-messages/search`

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
                dataMessages: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    async searchUsers() {
       
        const url: string = `/chat-messages/search-users`

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
                dataMessages: result.data,
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    async searchOnce() {
        if (this.searchOnceInProgress) return;
        this.searchOnceInProgress = true;

        try {
            await this.search();
        } finally {
            this.searchOnceInProgress = false;
        }
    }

    async create() 
    {
       const url: string = `/chat-messages/`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const multipartFormData = new FormData()
        //multipartFormData.append('_method', 'POST')

        multipartFormData.append('content', this.state.dataForm.content)
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData,
            })

            const result = await response.json()
            console.log(result)
            this.setState({
                ...this.state,
                dataForm: {
                    content: '',
                },
            })
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    async clear() 
    {
       const url: string = `/chat-messages/clear`

        const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
        let csrfToken: string = '';

        if (tokenMetaTag) {
            const tokenContent = tokenMetaTag.getAttribute('content');
            csrfToken = tokenContent !== null ? tokenContent : ''
        }

        const multipartFormData = new FormData()
        multipartFormData.append('_method', 'DELETE')
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: multipartFormData,
            })

            const result = await response.json()
            console.log(result)
        } 
        catch (error) 
        {
            console.error('Error fetch', error)
        }
    }

    updateUsers(users: any)
    {
        const userMetaTag = document.querySelector('meta[name="user-id"]')
        const authId = Number(userMetaTag.getAttribute('content'))

        const filtered = users.filter((u: any) => u.id !== authId)

        this.setState({
            dataUsers: {
                total: filtered.length,
                users: filtered.slice(-3)
            }
        })
    }

    addUser(user: any)
    {
        const userMetaTag = document.querySelector('meta[name="user-id"]')
        const authId = Number(userMetaTag.getAttribute('content'))

        if (user.id === authId) return

        this.setState(prev => {

            const currentUsers = prev.dataUsers?.users || []
            const total = prev.dataUsers?.total || 0

            const users = [...currentUsers, user]

            return {
                dataUsers: {
                    total: total + 1,
                    users: users.slice(-3)
                }
            }
        })
    }

    removeUser(user: any)
    {
        this.setState(prev => {

            const currentUsers = prev.dataUsers?.users || []
            const total = prev.dataUsers?.total || 0

            const users = currentUsers.filter((u: any) => u.id !== user.id)

            return {
                dataUsers: {
                    total: Math.max(total - 1, 0),
                    users: users
                }
            }
        })
    }

    handleOnClose()
    {
        this.setState({
            isSelected: !this.state.isSelected,
        })
    }

    handleBlockToolsOnSelect(event: any)
    {
        
        const element = event.currentTarget
        const objetRect = element.getBoundingClientRect() //button
        
        const objectRectClient = this.refBlockTools.current.getBoundingClientRect()
        
        const style = {
            display: 'block',
            top: objetRect.top + 'px',
            right: (window.innerWidth - objetRect.left) + 'px',
        }
        this.setState({
            ...this.state,
            toolsStyle: style,
            toolsIsSelected: true,
        })

    }

    handleBlockToolsOnSelectOnly()
    {
        this.setState({
            ...this.state,
            toolsIsSelected: false,
        })
    }

    handleOnClear()
    {
        this.clear()
    }

    handleOnCreate(data: string)
    {
        this.setState({
            dataForm: {
                content: data,
            }
        }, () => this.create())
    }

    renderTools()
    {
        return (
            <div className={ 'block-tools' + (this.state.toolsIsSelected ? ' selected' : '') } 
                ref={ this.refBlockTools }
                onClick={ () => this.handleBlockToolsOnSelectOnly() }>
                <div className="bt-container" style={ this.state.toolsStyle }>
                    <button onClick={ () => this.handleOnClear() }>Clear</button>
                </div>
            </div>
        )
    }

    renderMessages() {
        const elements: any = [];
        // Get messages array safely
        const messages = this.state.dataMessages ? this.state.dataMessages.data : [];
        if (!messages.length)
            return (<></>)
        // Sort messages by created_at ascending (oldest first, newest last)
        const sortedMessages = messages.sort((a: any, b: any) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        let lastMessageDate: string | null = null;

        for (let index = 0; index < sortedMessages.length; index++) {
            const message = sortedMessages[index];
            const messageDate = new Date(message.created_at).toDateString();

            // Show date header only when the day changes
            const showDate = lastMessageDate !== messageDate;
            lastMessageDate = messageDate;

            elements.push(
                <Message 
                    key={message.id} 
                    data={message} 
                    showDate={showDate} 
                />
            );
        }

        return <>{elements}</>;
    }

    renderMessageEmpty() 
    {
        const messages = this.state.dataMessages?.data || [];
        if (messages.length) return null;

        return (
            <div className="message-empty">
                <div className="icon">
                    <ChatBubbleLeftIcon />
                </div>
                <div className="text">
                    <h6>No messages</h6>
                    <p>Start the conversation!</p>
                </div>
            </div>
        );
    }

    render()
    {
        const userMetaTag = document.querySelector('meta[name="user-is-admin"]');
        let userIsAdmin = userMetaTag?.getAttribute('content') === '1';

        return (
            <div className={"page-chat" + ( this.state.isSelected ? ' selected' : '') }>
                <div className="pc-top">
                    <div className="users">
                        {this.state.dataUsers?.users.map((user: any) => (
                            <div className="user" key={user.id}>
                                <img src={user.avatar_info.path} />
                            </div>
                        ))}

                        {this.state.dataUsers?.total > 3 && (
                            <div className="total">
                                +{this.state.dataUsers.total - 3}
                            </div>
                        )}
                    </div>
                    <div className="options">
                        { userIsAdmin === true && (
                            <button type="button" className="btn-more"
                                onClick={ (event) => this.handleBlockToolsOnSelect(event) }>
                                <EllipsisVerticalIcon />
                            </button>
                        )}
                        <button type="button" className="btn-close"
                            onClick={ () => this.handleOnClose() }>
                            <XMarkIcon />
                        </button>
                    </div>
                </div>
                <div className="pc-messages">
                    { this.renderMessages() }
                    { this.renderMessageEmpty() }
                </div>
                <div className="pc-input">
                    <ChatInput onSend={ (data: string) => this.handleOnCreate(data)  } />
                </div>
                { this.renderTools() }
            </div>
        )
    }
}