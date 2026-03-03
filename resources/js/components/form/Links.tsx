import React from "react";
import {
    XMarkIcon,
    LinkIcon,
} from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faDribbble } from '@fortawesome/free-brands-svg-icons';

interface LinksProps {
    data?: any
    onUpdate?: (data: any) => void;
}

interface LinksState {
    data: string[]; // Array to store links
    link: string; // Input field for new link
}

export default class Links extends React.Component<LinksProps, LinksState> {

    constructor(props: LinksProps) {
        super(props);
        this.state = {
            data: [],
            link: '',
        };
    }

    componentDidUpdate(prevProps: Readonly<LinksProps>) {
        if (prevProps.data !== this.props.data) {

            let parsed: string[] = [];

            try {
                if (typeof this.props.data === 'string' && this.props.data.trim() !== '') {
                    const tmp = JSON.parse(this.props.data);

                    if (Array.isArray(tmp)) {
                        parsed = tmp;
                    }
                }
            } catch (e) {
                console.warn('Invalid links JSON:', this.props.data);
            }

            this.setState({ data: parsed });
        }
    }


    // Function to determine the icon based on the link domain
    getIcon(link: string) {
        if (link.includes('github.com')) {
            return (<FontAwesomeIcon icon={faGithub} />);
        } else if (link.includes('dribbble.com')) {
            return (<FontAwesomeIcon icon={faDribbble} />);
        } else {
            return (<FontAwesomeIcon icon={faGlobe} />);
        }
    }

    // Handle 'Enter' key to add the link
    handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter' && this.state.link.trim() !== "") {
            const newData = [...this.state.data, this.state.link]; // Add the new link to the data
            this.setState(
                { 
                    data: newData,
                    link: '', // Clear the input field
                },
                () => {
                    // Call onUpdate with the updated data (array of links)
                    if (this.props.onUpdate)
                        this.props.onUpdate(JSON.stringify(newData));
                }
            );
        }
    }

    // Handle input field change
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ link: event.target.value });
    }

    // Handle link deletion
    handleOnDelete(index: number) {
        const updatedData = this.state.data.filter((_, i) => i !== index); // Remove the link by index
        this.setState(
            { 
                data: updatedData 
            },
            () => {
                // Call onUpdate with the updated data
                if (this.props.onUpdate)
                    this.props.onUpdate(JSON.stringify(updatedData));
            }
        );
    }

    // Render the links with icons and delete buttons
    renderLinks() {
        return this.state.data.map((link, index) => (
            <div className="link" key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="button-icon btn-link">
                    {this.getIcon(link)}
                </a>
                <button 
                    type="button" 
                    className="button-icon btn-delete" 
                    onClick={() => this.handleOnDelete(index)}
                >
                    <XMarkIcon />
                </button>
            </div>
        ));
    }

    render() {
        return (
            <div className="form-links">
                <input
                        type="url"
                        name="link"
                        value={this.state.link}
                        onChange={(event) => this.handleInputChange(event)}
                        onKeyDown={(event) => this.handleKeyDown(event)}
                        placeholder="Ex.: https://github.com/project"
                    />
                <div className="links">
                    { this.renderLinks( )}
                </div>
            </div>
        );
    }
}
