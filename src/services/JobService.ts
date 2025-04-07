import { JobPost } from '../types';

// Mock job data
export const MOCK_JOBS: JobPost[] = [
  {
    id: '1',
    title: 'Kitchen Plumbing Repair',
    description: 'Need an experienced plumber to fix a leaking sink and replace faulty faucet in the kitchen. Must have own tools and be available this weekend.',
    budget: {
      amount: 5000,
      currency: 'KES',
    },
    location: {
      address: 'Westlands, Nairobi',
      latitude: -1.2641,
      longitude: 36.8035,
    },
    category: 'Plumbing',
    clientId: '1',
    status: 'open',
    createdAt: new Date('2025-04-05'),
    requiredSkills: ['Plumbing', 'Home Repair'],
    isRemote: false,
  },
  {
    id: '2',
    title: 'House Painting Project',
    description: 'Looking for a professional painter to paint the interior of a 3-bedroom house. Need color consultation and high-quality finish. Paint will be provided.',
    budget: {
      amount: 35000,
      currency: 'KES',
    },
    location: {
      address: 'Kilimani, Nairobi',
      latitude: -1.2873,
      longitude: 36.7822,
    },
    category: 'Painting',
    clientId: '2',
    status: 'open',
    createdAt: new Date('2025-04-06'),
    requiredSkills: ['Painting', 'Interior Design', 'Color Mixing'],
    isRemote: false,
  },
  {
    id: '3',
    title: 'Electrical Wiring Installation',
    description: 'Need an electrician to install new wiring and outlets in home office. Must be certified and experienced with modern electrical systems.',
    budget: {
      amount: 15000,
      currency: 'KES',
    },
    location: {
      address: 'Lavington, Nairobi',
      latitude: -1.2783,
      longitude: 36.7712,
    },
    category: 'Electrical',
    clientId: '3',
    status: 'open',
    createdAt: new Date('2025-04-07'),
    requiredSkills: ['Electrical', 'Wiring', 'Circuit Installation'],
    isRemote: false,
  },
  {
    id: '4',
    title: 'Garden Landscaping',
    description: 'Seeking professional gardener for complete backyard landscaping project. Includes planting, pathway creation, and irrigation system setup.',
    budget: {
      amount: 45000,
      currency: 'KES',
    },
    location: {
      address: 'Karen, Nairobi',
      latitude: -1.3187,
      longitude: 36.7062,
    },
    category: 'Gardening',
    clientId: '4',
    status: 'open',
    createdAt: new Date('2025-04-07'),
    requiredSkills: ['Landscaping', 'Gardening', 'Irrigation'],
    isRemote: false,
  },
  {
    id: '5',
    title: 'Bathroom Renovation',
    description: 'Complete bathroom renovation needed. Work includes tiling, plumbing, and fixture installation. Looking for experienced contractor with portfolio.',
    budget: {
      amount: 120000,
      currency: 'KES',
    },
    location: {
      address: 'Kileleshwa, Nairobi',
      latitude: -1.2841,
      longitude: 36.7776,
    },
    category: 'Home Improvement',
    clientId: '5',
    status: 'open',
    createdAt: new Date('2025-04-06'),
    requiredSkills: ['Plumbing', 'Tiling', 'Renovation'],
    isRemote: false,
  },
  {
    id: '6',
    title: 'Website Development',
    description: 'Looking for a skilled web developer to create a responsive e-commerce website with payment integration and custom CMS.',
    budget: {
      amount: 75000,
      currency: 'KES',
    },
    location: {
      address: 'Remote',
      latitude: 0,
      longitude: 0,
    },
    category: 'Programming',
    clientId: '2',
    status: 'open',
    createdAt: new Date('2025-04-07'),
    requiredSkills: ['Web Development', 'JavaScript', 'React', 'UI/UX'],
    isRemote: true,
  },
  {
    id: '7',
    title: 'Mobile App Design',
    description: 'Need a UI/UX designer to create wireframes and high-fidelity designs for a fitness tracking mobile app.',
    budget: {
      amount: 50000,
      currency: 'KES',
    },
    location: {
      address: 'Remote',
      latitude: 0,
      longitude: 0,
    },
    category: 'Design',
    clientId: '3',
    status: 'open',
    createdAt: new Date('2025-04-06'),
    requiredSkills: ['UI Design', 'UX Design', 'App Design', 'Figma'],
    isRemote: true,
  },
  {
    id: '8',
    title: 'Data Analysis Project',
    description: 'Looking for a data analyst to help process and visualize customer data and create meaningful insights for business decisions.',
    budget: {
      amount: 40000,
      currency: 'KES',
    },
    location: {
      address: 'Remote',
      latitude: 0,
      longitude: 0,
    },
    category: 'Data Analysis',
    clientId: '4',
    status: 'open',
    createdAt: new Date('2025-04-05'),
    requiredSkills: ['Excel', 'Python', 'Data Visualization', 'Statistics'],
    isRemote: true,
  }
];

class JobService {
  private jobs: JobPost[] = MOCK_JOBS;

  getAllJobs(): JobPost[] {
    return this.jobs;
  }

  getJobById(id: string): JobPost | undefined {
    return this.jobs.find(job => job.id === id);
  }

  searchJobs(query: string): JobPost[] {
    const searchTerm = query.toLowerCase();
    return this.jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.category.toLowerCase().includes(searchTerm) ||
      job.location.address.toLowerCase().includes(searchTerm) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }

  filterJobs(filters: {
    category?: string;
    minBudget?: number;
    maxBudget?: number;
    skills?: string[];
  }): JobPost[] {
    return this.jobs.filter(job => {
      if (filters.category && job.category !== filters.category) {
        return false;
      }
      if (filters.minBudget && job.budget.amount < filters.minBudget) {
        return false;
      }
      if (filters.maxBudget && job.budget.amount > filters.maxBudget) {
        return false;
      }
      if (filters.skills && filters.skills.length > 0) {
        return filters.skills.some(skill => 
          job.requiredSkills.includes(skill)
        );
      }
      return true;
    });
  }
}

export const jobService = new JobService();