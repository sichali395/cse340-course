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