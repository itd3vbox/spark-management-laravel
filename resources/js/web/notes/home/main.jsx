import React from 'react';
import { createRoot } from 'react-dom/client';
import Notes from './Notes'

import './sass/main.sass'

const root = createRoot(document.getElementById('notes'));
root.render(<Notes />);
