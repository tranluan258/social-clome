const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const accountModel = require("../models/accounts");
const postModel = require("../models/posts");
const commentsModel = require("../models/comments");
const fs = require("fs");
const uuid = require("short-uuid");
const validator = require("youtube-validator");
const validatorLogin =  require("../middleware/validatorLogin")

router.post("/add", validatorLogin, upload.single("attachment"), async (req, res) => {
  const {email,YoutubeId, data } = req.body;
  const file = req.file;
  if (!email) {
    return res.json({ code: 1, message: "Du lieu khong hop le" });
  }
  if(!data && !YoutubeId && ! file){
    return res.json({ code: 1, message: "Du lieu khong hop le" });
  }

  const user = await accountModel.findOne({ email: email });

  if (user) {
    if (file) {
      const { root } = req.vars;
      const currentPath = `${root}/users/${email}`;

      if (!fs.existsSync(currentPath)) {
        res.json({ code: 2, message: "Duong dan hong hop le" });
      }

      let name = file.originalname;
      let newPath = currentPath + "/" + name;
      fs.renameSync(file.path, newPath);
      new postModel({
        id: uuid.generate(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          img: user.img
        },
        data: data || "",
        time: new Date().getTime(),
        urlFile: newPath,
        nameFile: name,
        idVideos: "",
      })
        .save()
        .then((post) =>
          res.json({ code: 0, message: "Them thanh cong", post: post})
        )
        .catch(() => res.json({ code: 3, message: "Them that bai" }));
    } else if (YoutubeId != null) {
      validator.validateVideoID(YoutubeId, (result, err) => {
        if (err) {
          res.json({ code: 1, message: "Du lieu khong hop le" });
        } else {
          new postModel({
            id: uuid.generate(),
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              img: user.img
            },
            data: data || "",
            time:new Date().getTime(),
            urlFile: "",
            idVideos: YoutubeId,
          })
            .save()
            .then((post) =>
              res.json({ code: 0, message: "Them thanh cong", post: post})
            )
            .catch(() => res.json({ code: 3, message: "Them that bai" }));
        }
      });
    } else {
      new postModel({
        id: uuid.generate(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          img: user.img
        },
        data: data,
        time:new Date().getTime(),
        urlFile: "",
        idVideos: "",
      })
        .save()
        .then((post) =>
          res.json({ code: 0, message: "Them thanh cong", post: post})
        )
        .catch(() => res.json({ code: 3, message: "Them that bai" }));
    }
  }
});

router.delete("/delete/:id", validatorLogin, async (req, res) => {
  const id = req.params.id;
  const post = await postModel.findOne({ id: id });
  if (post) {
    postModel
      .deleteOne({ id: id })
      .then(() => {
        commentsModel.deleteMany({ idPost: id }).then(() => {
          if (fs.existsSync(post.urlFile)) {
            fs.unlinkSync(post.urlFile);
          }
          res.json({ code: 0, message: "Xoa thanh cong" });
        });
      })
      .catch(() => res.json({ code: 1, message: "Xoa that bai" }))
      .catch((err) => res.json({ code: 1, message: "Xoa that bai" }));
  }
});

router.post("/update", (req, res) => {});

router.post("/load",  async (req, res) => {
  const id = req.session.passport.user
  var { start, limit } = req.body;
  postModel.count().then(numDocs => {
    if(limit*start - numDocs < limit){
      limit = limit*start - numDocs
    }
  });
  const post = await postModel
    .find()
    .sort({ time: -1 })
    .skip(limit * start)
    .limit(limit);
  const comments = await commentsModel.find()
  const user = await accountModel.findById(id)
  if (post.length > 0) {
    res.json({ code: 0, message: "Thanh cong", post: post, comments: comments, user: user });
  } else {
    res.json({ code: 1, message: "Het roi" });
  }
});

module.exports = router;
