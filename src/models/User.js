const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('contrasena')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  next();
});

UserSchema.methods.compareContrasena = async function(plain) {
  return bcrypt.compare(plain, this.contrasena);
};

module.exports = mongoose.model('User', UserSchema);
