import { File } from "@models/file.model";
import { GlobalRole } from "@models/permissions/globalRole.model";
import { Advertiser } from "@models/user/advertiser.model";
import { Charity } from "@models/user/charity.model";
import { Consumer } from "@models/user/consumer.model";
import { Referral } from "@models/referral.model";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  DeletedAt,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Scopes,
  Table,
  UpdatedAt
} from "sequelize-typescript";

@DefaultScope({
  include: [{
    model: () => File
  }],
  attributes: ["id", "email", "phoneNumber", "firstName", "lastName", "isSuspended", "avatarId", "createdAt"]
})
@Scopes({
  auth: {
    attributes: ["id", "email", "phoneNumber", "password"]
  }
})
@Table({
  timestamps: true,
  paranoid: true,
  freezeTableName: true,
  tableName: "users",
  schema: "users"
})
export class User extends Model<User> {
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

  @Column
  public password: string;

  @Column
  public firstName: string;

  @Column
  public lastName: string;

  @ForeignKey(() => GlobalRole)
  @Column({
    allowNull: false
  })
  public roleId: number;

  @ForeignKey(() => File)
  @Column
  public avatarId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  public isSuspended: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  public registrationCity: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  public registrationState: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  public registrationZip: string;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;

  @DeletedAt
  public deletedAt: Date;

  @BelongsTo(() => GlobalRole)
  public role: GlobalRole;

  @HasOne(() => Consumer)
  public consumer: Consumer;

  @HasOne(() => Advertiser)
  public advertiser: Advertiser;

  @BelongsTo(() => File)
  public avatar: File;

  @HasOne(() => Charity)
  public charity: Charity;

  @HasMany(() => Referral, "referrerId")
  public referrals: Referral[];

  @HasOne(() => Referral, "referralId")
  public referrer: Referral;

}
