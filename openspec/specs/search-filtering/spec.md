# Search and Filtering

## Purpose

The system SHALL provide comprehensive search and filtering capabilities to help users discover student profiles efficiently.

## Requirements

### Requirement: Text Search
Users MUST be able to search student profiles using text queries across multiple fields.

#### Scenario: Basic text search
- **WHEN** a user enters text in the search field
- **THEN** results are filtered to show profiles containing the search term
- **AND** search covers name, student ID, hometown, school, and hobbies
- **AND** search is case-insensitive

#### Scenario: Search with debouncing
- **WHEN** a user types quickly in the search field
- **THEN** search requests are delayed by 500ms to prevent excessive API calls
- **AND** only the final search term triggers the query

### Requirement: Advanced Filtering
Users MUST be able to filter results by specific criteria beyond text search.

#### Scenario: Course filtering
- **WHEN** a user selects a course/specialty
- **THEN** only students in that course are displayed
- **AND** hierarchical filtering shows department and specialty levels

#### Scenario: Year filtering
- **WHEN** a user selects an academic year
- **THEN** only students in that year are displayed
- **AND** options include B1, B2, B3, B4

#### Scenario: Circle filtering
- **WHEN** a user enters a circle name
- **THEN** only students in that circle are displayed
- **AND** partial matching is supported

### Requirement: Search Suggestions
The system MUST provide helpful search suggestions to improve user experience.

#### Scenario: Recent searches
- **WHEN** a user focuses the search field
- **THEN** recently used search terms are displayed
- **AND** clicking a suggestion populates the search field
- **AND** recent searches are stored locally per device

#### Scenario: Popular searches
- **WHEN** no recent searches exist
- **THEN** predefined popular search terms are shown
- **AND** popular terms include common courses, years, and activities

### Requirement: URL-Based Search State
Search and filter parameters MUST be preserved in URLs for sharing and bookmarking.

#### Scenario: URL parameter persistence
- **WHEN** a user applies search and filters
- **THEN** parameters are added to the URL
- **AND** refreshing the page maintains the same search state
- **AND** URLs can be shared to show the same results

#### Scenario: Page reset on search
- **WHEN** search criteria change
- **THEN** pagination resets to page 1
- **AND** users see the most relevant results first

### Requirement: Search Results Display
Search results MUST be displayed clearly with relevant information.

#### Scenario: Result pagination
- **WHEN** search returns many results
- **THEN** results are paginated with 50 items per page
- **AND** page navigation controls are provided
- **AND** current page and total pages are displayed

#### Scenario: No results handling
- **WHEN** search returns no results
- **THEN** a clear message indicates no matches found
- **AND** suggestions for refining the search are provided

### Requirement: Combined Search and Filtering
Users MUST be able to use search and filters simultaneously.

#### Scenario: Multi-criteria search
- **WHEN** a user enters text search AND applies filters
- **THEN** results match ALL criteria (AND logic)
- **AND** filters narrow down the text search results