const Joi = require('joi');
const User = require('../../models/auth/user');
const { generateToken } = require('../../utils/jwt');

const loginSchema = Joi.object({
  walletAddress: Joi.string().required(),
  username: Joi.string().min(3).max(50),
  email: Joi.string().email()
});

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { walletAddress, username, email } = value;

    // Check if user exists
    let user = await User.findByWalletAddress(walletAddress);

    if (!user) {
      // Create new user
      const userId = await User.create(walletAddress, username, email);
      user = await User.findById(userId);
    } else if (username && username !== user.username) {
      // Update username if provided and different
      await User.updateProfile(user.id, { username });
      user.username = username;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      walletAddress: user.wallet_address
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        username: user.username,
        email: user.email,
        totalXP: user.total_xp,
        currentLevel: user.current_level
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        username: user.username,
        email: user.email,
        totalXP: user.total_xp,
        currentLevel: user.current_level,
        isActive: user.is_active
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;

    await User.updateProfile(req.user.id, updates);

    const updatedUser = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        walletAddress: updatedUser.wallet_address,
        username: updatedUser.username,
        email: updatedUser.email,
        totalXP: updatedUser.total_xp,
        currentLevel: updatedUser.current_level
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile
};