import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import Overview from "./Overview";
import Logs from "./Logs";


interface DialogSchedulerShowProps
{
    
}


interface DialogSchedulerShowState
{
    isSelected: boolean
    tabsMenuItemSelected: number
    isNeedSearch: boolean
}

export default class DialogSchedulerShow extends React.Component<DialogSchedulerShowProps, DialogSchedulerShowState>
{

    constructor(props: DialogSchedulerShowProps)
    {
        super(props)

        this.state = {
            isSelected: false,
            tabsMenuItemSelected: 1,
            isNeedSearch: false,
        }
    }

    select()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
            isNeedSearch: !this.state.isSelected,
        })
    }

    handleTabsMenuItemOnClick(index: number)
    {
        this.setState({
            ...this.state,
            tabsMenuItemSelected: index,
        })
    }

    render()
    {
        return (
            <div className={ "dialog-scheduler-show" + (this.state.isSelected ? ' selected' : '') }>
                <div className="ds-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="ds-zero">
                    <img src="https://cdn.dribbble.com/users/1392449/screenshots/17662830/media/0469c6e6dc9f96a2ac4266499f9723ee.png?compress=1&resize=1600x1200&vertical=top" alt="" />
                    <div className="text">
                        <h4>Scheduler - Show</h4>
                        <p>Here are your scheduled automations.</p>
                    </div>
                </div>
                <div className="ds-main">
                    <div className="m-tabs-menu">
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(1) }>Overview</button>
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(2) }>Logs</button>
                    </div>
                    <div className="m-tabs-contents">
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 1 ? ' selected' : '')}>
                            <Overview
                                isNeedSearch={ this.state.isNeedSearch } />
                        </div>
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 2 ? ' selected' : '')}>
                            <Logs />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}