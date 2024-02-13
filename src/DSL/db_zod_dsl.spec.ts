import db_zod_dsl from './db_zod_dsl';

describe('DSL to Schema Conversion', () => {
    test('converts User table DSL to Mongoose and Zod schemas', () => {
        const dslString = `
CREATE TABLE User {
    username: String UNIQUE,
    email: String UNIQUE REQUIRED,
    age: Number,
    isActive: Boolean REQUIRED,
    tags: Array[String],
    createdAt: Date REQUIRED
};
`;
        const expectedMongooseSchema = `const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number },
    isActive: { type: Boolean, required: true },
    tags: { type: [String] },
    createdAt: { type: Date, required: true }
});`;

        const expectedZodSchema = `const UserZodSchema = z.object({
    username: z.string().optional(),
    email: z.string().required(),
    age: z.number().optional(),
    isActive: z.boolean().required(),
    tags: z.array(z.string()).optional(),
    createdAt: z.date().required()
});`;
        const converter = new db_zod_dsl(dslString);
        const mongooseSchema = converter.generateMongooseSchema();
        const zodSchema = converter.generateZodSchema();

        expect(mongooseSchema).toEqual(expectedMongooseSchema);
        expect(zodSchema).toEqual(expectedZodSchema);
    });
});
