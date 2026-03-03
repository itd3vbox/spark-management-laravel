import React from "react"
import {
    BellAlertIcon,
} from '@heroicons/react/24/outline';
import SearchBarList from "./SearchBarList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCog, faMagnifyingGlass, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface PageTopProps 
{
    auth: any
    onMenuSelect: () => void
}

interface PageTopState {
    data: any
    dataSearch: any
}

export default class PageTop extends React.Component<PageTopProps, PageTopState>
{
    private refUserMenu: any
    private refBtnUser: any

    constructor(props: PageTopProps)
    {
        super(props)

        this.state = {
            data: {
                keywords: '',
            },
            dataSearch: null,
        }

        this.refUserMenu = React.createRef();
        this.refBtnUser = React.createRef();
    }

    handleUserClick = () => {

        const btnUser = this.refBtnUser.current;
        const userMenu = this.refUserMenu.current;

        if (!btnUser || !userMenu) return;

        const rect = btnUser.getBoundingClientRect();

        userMenu.style.display = "block";

        const wrapper = userMenu.querySelector(
            ".wrapper"
        ) as HTMLDivElement | null;

        if (!wrapper) return;

        wrapper.style.position = "absolute";
        wrapper.style.top = `${rect.bottom + 10}px`;
        wrapper.style.left = `${rect.right - wrapper.offsetWidth - 10}px`;
    };

    hideUserMenu = () => {
        const userMenu = this.refUserMenu.current;
        if (!userMenu) return;

        userMenu.style.display = "none";
    };

    handleMenuButton = () => {
        this.props.onMenuSelect()
    };

    search = async (url = `/search/search`): Promise<void> => {

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    is_asc: false,
                    max: 4,
                    keywords: this.state.data.keywords,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            console.log('data ...', data.data);

            this.setState({
                dataSearch: data.data,
            })

        } catch (error: any) {
            console.error('Search error:', error);
        }
    };

    handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    {
        let data = this.state.data
        data[event.target.name] = event.target.value 
        this.setState({
            ...this.state,
            data: data,
        })
    }

    handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') 
        {
            this.search();
        }
    }

    handleOnSearch()
    {
        this.search();
    }

    handleOnPrev()
    {
        this.search(this.state.dataSearch.prev_page_url)
    }

    handleOnNext()
    {
        this.search(this.state.dataSearch.next_page_url)
    }
    

    render() {

        // Tableau d'exemples en français
        const placeholdersFR = [
            "Automate: Doc Generation",
            "Note: Alpha & Omega",
            "Project: Omega",
            "Task: Delete All & Rebuild",
        ];

        // Fonction pour récupérer un placeholder aléatoire
        const getPlaceholder = () => {
            const randomIndex = Math.floor(Math.random() * placeholdersFR.length);
            return placeholdersFR[randomIndex];
        };

        return (
            <>
                <div className="icon">
                    <FontAwesomeIcon icon={ faMagnifyingGlass } />
                </div>

                <input 
                    type="text"
                    name="keywords"
                    placeholder={`Ex.: ${getPlaceholder()}`}
                    onKeyDown={this.handleOnKeyDown}
                    defaultValue={this.state.data.keywords}
                    onChange={this.handleInputOnChange} 
                />

                <a href="/automates/notifications" className="btn-alert">
                    <BellAlertIcon />
                    <div className="indicator"></div>
                </a>

                <button
                    type="button"
                    className="btn-user"
                    ref={this.refBtnUser}
                    onClick={this.handleUserClick}
                >
                    <img
                        src="/images/avatar.png"
                        className="avatar"
                        alt="User avatar"
                    />
                </button>

                <button
                    type="button"
                    id="page-menu-button"
                    onClick={this.handleMenuButton}
                >
                    <FontAwesomeIcon icon={ faBars } />
                </button>

                <div
                    className="user"
                    id="user-menu"
                    ref={this.refUserMenu}
                    style={{ display: "none" }}
                    onClick={this.hideUserMenu}
                >
                    <div className="wrapper">
                        <div className="username">#{ this.props.auth.username }</div>

                        <div className="options">
                            <a href="/sign-out" className="btn-sign-out">
                                <FontAwesomeIcon icon={ faRightFromBracket } />
                            </a>

                            <a href="/settings" className="btn-settings">
                                <FontAwesomeIcon icon={ faCog } />
                            </a>
                        </div>
                    </div>
                </div>

                <SearchBarList type={1}
                    data={ this.state.dataSearch }
                    onPrev={ () => this.handleOnPrev() }
                    onNext={ () => this.handleOnNext() } />
            </>
        )
    }
}
