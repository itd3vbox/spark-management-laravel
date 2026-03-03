import React from 'react';
import { createRoot } from 'react-dom/client';
import Projects from './Projects'

import './sass/main.sass'

const root = createRoot(document.getElementById('projects'));
root.render(<Projects />);
