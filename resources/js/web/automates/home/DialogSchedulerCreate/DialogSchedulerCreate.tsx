import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import MainForm from "./MainForm";
import Automates from "./Automates";



interface DialogSchedulerCreateProps
{

}


interface DialogSchedulerCreateState
{
    isSelected: boolean
    tabsMenuItemSelected: number
    projectSelected: any
    automatesSelected: any
}

export default class DialogSchedulerCreate extends React.Component<DialogSchedulerCreateProps, DialogSchedulerCreateState>
{
    refAutomates: any

    constructor(props: DialogSchedulerCreateProps)
    {
        super(props)

        this.state = {
            isSelected: false,
            tabsMenuItemSelected: 1,
            projectSelected: null,
            automatesSelected: [],
        }
        
        this.refAutomates = React.createRef()
    }

    select()
    {
        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
        })
    }

    handleTabsMenuItemOnClick(index: number)
    {
        this.setState({
            ...this.state,
            tabsMenuItemSelected: index,
        })
    }

    handleMainFormOnProjectSelect(data: any)
    {
        this.setState({
            projectSelected: data,
        })
    }

    handleMainFormOnCreate(data: any)
    {
        
    }

    handleAutomatesOnSelect(data: any)
    {
        this.setState({
            automatesSelected: data,
        })
    }

    render()
    {
        return (
            <div className={ "dialog-scheduler-create" + (this.state.isSelected ? ' selected' : '') }>
                <div className="ds-close">
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="ds-zero">
                    <img src="https://cdn.dribbble.com/users/1392449/screenshots/17662830/media/0469c6e6dc9f96a2ac4266499f9723ee.png?compress=1&resize=1600x1200&vertical=top" alt="" />
                    <div className="text">
                        <h4>Scheduler - Create</h4>
                        <p>Plan your next Automate.</p>
                    </div>
                </div>
                <div className="ds-main">
                    <div className="m-tabs-menu">
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(1) }>Overview</button>
                        <button type="button" className="tm-item"
                            onClick={ () => this.handleTabsMenuItemOnClick(2) }>Automates</button>
                    </div>
                    <div className="m-tabs-contents">
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 1 ? ' selected' : '')}>
                            <MainForm 
                                automatesSelected={ this.state.automatesSelected }
                                onProjectSelect={ (data: any) => this.handleMainFormOnProjectSelect(data) }
                                onCreate={ (data: any) => this.handleMainFormOnCreate(data) }  />
                        </div>
                        <div className={"tc-content" + (this.state.tabsMenuItemSelected === 2 ? ' selected' : '')}>
                           <Automates ref={ this.refAutomates } 
                                project={ this.state.projectSelected }
                                onAutomatesSelect={ (data: any) => this.handleAutomatesOnSelect(data) } />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}