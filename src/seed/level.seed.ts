import { DataSource } from 'typeorm';
import { Level } from 'src/tamagotchi/entity/level.entity';

export class LevelSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const levelRepository = dataSource.getRepository(Level);

    const levels = [{ level: 1 }, { level: 2 }, { level: 3 }];

    for (const levelData of levels) {
      const existingLevel = await levelRepository.findOneBy({
        level: levelData.level,
      });
      if (!existingLevel) {
        const newLevel = levelRepository.create(levelData);
        await levelRepository.save(newLevel);
      }
    }
  }
}
