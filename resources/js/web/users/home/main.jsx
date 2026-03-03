import React from 'react';
import { createRoot } from 'react-dom/client';
import Users from './Users'

import './sass/main.sass'


const element = document.getElementById('users')
const isAdminAttr = element ? element.getAttribute('data-is-admin') : 'false';
const auth = element ? element.getAttribute('data-auth') : null
const isAdmin = isAdminAttr === '1' || isAdminAttr === 'true';

const root = createRoot(element);
root.render(<Users isAdmin={ isAdmin } auth={ JSON.parse(auth) } />);
