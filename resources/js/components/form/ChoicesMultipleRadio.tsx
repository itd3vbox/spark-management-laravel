import React from "react"
import {
    CheckIcon,
    RectangleStackIcon,
} from '@heroicons/react/24/outline';

interface ChoicesMultipleRadioProps {
    choices: string[];
    selectedChoices: string | null;   // JSON string ou null
    onUpdate?: (selectedChoices: string | null) => void;
    maxChoices?: number;
}

interface ChoicesMultipleRadioState {
    choices: string[];
    selectedChoices: string[]; // interne en array
}

export default class ChoicesMultipleRadio extends React.Component<
    ChoicesMultipleRadioProps,
    ChoicesMultipleRadioState
> {

    constructor(props: ChoicesMultipleRadioProps) {
        super(props);

        this.state = {
            choices: props.choices || [],
            selectedChoices: this.parseSelectedChoices(props.selectedChoices),
        };
    }

    // 🔐 Sécurise le JSON.parse
    parseSelectedChoices(value: string | null): string[] {
        if (!value) return [];

        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    componentDidUpdate(prevProps: ChoicesMultipleRadioProps) {

        if (prevProps.choices !== this.props.choices) {
            this.setState({ choices: this.props.choices || [] });
        }

        if (prevProps.selectedChoices !== this.props.selectedChoices) {
            this.setState({
                selectedChoices: this.parseSelectedChoices(this.props.selectedChoices)
            });
        }
    }

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
            // désélection
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

    getIcon(isSelected: boolean) {
        if (isSelected)
            return <CheckIcon />;
        return <RectangleStackIcon />;
    }

    renderChoices() {

        return this.state.choices.map((choice, index) => {

            const isSelected = this.state.selectedChoices.includes(choice);

            return (
                <div
                    key={index}
                    className={"choice" + (isSelected ? " selected" : "")}
                    onClick={() => this.handleOnSelect(choice)}
                >
                    <button type="button" className="button-icon">
                        {this.getIcon(isSelected)}
                    </button>

                    <div className="value">
                        {choice}
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="form-choices-multiple-radio">
                {this.renderChoices()}
            </div>
        )
    }
}
