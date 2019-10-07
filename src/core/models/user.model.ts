import {
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  HasMany,
  Model,
  Table,
  UpdatedAt, HasOne
} from "sequelize-typescript";
import {UserStateModel} from "./userState.model"
import {MeetingRequestModel} from "./meetingRequest.model"
import * as sequelize from "sequelize";

@DefaultScope({
  attributes: ["id", "email", "phoneNumber", "firstName", "lastName", "botSource", "botId", "uuid"]
})
@Table({
  timestamps: true,
  paranoid: false,
  freezeTableName: true,
  tableName: "users",
  schema: "clients"
})
export class UserModel extends Model<UserModel> {
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
    type: DataType.ENUM(["telegram", "facebook", "viber", "watsapp"]),
    allowNull: true
  })
  public botSource: string;

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

  @HasMany(() => MeetingRequestModel)
  public meetingRequests: MeetingRequestModel[]

  @HasOne(() => UserStateModel)
  public state: UserStateModel

}
