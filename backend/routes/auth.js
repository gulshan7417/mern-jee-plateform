const router = require('express').Router();
const passport = require('passport');

// Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    console.log('User authenticated:', req.user); 
    
    // Redirect to frontend dashboard
    res.redirect('http://localhost:3000/dashboard/student');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    // Redirect to home after successful logout
    res.redirect('/');
  });
});

// Get current user (check if user is authenticated)
router.get('/current_user', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user); 
  } else {
    res.send(null);
  }
});

module.exports = router;
