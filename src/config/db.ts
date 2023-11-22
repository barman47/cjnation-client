import { connect, Mongoose } from 'mongoose';

let conn: Mongoose;

export const connectDB = async () => {
    try {
        const MONGO_URI = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/cjnation-test' : process.env.MONGO_URI!;
        conn = await connect(MONGO_URI, {
            autoCreate: true,
            autoIndex: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        await conn.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};