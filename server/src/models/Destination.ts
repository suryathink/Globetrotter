import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  clues: {
    type: [String],
    required: true,
  },
  fun_fact: {
    type: [String],
    required: true,
  },
  trivia: {
    type: [String],
    required: true,
  },
});

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
