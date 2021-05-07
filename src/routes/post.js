const express = require("express");
const router = express.Router();

const accountModel = require("../models/accounts");
const postModel = require("../models/posts");
const commentsModel = require("../models/comments");

const upload = require("../uploads/upload")
const fs = require("fs");
const uuid = require("short-uuid");
const validator = require("youtube-validator");
const validatorLogin =  require("../middleware/validatorLogin")
const {bucket,storage} = require("../configs/firebase")

router.post("/add", validatorLogin, upload.single("attachment"), async (req, res) => {
  const {email,YoutubeId, data } = req.body;
  const files = req.file;
  if (!email) {
    return res.json({ code: 1, message: "Du lieu khong hop le" });
  }
  if(!data && !YoutubeId && ! files){
    return res.json({ code: 1, message: "Du lieu khong hop le" });
  }

  const user = await accountModel.findOne({ email: email });

  if (user) {
    if (files) { 
      if(files.mimetype.split("/")[0] != "image") {
        fs.unlinkSync(files.path)
        return res.json({ code: 4, message: "Du lieu khong hop le" });
      }
      let tmp = files.originalname.split(".")     
      let name = tmp[0]+new Date().getTime()+"."+tmp[1]
      const cloudFiles = await bucket.upload(files.path, {
        destination: email+"/"+ name
      })
      let link = cloudFiles[0].metadata.mediaLink
      fs.unlinkSync(files.path)
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
        urlFile: link,
        nameFile: name,
        idVideos: "",
      })
        .save()
        .then((post) =>
          res.json({ code: 0, message: "Them thanh cong", post: post})
        )
        .catch(() => res.json({ code: 2, message: "Them that bai" }));
    } else if (YoutubeId != null) {
      validator.validateVideoID(YoutubeId, (result, err) => {
        if (err) {
          res.json({ code: 2, message: "Sai link" });
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
            .catch(() => res.json({ code: 2, message: "Them that bai" }));
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
        .catch(() => res.json({ code: 2, message: "Them that bai" }));
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
        commentsModel.deleteMany({ idPost: id }).then(async () => {
            if (post.urlFile != "") {
              await bucket.deleteFiles({
                prefix: post.user.email+"/"+post.nameFile
              })
            }
          res.json({ code: 0, message: "Xoa thanh cong" });
        });
      })
      .catch(() => res.json({ code: 1, message: "Xoa that bai" }))
  }
});

router.post("/update", validatorLogin, upload.single("image"), async (req, res) => {
  const {idPost, YoutubeId, data,clearYoutube,clearImage} = req.body;
  const file = req.file;
  const id = req.session.passport.user
  const user = await accountModel.findById(id)
  const post = await postModel.findOne({ id: idPost})
  if (!user || !post) {
    return res.json({ code: 1, message: "Du lieu khong hop le" });
  }
  if(!data && !YoutubeId && ! file && clearYoutube === false && clearImage === false){
    return res.json({ code: 1, message: "Du lieu khong hop le" });
  }

  if (user && post) {
    const oldLink =  post.user.email + "/" + post.nameFile
    if (file) {
      if(file.mimetype.split("/")[0] != "image") {
        fs.unlinkSync(file.path)
        return res.json({ code: 4, message: "Du lieu khong hop le" });
      }
      let tmp = file.originalname.split(".")     
      let name = tmp[0]+new Date().getTime()+"."+tmp[1]
      const cloudFiles = await bucket.upload(file.path, {
        destination: user.email+"/"+ name
      })
      let link = cloudFiles[0].metadata.mediaLink
      fs.unlinkSync(file.path)
      postModel.findOneAndUpdate(
        {
          id: idPost
        },
        {
          urlFile: link,
          nameFile: name,
          idVideos: "",
          data: data || ""
        },
        {
          new: true,
          runValidators: true
        }
      )
      .then( doc => {
        res.json({code: 0, message:"Thanh cong", post: doc})})
      .catch( err => console.log(err))
    } else if (YoutubeId) {
      validator.validateVideoID(YoutubeId, (result, err) => {
        if (err) {
          res.json({ code: 2, message: "Sai link" });
        } else {
          postModel.findOneAndUpdate(
            {
              id: idPost
            },
            {
              urlFile: "",
              nameFile: "",
              idVideos: YoutubeId,
              data: data || ""
            },
            {
              new: true,
              runValidators: true
            }
          )
          .then( doc => res.json({code: 0, message:"Thanh cong", post: doc}))
          .catch( err => console.log(err))
        }
      });
    } else {
      if(clearImage === "true") {
        postModel.findOneAndUpdate(
          {
            id: idPost
          },
          {
            urlFile: "",
            nameFile: "",
            idVideos: "",
            data: data
          },
          {
            new: true,
            runValidators: true
          }
        )
        .then( doc =>{
          res.json({code: 0, message:"Thanh cong", post: doc})
        })
        .catch( err => console.log(err))
      }else  if(clearYoutube === "true") {
        postModel.findOneAndUpdate(
          {
            id: idPost
          },
          {
            urlFile: "",
            nameFile: "",
            idVideos: "",
            data: data
          },
          {
            new: true,
            runValidators: true
          }
        )
        .then( doc =>{
          res.json({code: 0, message:"Thanh cong", post: doc})
        })
        .catch( err => console.log(err))
      }
       else {
        postModel.findOneAndUpdate(
          {
            id: idPost
          },
          {
            data: data
          },
          {
            new: true,
            runValidators: true
          }
        )
        .then( doc => res.json({code: 0, message:"Thanh cong", post: doc}))
        .catch( err => console.log(err))
      }
    }
  }
});

router.post("/load",  async (req, res) => {
  const id = req.session.passport.user
  var {check, start, limit } = req.body;
  let post = null
  if(check != ""){
    post = await postModel
    .find({"user.id": check})
    .sort({ time: -1 })
    .skip(10 * start)
    .limit(limit);
  } else {
    post = await postModel
    .find()
    .sort({ time: -1 })
    .skip(10 * start)
    .limit(limit);
  }
  const comments = await commentsModel.find()
  const user = await accountModel.findById(id)
  if (post.length > 0) {
    res.json({ code: 0, message: "Thanh cong", post: post, comments: comments, user: user });
  } else {
    res.json({ code: 1, message: "Het roi" });
  }
});

module.exports = router;
