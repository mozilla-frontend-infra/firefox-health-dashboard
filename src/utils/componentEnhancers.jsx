import React from 'react';
import GenericErrorBoundary from '../components/genericErrorBoundary';

const wrapSectionComponentsWithErrorBoundaries = (sections = []) =>
  sections.map(section => ({
    ...section,
    rows: section.rows.map(component => (
      <GenericErrorBoundary key={component.id}>
        {component}
      </GenericErrorBoundary>
    )),
  }));

export default wrapSectionComponentsWithErrorBoundaries;
