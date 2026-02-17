import { Organization } from '../types'

// Single region to start — more regions added later
// Structure mirrors exact Spring Boot API contract
export const MOCK_ORG: Organization = {
  id: 'org-acme',
  name: 'Acme Corp',
  regions: [],
}
