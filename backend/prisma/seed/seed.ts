import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.vote.deleteMany();
  await prisma.voter.deleteMany();
  await prisma.team.deleteMany();

  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Equipe Alpha',
        solutionName: 'HealthNow',
        theme: 'Telemedicina',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Equipe Beta',
        solutionName: 'EduSmart',
        theme: 'Educação',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Equipe Gamma',
        solutionName: 'PayShield',
        theme: 'Fintech / Fraudes',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Equipe Delta',
        solutionName: 'SafeCity',
        theme: 'Cidades Inteligentes',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Equipe Omega',
        solutionName: 'FoodFlash',
        theme: 'Delivery',
      },
    }),
  ]);

  for (const team of teams) {
    await prisma.voter.create({
      data: {
        name: `${team.name} - Votante`,
        teamId: team.id,
      },
    });
  }

  console.log('Seed executado com sucesso!');
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });