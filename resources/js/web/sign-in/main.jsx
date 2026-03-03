import React from 'react';
import { createRoot } from 'react-dom/client';
import SignIn from './SignIn'

import './sass/main.sass'

const root = createRoot(document.getElementById('sign-in'));
root.render(<SignIn />);
