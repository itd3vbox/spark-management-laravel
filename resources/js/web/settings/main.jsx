import React from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './Settings'

import './sass/main.sass'

const root = createRoot(document.getElementById('settings'));
root.render(<Settings />);
