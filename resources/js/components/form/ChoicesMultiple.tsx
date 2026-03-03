import React from "react";
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ChoicesMultipleProps {
    choices: string[];
    selectedChoices: string | null; // JSON string ou null
    onUpdate?: (selectedChoices: string | null) => void;
    maxChoices?: number;
}

interface ChoicesMultipleState {
    choices: string[];
    selectedChoices: string[]; // interne en tableau
    newChoice: string;
}

export default class ChoicesMultiple extends React.Component<
    ChoicesMultipleProps,
    ChoicesMultipleState
> {

    constructor(props: ChoicesMultipleProps) {
        super(props);

        this.state = {
            choices: props.choices || [],
            selectedChoices: this.parseSelectedChoices(props.selectedChoices),
            newChoice: "",
        };
    }

    // ✅ Sécurise le JSON.parse
    parseSelectedChoices(value: string | null): string[] {
        if (!value) return [];

        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    componentDidUpdate(prevProps: ChoicesMultipleProps) {

        if (prevProps.choices !== this.props.choices) {
            this.setState({ choices: this.props.choices || [] });
        }

        if (prevProps.selectedChoices !== this.props.selectedChoices) {
            this.setState({
                selectedChoices: this.parseSelectedChoices(this.props.selectedChoices)
            });
        }
    }

    // 🔁 Envoie string | null au parent
    notifyUpdate(updatedChoices: string[]) {
        if (!this.props.onUpdate) return;

        const result =
            updatedChoices.length > 0
                ? JSON.stringify(updatedChoices)
                : null;

        this.props.onUpdate(result);
    }

    handleOnSelect(choice: string) {

        const { selectedChoices } = this.state;
        const { maxChoices } = this.props;

        let updatedChoices: string[];

        if (selectedChoices.includes(choice)) {
            updatedChoices = selectedChoices.filter(item => item !== choice);
        } else {

            if (maxChoices && selectedChoices.length >= maxChoices) {
                return;
            }

            updatedChoices = [...selectedChoices, choice];
        }

        this.setState(
            { selectedChoices: updatedChoices },
            () => this.notifyUpdate(updatedChoices)
        );
    }

    handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        const { maxChoices } = this.props;

        if (event.key === 'Enter' && this.state.newChoice.trim() !== "") {

            const newChoice = this.state.newChoice.trim();

            if (
                !this.state.choices.includes(newChoice) &&
                !this.state.selectedChoices.includes(newChoice)
            ) {

                if (maxChoices && this.state.selectedChoices.length >= maxChoices) {
                    return;
                }

                const updatedChoices = [...this.state.selectedChoices, newChoice];

                this.setState(
                    {
                        selectedChoices: updatedChoices,
                        newChoice: "",
                    },
                    () => this.notifyUpdate(updatedChoices)
                );
            }
        }
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newChoice: event.target.value });
    };

    renderChoices() {

        const allChoices = Array.from(
            new Set([...this.state.choices, ...this.state.selectedChoices])
        );

        return allChoices.map((choice, index) => (
            <div
                key={index}
                className={
                    "choice" +
                    (this.state.selectedChoices.includes(choice) ? " selected" : "")
                }
                onClick={() => this.handleOnSelect(choice)}
            >
                {choice}
            </div>
        ));
    }

    render() {
        return (
            <div className="form-choices-multiple">
                <input
                    type="text"
                    name="choice"
                    value={this.state.newChoice}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder="Ajoutez une nouvelle option, puis appuyez sur Enter"
                />

                <div className="choices">
                    {this.renderChoices()}
                </div>
            </div>
        );
    }
}
