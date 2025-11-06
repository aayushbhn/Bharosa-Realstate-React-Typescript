import { AppDataSource } from './data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { Agency } from '../entities/Agency';
import { AgentProfile } from '../entities/AgentProfile';
import { Property } from '../entities/Property';

async function run() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const agencyRepo = AppDataSource.getRepository(Agency);
  const agentRepo = AppDataSource.getRepository(AgentProfile);
  const propRepo = AppDataSource.getRepository(Property);

  const mkUser = async (email: string, role: any, name: string) => {
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) return existing;
    const u = userRepo.create({ email, role, name, passwordHash: await bcrypt.hash('password123', 10) });
    return userRepo.save(u);
  };

  const superAdmin = await mkUser('super@bharosa.app', 'super_admin', 'Super Admin');
  const agencyAdmin = await mkUser('admin@bharosa.app', 'agency_admin', 'Agency Admin');
  const agentUser = await mkUser('agent@bharosa.app', 'agent', 'Alice Agent');
  const customer = await mkUser('cust@bharosa.app', 'customer', 'Bob Buyer');

  const agency = await agencyRepo.save(agencyRepo.create({ name: 'Bharosa Realty' }));
  const agent = await agentRepo.save(agentRepo.create({ user: agentUser, agency, languages: ['en','hi'], specializations: ['rentals','luxury'] }));

  const sample = [
    {
      title: 'Sunny Apartment in Lazimpat',
      description: '2BHK, near schools and cafes', status: 'rent', type: 'apartment', beds: 2, baths: 2, areaSqft: 900, price: 35000,
      city: 'Kathmandu', area: 'Lazimpat', lat: 27.730000, lon: 85.323960, imageUrls: [], agent
    },
    {
      title: 'Family Home in Jawalakhel',
      description: '4 bed independent house with parking', status: 'sale', type: 'house', beds: 4, baths: 3, areaSqft: 2400, price: 32000000,
      city: 'Lalitpur', area: 'Jawalakhel', lat: 27.671000, lon: 85.307000, imageUrls: [], agent
    }
  ];

  for (const s of sample) await propRepo.save(propRepo.create(s as any));

  console.log('Seeded users, agency, agent, properties');
  process.exit(0);
}

run();