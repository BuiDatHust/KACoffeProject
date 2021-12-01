
const getAdminPage = async (req,res) =>{
    res.render('admin', { user: req.user });
}


module.exports = {
    getAdminPage 
}