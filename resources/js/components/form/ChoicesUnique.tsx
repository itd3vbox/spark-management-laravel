import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';


interface ChoicesUniqueProps
{
    data: any
    onUpdate?: (data: any) => void
}


interface ChoicesUniqueState
{
    choices: any[]
    choice: any
}

export default class ChoicesUnique extends React.Component<any, ChoicesUniqueState>
{
    constructor(props: any)
    {
        super(props)
        this.state = {
            choices: this.props.data.choices,
            choice: null,
        }
    }

    handleOnSelect(choice: any)
    {
        if (this.state.choice === choice)
            choice = null
        this.setState({
            ...this.state,
            choice: choice
        }, () => {
            if (this.props.onUpdate)
                this.props.onUpdate(this.state.choice)
        })
    }

    renderChoices()
    {
        const elements: any[] = []
        for (let index = 0; index < this.state.choices.length; index++) 
        {
            const choice = this.state.choices[index]
            elements.push(
                <div className={ "choice" + ( this.state.choice === choice ? ' selected' : '' ) } 
                    onClick={ () => this.handleOnSelect(choice) } key={ index }>
                    { choice }
                </div>
            )
        }
        return elements
    }

    render()
    {
        return (
            <div className="form-choices-unique">
                { this.renderChoices() }
            </div>
        )
    }
}