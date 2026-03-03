import React from 'react';
import { createRoot } from 'react-dom/client';
import Page from './Page'

import './sass/main.sass'

const element = document.getElementById('page-react')
const menuItem = element ? element.getAttribute('data-menu-item') : '';
const auth = element ? element.getAttribute('data-auth') : null
const root = createRoot(element);
root.render(<Page menuItem={ menuItem } auth={ JSON.parse(auth) } />);
