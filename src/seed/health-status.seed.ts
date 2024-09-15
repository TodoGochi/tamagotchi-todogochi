import { DataSource } from 'typeorm';
import { HealthStatus } from 'src/tamagotchi/entity/health-status.entity';

export class HealthStatusSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const healthStatusRepository = dataSource.getRepository(HealthStatus);

    const healthStatuses = [
      { health_status: 'healthy' },
      { health_status: 'sick' },
      { health_status: 'dead' },
    ];

    for (const healthData of healthStatuses) {
      const existingStatus = await healthStatusRepository.findOneBy({
        health_status: healthData.health_status,
      });
      if (!existingStatus) {
        const newStatus = healthStatusRepository.create(healthData);
        await healthStatusRepository.save(newStatus);
      }
    }
  }
}
