# MySQL JSON Column Fixes Summary

## Problem
MySQL doesn't allow DEFAULT values for JSON, TEXT, BLOB, or GEOMETRY columns.

## Fixed Columns

### posts table
- ❌ `hashtags JSON DEFAULT '[]'` → ✅ `hashtags JSON`
- ❌ `mentions JSON DEFAULT '[]'` → ✅ `mentions JSON`
- ❌ `metadata JSON DEFAULT '{}'` → ✅ `metadata JSON`

### user_analytics table
- ❌ `follower_growth JSON DEFAULT '[]'` → ✅ `follower_growth JSON`

### users table (from previous)
- ❌ `interests JSON DEFAULT '[]'` → ✅ `interests JSON`
- ❌ `preferences JSON DEFAULT '{...}'` → ✅ `preferences JSON`

## Why This Works
- When a row is inserted without specifying a JSON column, it defaults to NULL
- Application code can handle NULL → empty array conversion
- This is the proper MySQL way to handle JSON columns

## Application Level Handling

In your Node.js code, you can handle NULL → default conversion:

```javascript
// Example in controller
const user = await User.findByPk(userId);

// Convert NULL to empty array
user.interests = user.interests || [];
user.preferences = user.preferences || {
    emailNotifications: true,
    pushNotifications: true,
    privateMessages: 'all',
    showOnlineStatus: true,
    allowMessages: true
};
```

Or in Sequelize Model:

```javascript
const User = sequelize.define('User', {
    interests: {
        type: DataTypes.JSON,
        defaultValue: () => []  // Sequelize-level default
    },
    preferences: {
        type: DataTypes.JSON,
        defaultValue: () => ({
            emailNotifications: true,
            pushNotifications: true,
            privateMessages: 'all',
            showOnlineStatus: true,
            allowMessages: true
        })
    }
});
```

## Files to Copy & Paste

Use the corrected SQL from:
- `all_tables_fixed.sql` - All tables at once
- Or copy individual CREATE TABLE statements as needed

All are now MySQL 8.0 compliant! ✅
