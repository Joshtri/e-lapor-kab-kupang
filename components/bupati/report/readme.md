# Report Component Structure

This folder contains components for handling reports in the Bupati section of the e-lapor-kab-kupang application.

## Main Components

### ReportList.jsx
The top-level component that integrates all report-related functionality. It:
- Imports and organizes all sub-components
- Manages the main report listing view
- Handles state for filtering and pagination
- Coordinates data fetching and updates

### Sub-Components

- **ReportDetail.jsx**: Displays comprehensive information about a selected report
- **ReportFilter.jsx**: Provides filtering capabilities for the report list
- **ReportCard.jsx**: Individual report preview card used in the list view
- **ReportStatus.jsx**: Displays and potentially manages report status changes
- **ReportPagination.jsx**: Handles pagination for the report list

## Data Flow

Reports data is typically fetched from an API and passed down to child components. State management is centralized in ReportList.jsx for consistency across the report module.

## Usage

These components are designed to work together within the Bupati dashboard section of the application to provide a complete report management interface.