import React from "react";
import {
    XMarkIcon,
    KeyIcon,
} from '@heroicons/react/24/outline';
import { parse } from "@fortawesome/fontawesome-svg-core";

interface KeywordsProps {
    data: string | null;
    onUpdate: (data: string) => void;
}

interface KeywordsState {
    data: string[];
    input: string;
}

export default class Keywords extends React.Component<KeywordsProps, KeywordsState> {
    constructor(props: KeywordsProps) {
        super(props);
        this.state = {
            data: [],
            input: ''
        };
    }

    componentDidMount(): void {
        this.syncDataFromProps();
    }

    componentDidUpdate(prevProps: Readonly<KeywordsProps>): void {
        if (prevProps.data !== this.props.data) {
            this.syncDataFromProps();
        }
    }

    syncDataFromProps() {
        let parsed: any = []
        if (Array.isArray(this.props.data))
            parsed = this.props.data
        else if (this.props.data)
            parsed = JSON.parse(this.props.data)
        this.setState({ data: Array.isArray(parsed) ? parsed : [] });
    }

    handleOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.state.input.trim();
            if (value && !this.state.data.includes(value)) {
                const updated = [...this.state.data, value];
                this.setState({ data: updated, input: '' }, () => {
                    this.props.onUpdate(JSON.stringify(this.state.data));
                });
            }
        }
    };

    handleOnDelete = (index: number) => {
        const updated = this.state.data.filter((_, i) => i !== index);
        this.setState({ data: updated }, () => {
            this.props.onUpdate(JSON.stringify(this.state.data));
        });
    };

    renderKeywords() {
        return this.state.data.map((keyword, index) => (
            <div className="keyword" key={index}>
                <div className="value">{keyword}</div>
                <button type="button" className="button-icon" onClick={() => this.handleOnDelete(index)}>
                    <XMarkIcon />
                </button>
            </div>
        ));
    }

    render() {
        return (
            <div className="form-keywords">
                <input
                        type="text"
                        value={this.state.input}
                        onChange={(e) => this.setState({ input: e.target.value })}
                        onKeyDown={this.handleOnEnter}
                        placeholder="Ex. E-Commerce"
                    />
                <div className="list">
                    {this.renderKeywords()}
                </div>
            </div>
        );
    }
}
