import React from "react";
import { KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface InputPasswordProps {
    onChange: (password: string) => void;
    value?: string
    hasIcon: boolean
}

interface InputPasswordState {
    password: string;
    isVisible: boolean;
}

export default class InputPassword extends React.Component<InputPasswordProps, InputPasswordState> {
    constructor(props: InputPasswordProps) {
        super(props);
        this.state = {
            password: '',
            isVisible: false,
        };
    }

     componentDidMount(): void {
        this.setState({
            password: this.props.value ? this.props.value : '',
        })
    }

    componentDidUpdate(prevProps: Readonly<InputPasswordProps>, prevState: Readonly<InputPasswordState>, snapshot?: any): void {
        if (prevProps.value != this.props.value)
        {
            this.setState({
                password: this.props.value ? this.props.value : '',
            })
        }
    }

    handleInputOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ password: event.target.value }, () =>
            this.props.onChange(this.state.password)
        );
    }

    handleOnVisible(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        this.setState({ isVisible: !this.state.isVisible });
    }

    render() {
        const { isVisible } = this.state;
        return (
            <div className="form-input-password">
                <input
                    type={isVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={(event) => this.handleInputOnChange(event)}
                />
                { this.props.hasIcon === true && (
                    <div className="icon">
                        <KeyIcon />
                    </div>
                )}
                <button
                    type="button"
                    className="btn-visible"
                    onClick={(event) => this.handleOnVisible(event)}
                    title={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                    {isVisible ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
            </div>
        );
    }
}
