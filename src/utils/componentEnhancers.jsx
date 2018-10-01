import React from 'react';
import GenericErrorBoundary from '../components/genericErrorBoundary';

const wrapSectionComponentsWithErrorBoundaries = (sections = []) => (
  sections.map(section => ({
    ...section,
    rows: section.rows.map(row => row.map((component, index) => (
      <GenericErrorBoundary key={index}>{component}</GenericErrorBoundary>
    ))),
  }))
);

export default wrapSectionComponentsWithErrorBoundaries;
