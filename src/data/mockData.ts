import { Organization } from '../types'

// Single region to start — more regions added later
// Structure mirrors exact Spring Boot API contract
export const MOCK_ORG: Organization = {
  id: 'org-acme',
  name: 'Acme Corp',
  regions: [
    {
      id: 'us-east-1',
      name: 'US East (N. Virginia)',
      code: 'us-east-1',
      position: [0, 0, 0],
      metrics: {
        totalCost: 45230,
        resourceCount: 234,
        riskScore: 0.20,
        growthRate: 0.15,
      },
      vpcs: [
        {
          id: 'vpc-001',
          name: 'Production VPC',
          cidr: '10.0.0.0/16',
          cost: 28000,
          availabilityZones: [
            {
              id: 'use1-az1', name: 'us-east-1a', cost: 12000,
              services: [
                { id: 'svc-001', type: 'compute',  name: 'EC2 Cluster', cost: 8000 },
                { id: 'svc-002', type: 'database', name: 'RDS Primary', cost: 4000 },
              ],
            },
            {
              id: 'use1-az2', name: 'us-east-1b', cost: 10000,
              services: [
                { id: 'svc-003', type: 'compute', name: 'EKS Nodes',  cost: 6000 },
                { id: 'svc-004', type: 'storage', name: 'S3 Buckets', cost: 4000 },
              ],
            },
            {
              id: 'use1-az3', name: 'us-east-1c', cost: 6000,
              services: [
                { id: 'svc-005', type: 'network',  name: 'Load Balancers', cost: 3000 },
                { id: 'svc-006', type: 'database', name: 'ElastiCache',    cost: 3000 },
              ],
            },
          ],
        },
        {
          id: 'vpc-002',
          name: 'Development VPC',
          cidr: '10.1.0.0/16',
          cost: 17230,
          availabilityZones: [
            {
              id: 'use1-dev-az1', name: 'us-east-1a', cost: 17230,
              services: [
                { id: 'svc-007', type: 'compute', name: 'Dev Servers', cost: 17230 },
              ],
            },
          ],
        },
      ],
    },
  ],
}
