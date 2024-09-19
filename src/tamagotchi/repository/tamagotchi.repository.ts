// import { Repository, DataSource } from 'typeorm';
// import { Tamagotchi } from '../entity/tamagotchi.entity';

// export class TamagotchiRepository extends Repository<Tamagotchi> {
//   constructor(private dataSource: DataSource) {
//     super(Tamagotchi, dataSource.manager);
//   }

//   async createTamagotchi(data: Partial<Tamagotchi>): Promise<Tamagotchi> {
//     const newTamagotchi = this.create(data);
//     await this.save(newTamagotchi);

//     // 저장된 엔티티를 다시 조회하여 반환
//     return this.findOne({
//       where: { user_id: newTamagotchi.user_id },
//     });
//   }

//   async getOneByPk(userId: number): Promise<Tamagotchi | null> {
//     return this.findOne({
//       where: { user_id: userId },
//       relations: ['experience'],
//     });
//   }

//   async updateHunger(userId: number, hunger: number): Promise<void> {
//     await this.update({ user_id: userId }, { hunger });
//   }
// }
