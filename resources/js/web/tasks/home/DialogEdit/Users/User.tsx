import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';


interface UserProps
{
    data: any
    isSelected: boolean
    onSelect: (data: any) => void
}


interface UserState
{
    isSelected: boolean
}

export default class User extends React.Component<UserProps, UserState>
{

    constructor(props: UserProps)
    {
        super(props)
        this.state = {
            isSelected: false,
        }
    }

    componentDidMount(): void {
        this.setState({
            isSelected: this.props.isSelected,
        })
    }
    
    componentDidUpdate(prevProps: Readonly<UserProps>, prevState: Readonly<UserState>, snapshot?: any): void {
        if (this.props.isSelected != prevProps.isSelected)
        {
            this.setState({
                isSelected: this.props.isSelected,
            })
        }
    }

    handleOnSelect()
    {
        this.setState({
            isSelected: !this.state.isSelected
        }, () => this.props.onSelect( this.state.isSelected ? this.props.data : null ))
    }

    render()
    {
        return (
            <div className="user">
                <div className="icon">
                    <img src={ this.props.data.avatar_info.path } alt="" />
                </div>
                <div className="name">{ this.props.data.name }</div>
                <button type="button" className={ "btn-select" + (this.state.isSelected ? ' selected' : '' )}
                    onClick={ () => this.handleOnSelect() }>
                    <CheckIcon />
                </button>
            </div>
        )
    }
}