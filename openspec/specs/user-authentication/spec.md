# User Authentication

## Purpose

The system SHALL provide secure authentication for university students using Google OAuth with domain restrictions.

## Requirements

### Requirement: Google OAuth Login
Users MUST authenticate using Google OAuth 2.0 with restricted access to university email domain.

#### Scenario: Successful university student login
- **WHEN** a user with @stn.nagaokaut.ac.jp email clicks sign in
- **THEN** they are redirected to Google OAuth
- **AND** upon successful authentication, they are logged into the application
- **AND** their session is maintained across page reloads

#### Scenario: Non-university email rejection
- **WHEN** a user with non-university email attempts to sign in
- **THEN** authentication fails
- **AND** an error message is displayed
- **AND** access is denied

### Requirement: Session Management
The system MUST maintain user sessions securely with automatic expiration.

#### Scenario: Session persistence
- **WHEN** an authenticated user refreshes the page
- **THEN** their login state is preserved
- **AND** they remain logged in

#### Scenario: Session expiration
- **WHEN** a user's session expires
- **THEN** they are automatically logged out
- **AND** redirected to sign-in page on next action

### Requirement: Admin Role Detection
The system MUST identify administrative users based on email configuration.

#### Scenario: Admin user recognition
- **WHEN** a user with admin email logs in
- **THEN** they are granted administrative privileges
- **AND** admin features become available

#### Scenario: Regular user access
- **WHEN** a regular student logs in
- **THEN** they have access to standard features
- **AND** admin features are hidden