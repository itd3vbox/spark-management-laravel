import React from 'react';
import { createRoot } from 'react-dom/client';
import Automatization from './Automatization'

import './sass/main.sass'

const root = createRoot(document.getElementById('automates'));
root.render(<Automatization />);
