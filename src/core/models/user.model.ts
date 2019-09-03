import {
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import * as sequelize from "sequelize";

@DefaultScope({
  attributes: ["id", "email", "phoneNumber", "firstName", "lastName", "botSource", "botId", "uuid"]
})
@Table({
  timestamps: true,
  paranoid: false,
  freezeTableName: true,
  tableName: "users",
  schema: "users"
})
export class UserModel extends Model<UserModel> {
  @Column({
    unique: true,
    allowNull: true
  })
  public email: string;

  @Column({
    unique: true,
    allowNull: true
  })
  public phoneNumber: string;

  @Column({
    allowNull: true
  })
  public password: string;

  @Column
  @Column({
    allowNull: true
  })
  public firstName: string;

  @Column
  @Column({
    allowNull: true
  })
  public lastName: string;

  @Column({
    type: DataType.ENUM(["telegram", "facebook", "viber", "watsapp"]),
    allowNull: true
  })
  public botSource: string;

  @Column({
    type: DataType.ENUM(["unknown", "agree", "uncertainty", "block", "discard"]),
    allowNull: true,
    defaultValue: "unknown"
  })
  public mood: string;

  @Column({
    type: DataType.ENUM(["ua", "ru"]),
    allowNull: true
  })
  public lang: string;

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
