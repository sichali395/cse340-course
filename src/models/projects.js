// src/models/projects.js
import db from './db.js';

const getAllProjects = async () => {
  const query = `
    SELECT 
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.date,
      o.name as organization_name
    FROM public.projects p
    JOIN public.organizations o ON p.organization_id = o.organization_id
    ORDER BY p.date ASC;
  `;

  const result = await db.query(query);
  return result.rows;
};

export { getAllProjects };