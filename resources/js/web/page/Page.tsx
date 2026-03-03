import React from "react"
import { createRoot } from 'react-dom/client';
import {
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';
import PageMenu from "./PageMenu";
import PageTop from "./PageTop/PageTop";



interface PageProps
{
    auth: any
    menuItem: string
}


interface PageState
{
    
}

export default class Page extends React.Component<PageProps, PageState>
{
    refPageMenu: any 

    constructor(props: PageProps)
    {
        super(props)
        this.state = {

        }

        this.refPageMenu = React.createRef()
    }

    componentDidMount()
    {
        const pageMenuElement = document.getElementById('page-menu');
        if (pageMenuElement) {
            const rootPageMenu = createRoot(pageMenuElement);
            rootPageMenu.render(<PageMenu 
                ref={ this.refPageMenu }
                menuItemCurrent={ this.props.menuItem } />);
        }

        const pageTopElement = document.getElementById('page-top');
        if (pageTopElement) {
            const rootPageTop = createRoot(pageTopElement);
            rootPageTop.render(
                <PageTop 
                    auth={ this.props.auth }    
                    onMenuSelect={ () => this.handleOnMenuSelect() } />
            );
        }
    }

    handleOnMenuSelect()
    {
        this.refPageMenu.current.select()
    }

    render()
    {
        return (
            <></>
        )
    }
}