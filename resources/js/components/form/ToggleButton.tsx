import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';


interface ButtonToggleProps
{
    isOn?: boolean
    onToggle?: (isOn: boolean) => {}
}


interface ButtonToggleState
{
    isOn: boolean
}

export default class ButtonToggle extends React.Component<any, ButtonToggleState>
{

    constructor(props: any)
    {
        super(props)
        this.state = {
            isOn: this.props.isOn ? this.props.isOn : false
        }
    }

    componentDidUpdate(prevProps: ButtonToggleProps) {
        if (prevProps.isOn !== this.props.isOn) {
            this.setState({ isOn: this.props.isOn });
        }
    }

    handleOnToggle(event:  React.MouseEvent<HTMLDivElement|HTMLButtonElement, MouseEvent>)
    {
        this.setState({
            ...this.state,
            isOn: !this.state.isOn,
        }, () => {
            if (this.props.onToggle)
                this.props.onToggle(this.state.isOn)
        })  
    }

    render()
    {
        return (
            <div className={"button-toggle" + ( this.state.isOn ? ' on' : ' off') }
                onClick={ (event) => this.handleOnToggle(event) }>
                <input type="hidden" name="data" value={ "" + this.state.isOn } />
                <button type="button" className="ball"
                    onClick={ (event) => this.handleOnToggle(event) }></button>
            </div>
        )
    }
}