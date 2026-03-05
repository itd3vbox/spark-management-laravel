import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheckCircle, faCog, faDiceD6, faMessage, faNoteSticky, faRightFromBracket, faRobot, faUserGroup } from "@fortawesome/free-solid-svg-icons";

const VITE_APP_NAME = import.meta.env.VITE_APP_NAME;

interface PageMenuProps
{
    menuItemCurrent: string
    onChatSelect: () => void
}


interface PageMenuState
{
    isSelected: boolean
    automatesIsSelected: boolean
}

export default class PageMenu extends React.Component<PageMenuProps, PageMenuState>
{
    private pageMenu: HTMLElement | null = null;

    constructor(props: PageMenuProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            automatesIsSelected: false,
        }
    }

    select()
    {
        this.setState({
            isSelected: !this.state.isSelected,
        })
    }

    isCurrent = (key: string) => {
        return this.props.menuItemCurrent === key ? "current" : "";
    };

    handleSubMenuAutomatizationOnSelect()
    {
        this.setState({
            automatesIsSelected: !this.state.automatesIsSelected,
        })
    }

    handleOnChat()
    {
        this.props.onChatSelect()
    }

    render() {
        return (
            <div className={ `pg-wrapper ${this.state.isSelected ? ' selected' : ''}` }>
                <div className="content-close">
                    <button className="btn" type="button"
                        onClick={ () => this.select() }>
                       <XMarkIcon />
                    </button>
                </div>

                <div className="content-top">
                    <a className="btn" href="/sign-out">
                        <FontAwesomeIcon icon={ faRightFromBracket } />
                    </a>
                    <button type="button" className="btn"
                        onClick={ () => this.handleOnChat() }>
                        <FontAwesomeIcon icon={ faMessage } />
                    </button>
                </div>

                <div className="content-main">

                    <a href="/"
                         className={`home-item i-home ${this.isCurrent(
                                "i-home"
                            )}`}>
                        <span className="icon">
                            <img src="/images/logo.png" alt="" />
                        </span>
                        <span className="name">{ VITE_APP_NAME }</span>
                    </a>

                    <div className="menu">

                        <a href="/projects" 
                            className={`menu-item i-projects ${this.isCurrent(
                                "i-projects"
                            )}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={ faDiceD6 } />
                            </span>
                            <span className="name">Projects</span>
                        </a>

                        <a href="/tasks" 
                            className={`menu-item i-tasks ${this.isCurrent(
                                "i-tasks"
                            )}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={ faCheckCircle } />
                            </span>
                            <span className="name">Tasks</span>
                        </a>

                        <div className={ `menu-sub ${this.state.automatesIsSelected ? ' selected' : ''}` }>

                            <div className={ `menu-sub-item` }>
                                <a href="/automates"
                                    className={`menu-item i-automates ${this.isCurrent(
                                        "i-automates"
                                    )}`}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={ faRobot } />
                                    </span>
                                    <span className="name">Automates</span>
                                </a>

                                <button className="btn" type="button"
                                    onClick={ () => this.handleSubMenuAutomatizationOnSelect() }>
                                   <FontAwesomeIcon icon={ faAngleDown } />
                                </button>
                            </div>

                            <div className="menu-sub-menu">
                                <a href="/automates/notifications"
                                    className={`menu-item i-notifications ${this.isCurrent(
                                        "i-notifications"
                                    )}`}>
                                    &bull; Notifications
                                </a>
                            </div>
                        </div>

                        <a href="/notes"
                            className={`menu-item i-notes ${this.isCurrent(
                                "i-notes"
                            )}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={ faNoteSticky } />
                            </span>
                            <span className="name">Notes</span>
                        </a>

                        <a href="/users"
                            className={`menu-item i-users ${this.isCurrent(
                                "i-users"
                            )}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={ faUserGroup } />
                            </span>
                            <span className="name">Users</span>
                        </a>

                        <a href="/settings"
                            className={`menu-item i-settings ${this.isCurrent(
                                "i-settings"
                            )}`}>
                            <span className="icon">
                                <FontAwesomeIcon icon={ faCog } />
                            </span>
                            <span className="name">Settings</span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}