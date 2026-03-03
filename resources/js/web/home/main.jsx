import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './Home'

import './sass/main.sass'

const root = createRoot(document.getElementById('home'));
root.render(<Home />);
