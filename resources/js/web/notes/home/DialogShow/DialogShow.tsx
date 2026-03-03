import React from "react"
import {
    XMarkIcon,
    CreditCardIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDribbble, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

interface DialogShowProps
{

}


interface DialogShowState
{
    isSelected: boolean
    data: any
}

export default class DialogShow extends React.Component<DialogShowProps, DialogShowState>
{
    constructor(props: DialogShowProps)
    {
        super(props)
        this.state = {
            isSelected: false,
            data: null,
        }
    }

    select(data: any = null)
    {
        const _data: any = {}
        if (data)
        {
            console.log('data', data)
            _data['title'] = data.title
            _data['content'] = data.content
            _data['keywords'] = data.keywords
            _data['links'] = data.links
        }
        
        console.log(data)

        this.setState({
            ...this.state,
            isSelected: !this.state.isSelected,
            data: data,
        })
    }

    getIcon(link: string) {
        if (link.includes('github.com')) {
            return (<FontAwesomeIcon icon={faGithub} />);
        } else if (link.includes('dribbble.com')) {
            return (<FontAwesomeIcon icon={faDribbble} />);
        } else {
            return (<FontAwesomeIcon icon={faGlobe} />);
        }
    }

    renderKeywords()
    {
        const keywords = this.state.data.keywords ? JSON.parse(this.state.data.keywords) : []

        const elements: any = []
        for (let index = 0; index < keywords.length; index++) {
            const keyword = keywords[index];
            elements.push(
                <div className="keyword">{ keyword }</div>
            )
        }

        return (
            <div className="keywords">{ elements }</div>
        )
    }

    renderLinks()
    {
        const links = this.state.data.links ? JSON.parse(this.state.data.links) : []
        
        const elements: any = []
        for (let index = 0; index < links.length; index++) {
            const link = links[index];
            elements.push(
                <a href={ link } target="_blank" className="link">
                    { this.getIcon(link) }
                </a>
            )
        }

        return (
            <div className="links">{ elements }</div>
        )
    }
    
    render()
    {
        if (!this.state.data)
            return (<></>)
        return (
            <div className={ "dialog-show" + (this.state.isSelected ? ' selected' : '') }>
                <div className="ds-top">
                    <div className="date">
                        <div className="icon">
                            <CalendarIcon />
                        </div>
                        <div className="value">2026-01-01</div>
                    </div>
                    <button type="button" className="btn-close"
                        onClick={ () => this.select() }>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="ds-main">
                    <h6 className="title">{ this.state.data.title }</h6>
                    { this.renderKeywords() }
                    <div className="content">
                        <p>{ this.state.data.content }</p>
                    </div>
                    { this.renderLinks() }
                </div>
            </div>
        )
    }
}