import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    CheckIcon,
    RectangleStackIcon,
} from '@heroicons/react/24/outline';


interface ChoicesUniqueRadioProps
{
    choices: any;
    choice: any
    onUpdate?: (choice: any) => void;
}


interface ChoicesUniqueRadioState
{
    choices: any[];
    choice: any;
}

export default class ChoicesUniqueRadio extends React.Component<ChoicesUniqueRadioProps, ChoicesUniqueRadioState>
{

    constructor(props: ChoicesUniqueRadioProps)
    {
        super(props)
        this.state = {
            choices: this.props.choices || [],
            choice: this.props.choice || null,
        }
    }

    componentDidMount(): void {
        this.setState({
            choices: this.props.choices || [],
            choice:  this.props.choice || null,
        }) 
    }

    componentDidUpdate(prevProps: Readonly<ChoicesUniqueRadioProps>, prevState: Readonly<ChoicesUniqueRadioState>, snapshot?: any): void {
        if (prevProps.choice !== this.props.choice)
        {
            this.setState({
                choice:  this.props.choice || null,
            }) 
        }  
    }

    getIcon(isSelected: boolean)
    {
        if (isSelected)
            return (<CheckIcon />)
        return (<RectangleStackIcon />)
    }

    handleOnSelect(choice: any) {
        if (this.state.choice === choice)
            choice = null;
        this.setState({
            ...this.state,
            choice: choice
        }, () => {
            if (this.props.onUpdate)
                this.props.onUpdate(this.state.choice);
        });
    }

    renderChoices() {
        const elements: any[] = [];
        for (let index = 0; index < this.state.choices.length; index++) {
            const choice = this.state.choices[index];
            elements.push(
                <div className={"choice" + (this.state.choice === choice ? ' selected' : '')}
                    onClick={() => this.handleOnSelect(choice)} key={index}>
                    <button type="button">
                        { this.getIcon(this.state.choice === choice) }
                    </button>
                    <div className="value">{ choice }</div>
                </div>
            );
        }
        return elements;
    }

    render()
    {
        return (
            <div className="form-choices-unique-radio">
                {this.renderChoices()}
            </div>
        )
    }
}