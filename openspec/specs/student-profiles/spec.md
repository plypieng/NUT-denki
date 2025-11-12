# Student Profiles

## Purpose

The system SHALL allow students to create, view, update, and manage their personal profiles with comprehensive information.

## Requirements

### Requirement: Profile Creation
Students MUST be able to create detailed profiles with personal and academic information.

#### Scenario: New student profile creation
- **WHEN** an authenticated student accesses the profile creation page
- **THEN** they can fill out a comprehensive form with personal details
- **AND** required fields include name, student ID, birthdate, hometown, and academic info
- **AND** optional fields include hobbies, social media links, and personality traits
- **AND** upon submission, the profile is saved and becomes visible to others

#### Scenario: Profile ownership validation
- **WHEN** a student creates a profile
- **THEN** their email is associated as the profile owner
- **AND** they can only edit their own profile (unless admin)

### Requirement: Profile Viewing
All authenticated users MUST be able to view student profiles in a readable format.

#### Scenario: Profile detail view
- **WHEN** a user clicks on a student card
- **THEN** they see the full profile with all information
- **AND** layout is organized with sections for personal, academic, and social info
- **AND** images are displayed prominently

#### Scenario: Profile listing
- **WHEN** users browse the student directory
- **THEN** they see cards with key information (name, course, year)
- **AND** cards are paginated for performance

### Requirement: Profile Editing
Profile owners and administrators MUST be able to update profile information.

#### Scenario: Owner profile edit
- **WHEN** a student views their own profile
- **THEN** they see an edit button
- **AND** can modify all fields except student ID
- **AND** changes are saved and reflected immediately

#### Scenario: Admin profile edit
- **WHEN** an administrator views any profile
- **THEN** they can edit all fields including student ID
- **AND** have access to additional administrative fields

### Requirement: Profile Data Validation
The system MUST validate profile data according to business rules.

#### Scenario: Student ID format validation
- **WHEN** creating or editing a profile
- **THEN** student ID must follow university format rules
- **AND** prevents duplicate student IDs
- **AND** shows clear error messages for invalid formats

#### Scenario: Required field validation
- **WHEN** submitting profile data
- **THEN** all required fields must be present
- **AND** form prevents submission with missing data
- **AND** highlights missing fields with error indicators

### Requirement: Profile Image Management
Students MUST be able to upload and manage profile images.

#### Scenario: Image upload
- **WHEN** editing a profile
- **THEN** users can upload images via Cloudinary integration
- **AND** images are optimized and stored securely
- **AND** previous images are replaced

#### Scenario: Image display
- **WHEN** viewing profiles
- **THEN** images are displayed in appropriate sizes
- **AND** fallback to default avatar when no image exists