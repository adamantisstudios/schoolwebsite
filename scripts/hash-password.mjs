# Password hashing note
# Seed uses: crypt('Password123!', gen_salt('bf', 10)) via pgcrypto
# App verifies with bcryptjs — compatible with $2a$ / $2b$ blowfish hashes.

import bcrypt from "bcryptjs"

const password = process.argv[2] || "Password123!"
const hash = bcrypt.hashSync(password, 10)
console.log(hash)
console.log("Verify:", bcrypt.compareSync(password, hash))
