import React from 'react';
import { createRoot } from 'react-dom/client';
import Notifications from './Notifications'

import './sass/main.sass'

const root = createRoot(document.getElementById('notifications'));
root.render(<Notifications />);
