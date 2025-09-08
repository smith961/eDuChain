const { pool } = require('../../config/database');

class User {
  static async findByWalletAddress(walletAddress) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE wallet_address = ?',
      [walletAddress]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(walletAddress, username = null, email = null) {
    const [result] = await pool.execute(
      'INSERT INTO users (wallet_address, username, email) VALUES (?, ?, ?)',
      [walletAddress, username, email]
    );
    return result.insertId;
  }

  static async updateProfile(id, updates) {
    const fields = [];
    const values = [];

    if (updates.username) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.email) {
      fields.push('email = ?');
      values.push(updates.email);
    }

    if (fields.length === 0) return;

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  }

  static async updateXP(id, xpAmount) {
    const [result] = await pool.execute(
      'UPDATE users SET total_xp = total_xp + ?, current_level = FLOOR(total_xp / 1000) + 1 WHERE id = ?',
      [xpAmount, id]
    );
    return result;
  }
}

module.exports = User;