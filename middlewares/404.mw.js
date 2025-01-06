module.exports = (req,res,next) => {
    res.json({
        success:false,
        message : 'Page Not Found',
    })
}