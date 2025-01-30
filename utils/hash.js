import bcrypt from 'bcrypt';

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

const FUNCTIONS = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
};

export default FUNCTIONS