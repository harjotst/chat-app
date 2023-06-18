const express = require('express');
const User = require('../models/User');
const multer = require('multer');
const config = require('../config/config');

const s3 = require('../config/s3');

const upload = multer({ dest: 'uploads' });

const router = express.Router();

// done & tested
router.post(
  '/update-profile-picture',
  upload.single('profilePicture'),
  async (req, res) => {
    const fileExtension = req.file.originalname.split('.').pop();

    const key = `users/${req.session.user.id}/${uuidv4()}.${fileExtension}`;

    const fileStream = fs.createReadStream(req.file.path);

    const params = {
      Bucket: config.AWS_PUBLIC_BUCKET,
      Key: key,
      Body: fileStream,
      ACL: 'public-read',
    };

    s3.upload(params, function (err, data) {
      fs.unlinkSync(req.file.path);

      if (err) {
        console.log('Error', err);

        return res.status(500).send(err);
      }

      if (data) {
        User.findByIdAndUpdate(
          req.session.user.id,
          { profilePicture: data.Location },
          { new: true },
          function (err, result) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    });
  }
);

module.exports = router;
