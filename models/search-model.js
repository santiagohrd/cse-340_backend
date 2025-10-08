const pool = require("../database")

async function searchInventory(searchTerm) {
    try {
        const sql = "SELECT * FROM public.inventory WHERE inv_make ILIKE $1 or inv_model ILIKE $1"
        const data = await pool.query(
            sql,
            [`%${searchTerm}%`]
        )
        return data.rows
    } catch (error) {
        return error.message
    }
}

module.exports = { searchInventory }