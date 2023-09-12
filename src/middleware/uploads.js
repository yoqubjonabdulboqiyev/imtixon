const path = require('path');
const { v4: uuid } = require('uuid');


const upload = async (req, res, next) => {
    try {
        const file = req.files?.file;
        if (file) {
            const fileName = uuid() + path.extname(file.name);
            file.mv(process.cwd() + '/uploads/' + fileName)
            req.file = fileName;
        }
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = upload;