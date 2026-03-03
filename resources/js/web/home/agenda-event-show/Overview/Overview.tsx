import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import MessageEmpty from "./MessageEmpty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import Delete from "./Delete";
import Create from "./Create";
import Events from "./Events";


interface OverViewProps
{
    data: any
    onStore: any
}


interface OverViewState
{
    tabsMenuItemSelected: number   
}

export default class OverView extends React.Component<OverViewProps, OverViewState>
{

    constructor(props: OverViewProps)
    {
        super(props)
        this.state = {
            tabsMenuItemSelected: 1,
        }
    }

    componentDidUpdate(prevProps: Readonly<OverViewProps>, prevState: Readonly<OverViewState>, snapshot?: any): void {
        if (prevProps.data != this.props.data)
        {
            this.setState({

            })
        }
    }

    handleTabsMenuItemOnSelect(index: number)
    {
        this.setState({
            ...this.state,
            tabsMenuItemSelected: index,
        })
    }

    handleOnStore()
    {
        this.props.onStore()
    }

    render()
    {
        if (!this.props.data)
            return (<></>)
        
        console.log('Oveview', this.props.data)

        const isEmpty = !(this.props.data.time && this.props.data.time.total > 0)

        return (
            <div className="overview">
                <div className="m-tabs-menu">
                    <div className="menu">
                        <button type="button" className="tm-item"
                        onClick={ () => this.handleTabsMenuItemOnSelect(1) }>
                            <FontAwesomeIcon icon={ faInfoCircle } />
                        </button>
                    </div>
                    <div className="options">
                        <button type="button" className="button-icon"
                            onClick={ () => this.handleTabsMenuItemOnSelect(2) }>
                            <PlusIcon />
                        </button>
                    </div>
                </div>
                <div className="m-tabs-contents">
                    <div className={"tc-content" + (this.state.tabsMenuItemSelected === 1 ? ' selected' : '')}>
                        { isEmpty == true && (<MessageEmpty />) }
                        { isEmpty == false && (<Events data={ this.props.data } />) }
                    </div>
                    <div className={"tc-content" + (this.state.tabsMenuItemSelected === 2 ? ' selected' : '')}>
                        <Create data={ this.props.data } onStore={ () => this.handleOnStore() } />
                    </div>
                </div>
            </div>
        )
    }
}