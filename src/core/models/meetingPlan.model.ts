import {
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
  BelongsTo
} from "sequelize-typescript";
import { UserModel } from "./user.model";

@DefaultScope({
  attributes: ["id", "userId", "isApplied", "date", "part"],
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
  tableName: "meetingPlans",
  schema: "users"
})
export class MeetingPlanModel extends Model<MeetingPlanModel> {
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
    type: DataType.DATE,
    allowNull: false
  })
  public date: Date;

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

}
