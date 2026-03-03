import React, { Component } from "react";
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

interface TypesProps 
{
    onUpdate?: (data:  string | null) => void;
    data?: any;
}

interface TypesState {
    data: string[]
    inputValue: string
}

export default class Types extends Component<TypesProps, TypesState> {

    constructor(props: TypesProps) {
        super(props)

        let data: string[] = [];
        if (this.props.data === null || this.props.data === 'undefined' || this.props.data === '')
            data = ['Painter', 'Sculptor']
        else if (typeof this.props.data === 'string')
            data = JSON.parse(this.props.data)
        else if (this.props.data) {
            data = this.props.data.length === 0 ? ['Painter', 'Sculptor'] : this.props.data;
        }
                
        this.state = {
            data: data,
            inputValue: ''
        }
    }

    componentDidUpdate(prevProps: Readonly<TypesProps>, prevState: Readonly<TypesState>, snapshot?: any): void {
        // Check if the `data` prop has changed
        if (prevProps.data !== this.props.data) 
        {
            let newData: string[] = [];
            // Handle different cases for `this.props.data`
            if (!this.props.data || this.props.data === 'undefined' || this.props.data === '') {
                newData = ['Painter', 'Sculptor'];
            } else if (typeof this.props.data === 'string') {
                newData = JSON.parse(this.props.data);
            } else if (Array.isArray(this.props.data)) {
                newData = this.props.data.length === 0 ? ['Painter', 'Sculptor'] : this.props.data;
            }
            // Update state only if `newData` is different from current `data`
            if (JSON.stringify(newData) !== JSON.stringify(this.state.data)) {
                this.setState({
                    data: newData,
                });
            }
        }
    }
    
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        this.setState({
            ...this.state,
            inputValue: event.target.value 
        })
    }

    handleDeleteType(index: number) 
    {
        const newData = [...this.state.data]
        newData.splice(index, 1)
        this.setState({ data: newData }, () => {
            if (this.props.onUpdate)
            {
                const data = JSON.stringify(this.state.data)
                this.props.onUpdate(data)
            }
        })
    }

    handleAddType = () => {
        const { inputValue, data } = this.state
        if (inputValue.trim() !== '') {
            const newData = [...data, inputValue.trim()]
            this.setState({ data: newData, inputValue: '' }, () => {
                if (this.props.onUpdate)
                {
                    const data = JSON.stringify(this.state.data)
                    this.props.onUpdate(data)
                }
            })
        }
    }

    handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && this.state.inputValue.trim() !== '') {
            this.handleAddType();
        }
    };

    renderTypes() {
        return this.state.data.map((type, index) => (
            <div className="type" key={index}>
                <div className="value">{type}</div>
                <button
                    type="button"
                    className="button-icon"
                    onClick={() => this.handleDeleteType(index)}
                >
                    <XMarkIcon />
                </button>
            </div>
        ))
    }

    render() {
        return (
            <div className="form-types">
                <div className="input-icon">
                    <input
                        type="text"
                        name="type"
                        value={this.state.inputValue}
                        onChange={(event) => this.handleInputChange(event)}
                        onKeyPress={(event) => this.handleKeyPress(event)} 
                        placeholder="Add a type..."
                    />
                    <div className="icon">
                        <UserIcon />
                    </div>
                </div>
                <div className="list">
                    {this.renderTypes()}
                </div>
            </div>
        )
    }
}
