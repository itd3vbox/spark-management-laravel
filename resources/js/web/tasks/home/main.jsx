import React from 'react';
import { createRoot } from 'react-dom/client';
import Tasks from './Tasks'

import './sass/main.sass'

const root = createRoot(document.getElementById('tasks'));
root.render(<Tasks />);
