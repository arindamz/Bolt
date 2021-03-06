import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryColumn({ type: 'bigint' })
  public guild!: string;

  // eslint-disable-next-line prettier/prettier
  @Column({ 'type': 'jsonb', 'default': (): string => "'{}'" })
  public settings: any;
}
