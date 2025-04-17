const bcrypt = require("bcryptjs");
const pool = require('../config/db');
const { v4: uuidv4 } = require("uuid");

const createUser = async (req, res) =>{
    const {email, password, name} = req.body;

    if(!email) res.status(400).json({message: "email is required"});
    if(!password) res.status(400).json({message: "password is required"});
    if(!name) res.status(400).json({message: "name is required"});

    try{
        //if user already exist
        const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if(userCheck.rows.length > 0) return res.status(401).json({message: "Account already exists"});

        //hashPassword
        const hashedPassword = await bcrypt.hash(password, 10);
        //generating uuid
        const userId = uuidv4();

        //inserting new user in DB
        const newUser = await pool.query(
            "INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4) RETURNING *", [userId, email, hashedPassword, name]
        );
        const {password: _, ...userWithoutPassoword} = newUser.rows[0];
        res.status(201).json({message: "Account is successfully created!!", user: userWithoutPassoword});

    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {createUser};