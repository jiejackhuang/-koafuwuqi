//schema
//model
//entity
const mongoose = require('mongoose')
const TokenSchema = new  mongoose.Schema({
    name: String,
    token: String,
    expires_in: Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },

        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
//数据存储之前执行这个方法
TokenSchema.pre('save', function (next) {

    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

TokenSchema.statics = {
    async getAccessToken() {
        const token = await this.findOne({
            name: 'access_token'
        })
        if (token && token.token) {
            token.access_token = token.token;
        }
        return token
    },
    async saveAccessToken(data) {
        let token = await this.findOne({
            name: 'access_token'
        })
        if (token) {
            token.token = data.access_token;
            token.expires_in = data.expires_in
        } else {
            token = new Token({
                name: 'access_token'
                ,
                token: data.access_token
                ,
                expires_in: data.expires_in
            })
        }
        let result = await token.save();
        console.log(result);
        return data
    }
}


const Token = mongoose.model('Token', TokenSchema)

