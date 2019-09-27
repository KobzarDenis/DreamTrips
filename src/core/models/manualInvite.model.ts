import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo
} from "sequelize-typescript";
import { UserModel } from "./user.model";

@Table({
    timestamps: false,
    paranoid: false,
    freezeTableName: true,
    tableName: "manualInvites",
    schema: "users"
})
export class ManualInviteModel extends Model<ManualInviteModel> {
    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    public userId: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    public date: Date;

    @BelongsTo(() => UserModel)
    public user: UserModel;

}
