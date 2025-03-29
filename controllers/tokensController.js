const jwt = require('jsonwebtoken');
const pool = require("../config/db");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

async function createTokens(userId) {
    const shortLived = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const longLived = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    const now = new Date();
    const shortExpiry = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    const longExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    try {
        await pool.query('BEGIN');

        // Optional: Clear existing long tokens for the user
        await pool.query('DELETE FROM tokens WHERE user_id = $1 AND type = $2', [userId, 'long']);

        await pool.query(
            `INSERT INTO tokens (user_id, token, type, expires_at)
       VALUES ($1, $2, 'short', $3), ($1, $4, 'long', $5)`,
            [userId, shortLived, shortExpiry, longLived, longExpiry]
        );

        await pool.query('COMMIT');
        return { shortLived, longLived };
    } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
    }
}

async function refreshToken(oldRefreshToken) {
    try {
        const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;

        const result = await pool.query(
            'SELECT * FROM tokens WHERE token = $1 AND type = $2 AND expires_at > NOW()',
            [oldRefreshToken, 'long']
        );

        if (result.rows.length === 0) {
            throw new Error('Invalid or expired refresh token');
        }

        // Invalidate old refresh token
        await pool.query('DELETE FROM tokens WHERE token = $1', [oldRefreshToken]);

        // Generate new tokens
        return await createTokens(userId);
    } catch (err) {
        throw new Error('Token refresh failed: ' + err.message);
    }
}


module.exports = { createTokens, refreshToken };