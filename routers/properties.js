const { Property } = require("../models/property");
const { Category } = require("../models/category");
const { Mogata } = require("../models/mogata");
const { UserProperty } = require("../models/userproperty");

const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

/**
 * S3 setup
 */

const s3 = new aws.S3({
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  region: process.env.BUCKETEER_AWS_REGION,

})

/**
 * the specific implemenation for the ability to upload images
 * using mutler and mongoose and in an express sever
 * 
 */
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if(isValid) {
        uploadError = null;
    };

    cb(uploadError, 'public/uploads/images')
  },
  filename: function (req, file, cb) {

    const fileName = file.originalname.split(' ').join('-');
    const extention = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extention}`)
  }
})

const uploadOptions = multer({ storage: storage });

const uploadS3 = multer({ 
  storage: multerS3({
    s3: s3,
    bucket: 'samsar',//process.env.BUCKETEER_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName:  file.fieldname});
    },
    key: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extention = FILE_TYPE_MAP[file.mimetype];
      cb(null, `public/samsar/${fileName}-${Date.now()}.${extention}`)
    },
    acl: 'public-read'
  }),
})

//get request for all properties in the DB
router.get("/", async (req, res) => {
  let propertyList;

  filter = {};
  // filter.sell = true;
  let applyFilter = false;

  if (req.query.mogatas) {
    mogata = req.query.mogatas.split(",");
    filter.mogata = mogata;
    applyFilter = true;
  };

  if (req.query.categories) {
    categories = req.query.categories.split(",");
    filter.category = categories;
    applyFilter = true;
  }

  if (req.query.price) {
    price = req.query.price.split(",");
    filter.price = { $lte: price[1] || 1000000000000, $gte: price[0] || 0 };
    console.log(filter);
    applyFilter = true;
  }
  
  try {
    if (applyFilter) {
      propertyList = await Property.find(filter).populate('category').populate('mogata');
    } else {
      propertyList = await Property.find().populate('category').populate('mogata');
    }
    
  } catch (error) {
    console.log("Erro loged in the console: ", error);
  }

  if (!propertyList) {
    res.status(500).json({ sucess: false });
  }

  res.status(200).send(propertyList);
});
//get request for user properties in the DB
router.get("/users", async (req, res) => {
  let propertyList;
  try {
    propertyList = await UserProperty.find().populate('category').populate('mogata');
    
  } catch (error) {
    console.log("Erro loged in the console: ", error);
  }

  if (!propertyList) {
    res.status(500).json({ sucess: false });
  }

  res.status(200).send(propertyList);
});

//get request for all properties in the DB
router.get("/rent", async (req, res) => {
  let propertyList;

  let filter = {};
  filter.sell = false;
  let applyFilter = false;

  if (req.query.mogatas) {
    mogata = req.query.mogatas.split(",");
    filter.mogata = mogata;
    applyFilter = true;
    // filter = { mogata: req.query.mogatas.split(',')}
  };

  if (req.query.categories) {
    categories = req.query.categories.split(",");
    filter.category = categories;
    applyFilter = true;
  }
  if (req.query.price) {
    price = req.query.price.split(",");
    filter.price = { $lte: price[1] || 1000000000000, $gte: price[0] || 0 };
    // filter.price = { $lte: 10000000, $gte: 0 }
    console.log(filter);
    applyFilter = true;
  }
  
  try {
    if (applyFilter) {
      propertyList = await Property.find(filter).populate('category').populate('mogata');
    } else {
      propertyList = await Property.find({ sell: false }).populate('category').populate('mogata');
    }
    
  } catch (error) {
    console.log("Erro loged in the console: ", error);
  }

  if (!propertyList) {
    res.status(500).json({ sucess: false });
  }

  res.status(200).send(propertyList);
});

// get the property with the specified id
router.get(`/:id`, async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res
      .status(500)
      .json({
        success: false,
        message: "There is no property with the given id",
      });
  }
  res.send(property);
});

// get the property with the specified id fro user properties
router.get(`/users/:id`, async (req, res) => {
  const property = await UserProperty.findById(req.params.id);

  if (!property) {
    res
      .status(500)
      .json({
        success: false,
        message: "There is no property with the given id",
      });
  }
  res.send(property);
});

// Get the property by name 
router.get(`/name/:name`, async (req, res) => {
    const property = await Property.find({ name: req.params.name }).populate('category').populate('mogata');
    
    if (!property) {
        res.status(500).json({success: false, message: 'There is no property with the given name'});
    }
    res.send(property);
} );

// posting properties to the database uploadOptions.single('image')
router.post(`/`, uploadS3.single('image'), async (req, res) => {


  const mogata = await Mogata.findById(req.body.mogata);
  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid category");
  if (!mogata) return res.status(400).send("Invalid mogata");

  file = req.file;
  // Making sure the request has a file path in it 
  let fileName = 'samsar.png';
  let basePath = process.env.BASE_PATH;
  if(!file) {
    fileName = req.file.key;
    basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
  } 

  
  let property = new Property({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    address: req.body.address,
    phone: req.body.phone,
    room: req.body.room,
    price: req.body.price,
    isFeatured: req.body.isFeatured,
    sell: req.body.sell,
    image: `${basePath}${fileName}`,
    images: req.body.images,
    mogata: req.body.mogata,
    category: req.body.category,
  });

  property = await property.save();

  if (!property) return res.status(500).send("The property cannot be created ");

  res.send(property);
});

// posting properties to the database
router.post(`/validate/:id`, async (req, res) => {
  const userProperty = await UserProperty.findById(req.params.id);

  let property = new Property({
    name: userProperty.name,
    description: userProperty.description,
    location: userProperty.location,
    address: userProperty.address,
    price: userProperty.price,
    phone: userProperty.phone,
    room: userProperty.room,
    isFeatured: userProperty.isFeatured,
    sell: userProperty.sell,
    image: userProperty.image,
    images: userProperty.images,
    mogata: userProperty.mogata,
    category: userProperty.category
  });

  property = await property.save();

  if (!property) return res.status(500).send("The property cannot be created ");

  res.send(property);

});

// updating property a specific property
router.put("/:id",  uploadS3.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid property id");
  }

  const category = await Category.findById(req.body.category);
  
  if (!category) {
    return res.status(400).send("Invalid Category ");
  }

  const mogata = await Mogata.findById(req.body.mogata);
  if (!mogata) {
    return res.status(400).send("Invalid mogata ");
  }

  const property = await Property.findById(req.params.id);
    if(!property) return res.status(400).send('Invalid property ');

    const file = req.file;
    let imagePath;

    let fileName = 'samsar.png';
    let basePath = process.env.BASE_PATH;
    if(file) {
      fileName = req.file.key;
      basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
      // return res.status(400).send('No image in request');
      imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = property.image;
    }

  const newProperty = await Property.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      address: req.body.address,
      price: req.body.price,
      phone: req.body.phone,
      room: req.body.room,
      isFeatured: req.body.isFeatured,
      sell: req.body.sell,
      image: imagePath,
      images: req.body.images,
      mogata: req.body.mogata,
      category: req.body.category,
    },
    { new: true }
  );

  if (!newProperty) {
    return res.status(500).send("the property cannot be updated");
  }

  res.status(200).send(newProperty);
});

// updating users property a specific property smt
router.put("/users/:id",  uploadS3.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid property id");
  }

  const category = await Category.findById(req.body.category);
  
  if (!category) {
    return res.status(400).send("Invalid Category ");
  }

  const mogata = await Mogata.findById(req.body.mogata);
  if (!mogata) {
    return res.status(400).send("Invalid mogata ");
  }

  const property = await UserProperty.findById(req.params.id);
    if(!property) return res.status(400).send('Invalid property ');

    const file = req.file;
    let imagePath;

    if(file) {
        const fileName = file.key;
        const basePath = process.env.BUCKETEER_BUCKET_NAME || ``;;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = property.image;
    }

  const newProperty = await UserProperty.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      address: req.body.address,
      price: req.body.price,
      phone: req.body.phone,
      room: req.body.room,
      isFeatured: req.body.isFeatured,
      sell: req.body.sell,
      image: imagePath,
      images: req.body.images,
      mogata: req.body.mogata,
      category: req.body.category,
    },
    { new: true }
  );

  if (!newProperty) {
    return res.status(500).send("the property cannot be updated");
  }

  res.status(200).send(newProperty);
});

// posting properties to the database
router.post(`/users`, uploadS3.single('image'), async (req, res) => {
  const mogata = await Mogata.findById(req.body.mogata);
  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid category");
  if (!mogata) return res.status(400).send("Invalid mogata");

  // Making sure the request has a file path in it
  const file = req.file;
  let fileName = 'assets/samsar.png';
  let basePath = process.env.BASE_PATH;
  if(file) {
    fileName = req.file.key;
    basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
  }

  let property = new UserProperty({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    address: req.body.address,
    price: req.body.price,
    phone: req.body.phone,
    rooms: req.body.room,
    isFeatured: req.body.isFeatured,
    sell: req.body.sell,
    image: `${basePath}${fileName}`,
    images: req.body.images,
    mogata: req.body.mogata,
    category: req.body.category,
  });

  property = await property.save();

  if (!property) return res.status(500).send("The property cannot be created ");

  res.send(property);
  
});


router.delete("/:id", (req, res) => {
  Property.findByIdAndRemove(req.params.id)
    .then((property) => {
      if (property) {
        return res
          .status(200)
          .json({ success: true, message: "the property was deleted." });
      } else {
        return res
          .status(404)
          .json.apply({ success: false, message: "Property not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.delete("/users/:id", (req, res) => {
  UserProperty.findByIdAndRemove(req.params.id)
    .then((property) => {
      if (property) {
        return res
          .status(200)
          .json({ success: true, message: "the property was deleted." });
      } else {
        return res
          .status(404)
          .json.apply({ success: false, message: "Property not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// getting the property count
router.get("/get/count", async (req, res) => {
  const propertiesCount = await Property.countDocuments();

  if (!propertyCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    propertyCount: propertyCount,
  });
});

// getting the featured propertys
router.get("/get/featured/:count", async (req, res) => {
  let count = req.params.count ? +req.params.count : 24;

  const properties = await Property.find({ isFeatured: true }).populate('category').populate('mogata').limit(count);

  if (!properties) {
    res.status(500).json({ success: false });
  }
  res.send(properties);
});

// getting the featured propertys
router.get("/get/sell/:count", async (req, res) => {
  let count = req.params.count ? +req.params.count : 24;

  const properties = await Property.find({ sell: true }).populate('category').populate('mogata').limit(count);

  if (!properties) {
    res.status(500).json({ success: false });
  }
  res.send(properties);
});

// getting the featured propertys
router.get("/get/rent/:count", async (req, res) => {
  let count = req.params.count ? +req.params.count : 24;

  const properties = await Property.find({ sell: false }).populate('category').populate('mogata').limit(count);

  if (!properties) {
    res.status(500).json({ success: false });
  }
  res.send(properties);
});

router.put(
  "/gallery-image/:id",
  uploadS3.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("Invalid property id");
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = process.env.BUCKETEER_BUCKET_NAME || ``;
    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.key}`);
      });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!property) {
      return res.status(500).send("the property cannot be updated");
    }

    res.status(200).send(property);
  }
);

module.exports = router;
