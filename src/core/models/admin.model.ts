import {
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  HasMany,
  Model,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import * as sequelize from "sequelize";

@DefaultScope({
  attributes: ["id", "email", "phoneNumber", "firstName", "lastName", "botId", "uuid"]
})
@Table({
  timestamps: true,
  paranoid: false,
  freezeTableName: true,
  tableName: "admins",
  schema: "admin"
})
export class AdminModel extends Model<AdminModel> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true
  })
  public email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true
  })
  public phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public password: string;

  @Column
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public firstName: string;

  @Column
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  public botId: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    defaultValue: sequelize.fn('uuid_generate_v4'),
  })
  public uuid: string;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;

}
