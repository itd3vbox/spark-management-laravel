import React from "react";
import { KeyIcon } from '@heroicons/react/24/outline';

interface InputPasswordGeneratorProps {
    onChange: (password: string) => void;
    length?: number; // longueur du mot de passe
    value?: string
    hasIcon: boolean
}

interface InputPasswordGeneratorState {
    password: string;
}

export default class InputPasswordGenerator extends React.Component<InputPasswordGeneratorProps, InputPasswordGeneratorState> {
    constructor(props: InputPasswordGeneratorProps) {
        super(props);
        this.state = {
            password: '',
        };
    }

    componentDidMount(): void {
        this.setState({
            password: this.props.value ? this.props.value : '',
        })
    }

    componentDidUpdate(prevProps: Readonly<InputPasswordGeneratorProps>, prevState: Readonly<InputPasswordGeneratorState>, snapshot?: any): void {
        if (prevProps.value != this.props.value)
        {
            this.setState({
                password: this.props.value ? this.props.value : '',
            })
        }
    }

    // Fonction pour générer un mot de passe aléatoire
    generatePassword(length: number = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        return password;
    }

    handleGeneratePassword = () => {
        const password = this.generatePassword(this.props.length);
        this.setState({ password }, () => {
            this.props.onChange(this.state.password);
        });
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        this.setState({ password }, () => {
            this.props.onChange(this.state.password);
        });
    }

    render() {
        return (
            <div className={ `form-input-password-generator ${this.props.hasIcon === true ? 'has-icon' : ''}` }>
                <input
                    type="text"
                    value={this.state.password}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    onChange={this.handleInputChange}
                />
                { this.props.hasIcon === true && (
                    <div className="icon">
                        <KeyIcon />
                    </div>
                )}
                <button
                    type="button"
                    className="btn-generate"
                    onClick={this.handleGeneratePassword}
                    title="Générer un mot de passe"
                >
                    <KeyIcon />
                </button>
            </div>
        );
    }
}
