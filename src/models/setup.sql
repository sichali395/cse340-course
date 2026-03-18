-- Create Organizations table
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organizations (name, description, contact_email, logo_filename) VALUES
    ('BrightFuture Builders', 
     'Building brighter futures through community construction projects and housing initiatives.', 
     'info@brightfuture.org', 
     'brightfuture-logo.png'),
    
    ('GreenHarvest Growers', 
     'Promoting sustainable agriculture and community gardening through volunteer programs.', 
     'contact@greenharvest.org', 
     'greenharvest-logo.png'),
    
    ('UnityServe Volunteers', 
     'Bringing communities together through coordinated volunteer efforts and service projects.', 
     'hello@unityserve.org', 
     'unityserve-logo.png');

     -- Create Projects table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE
);

-- Insert sample projects (at least 5 for each organization)
-- For BrightFuture Builders (organization_id = 1)
INSERT INTO projects (organization_id, title, description, location, date) VALUES
    (1, 'Community Garden Construction', 'Build raised garden beds and a community gathering space for local residents.', '123 Main St, Phoenix, AZ', '2024-04-15'),
    (1, 'Youth Center Renovation', 'Paint and renovate the local youth center including new furniture.', '456 Oak Ave, Phoenix, AZ', '2024-05-20'),
    (1, 'Affordable Housing Build', 'Help construct 5 new affordable homes for low-income families.', '789 Pine Rd, Phoenix, AZ', '2024-06-10'),
    (1, 'Senior Center Improvement', 'Install new handrails and accessibility features at the senior center.', '321 Elm St, Phoenix, AZ', '2024-07-08'),
    (1, 'Park Bench Installation', 'Build and install 20 new benches in city parks.', '555 Park Dr, Phoenix, AZ', '2024-08-12'),

-- For GreenHarvest Growers (organization_id = 2)
    (2, 'Urban Farm Workshop', 'Teach community members how to start urban gardens.', '100 Green Way, Portland, OR', '2024-04-22'),
    (2, 'School Garden Program', 'Create vegetable gardens at 3 elementary schools.', '200 School Ln, Portland, OR', '2024-05-05'),
    (2, 'Farmers Market Setup', 'Help organize and set up the weekly farmers market.', '300 Market St, Portland, OR', '2024-06-03'),
    (2, 'Composting Initiative', 'Build community composting stations around the city.', '400 Compost Rd, Portland, OR', '2024-07-15'),
    (2, 'Tree Planting Day', 'Plant 100 native trees in city parks.', '500 Forest Ave, Portland, OR', '2024-08-20'),

-- For UnityServe Volunteers (organization_id = 3)
    (3, 'Food Bank Sorting', 'Sort and organize donations at the regional food bank.', '600 Food Dr, Denver, CO', '2024-04-18'),
    (3, 'Homeless Shelter Meal Service', 'Prepare and serve dinner at the homeless shelter.', '700 Shelter Blvd, Denver, CO', '2024-05-25'),
    (3, 'Backpack Supply Drive', 'Fill backpacks with school supplies for underprivileged children.', '800 Supply Ave, Denver, CO', '2024-06-12'),
    (3, 'Community Clean-up', 'Clean up trash and debris in city parks and streets.', '900 Clean St, Denver, CO', '2024-07-09'),
    (3, 'Blood Drive Coordination', 'Organize and staff a community blood donation event.', '1000 Health Rd, Denver, CO', '2024-08-14');