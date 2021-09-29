const cloudinary = require("cloudinary").v2;
const User = require("../models/user")

async function uploadProfilePic(req, res) {
  const username = req.verifiedUser.username;
  const imageStr = req.body.data;
  try{
    const response = await cloudinary.uploader.upload(imageStr, {
      resource_type: "image",
      upload_preset:"profilePictureUpload"
    });
    const profilePicURL=`https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/w_200,h_200,c_thumb/${response.public_id}`
    await User.updateOne({username},{profilePic:profilePicURL,newUser:false})
    res.json({profilePicURL,message:"Uploaded Successfully!"})
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Something Went Wrong!"})
  }
}

module.exports = uploadProfilePic;
