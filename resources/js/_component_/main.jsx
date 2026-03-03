import React from 'react';
import { createRoot } from 'react-dom/client';
import ComponentClass from './ComponentClass'


const root = createRoot(document.getElementById('component-class'));
root.render(<ComponentClass />);
