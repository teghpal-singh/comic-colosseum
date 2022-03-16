var mongoose = require('mongoose');

var LogoSchema = new mongoose.Schema({
  id: String,
  username: String,
  canvasWidth: Number,
  canvasHeight: Number,
  xpos:[Number],
  ypos:[Number],  
  text: [String],
  color: [String],
  fontSize: [{ type: Number, min: 0, max: 144 }],
  backgroundColor : String,
  borderColor : String,
  borderRadius : { type: Number, min: 0, max: 144 },
  borderWidth : { type: Number, min: 1, max: 144 },
  padding : { type: Number, min: 0, max: 144 },
  margin : { type: Number, min: 0, max: 144 },
  lastUpdate: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Logo', LogoSchema);
