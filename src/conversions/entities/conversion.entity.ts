import { now,Schema, Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export interface ConvTransaction extends Document {
    sourceCurrency: string;
    targetCurrency: string;
    amount: number;
    convertedAmount: number;
    user: User;
    requestId: string; 
    createdAt: Date;
}


export const ConvTransactionSchema = new Schema({
    sourceCurrency: { type: String, required: true },
    targetCurrency: { type: String, required: true },
    amount: { type: Number, required: true },
    convertedAmount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: String, unique: true, required: true }, 
},{timestamps: true});
