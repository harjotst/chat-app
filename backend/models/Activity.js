const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ['message', 'event', 'file'],
      required: true,
    },
    messageInformation: {
      message: {
        type: String,
        required: this.contentType === 'message',
      },
      language: {
        type: String,
        required: this.contentType === 'message',
      },
      translations: [
        {
          language: {
            type: String,
            required: this.contentType === 'message',
          },
          message: {
            type: String,
            required: this.contentType === 'message',
          },
        },
      ],
    },
    eventType: {
      type: String,
      enum: ['join', 'leave', 'kick', 'rename'],
      required() {
        return this.contentType === 'event';
      },
    },
    fileKey: {
      type: String,
      required() {
        return this.contentType === 'file';
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: {
      transform: function (doc, ret, options) {
        if (ret.messageInformation.translations) {
          delete ret.messageInformation.translations;
        }
        return ret;
      },
    },
  }
);

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
