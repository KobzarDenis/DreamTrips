import {
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
  BelongsTo, HasMany
} from "sequelize-typescript";
import { UserModel } from "./user.model";
import {WebinarModel} from "@core/models/webinar.model";

@DefaultScope({
  attributes: ["id", "userId", "isApplied", "isManual", "createdAt", "part"],
  include: [
    {
      model: () => UserModel
    }
  ]
})
@Table({
  timestamps: false,
  paranoid: false,
  freezeTableName: true,
  tableName: "meetingRequests",
  schema: "clients"
})
export class MeetingRequestModel extends Model<MeetingRequestModel> {
  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  public userId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  })
  public isApplied: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  })
  public isManual: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  public createdAt: Date;

  @Column({
    type: DataType.ENUM(["noon", "evening"]),
    allowNull: false
  })
  public part: string;

  @Column({
    type: DataType.ENUM(["travel", "business", "both"]),
    allowNull: false
  })
  public type: string;

  @BelongsTo(() => UserModel)
  public user: UserModel;

  @HasMany(() => WebinarModel)
  public webinars: WebinarModel[];

}
