// Verifica si el usuario puede ver la historia
const checkStoryPermissions = async (req, res, next) => {
    try {
      const story = await Story.findById(req.params.id).lean();
      
      if (!story) {
        return res.render('error/404');
      }
  
      if (story.status === 'public') {
        return next();
      }
  
      if (req.user && story.user._id.toString() === req.user.id) {
        return next();
      }
  
      res.redirect('/stories');
    } catch (err) {
      console.error(err);
      res.render('error/500');
    }
  };
  
  module.exports = { ensureAuth, checkStoryPermissions };