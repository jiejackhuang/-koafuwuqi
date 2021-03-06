const {reply} = require('../../wechat/reply')
const config = require('../../config/config')
const wechatMiddle = require('../../wechat-lib/middleware')
//接入微信消息中间件

const {getOAuth} = require('../../wechat')

exports.sdk = async (ctx, next) => {
    //views geng mu lu  yj goa hao l
    await ctx.render('wechat/sdk',{
        title:'sdk  test  jiege '
        ,desc:'test'
    })


}


exports.hear = async (ctx, next) => {
    const middle = wechatMiddle(config.wechat, reply)

    await middle(ctx, next)

}
exports.oauth = async (ctx, next) => {
    const oauth=getOAuth();
    const target = config.baseUrl + 'userinfo'
    const scope = 'snsapi_userinfo'
    const state = ctx.query.id
    const url =  oauth.getAuthorizeURL(scope, target, state)
    ctx.redirect(url)


}

exports.userinfo = async (ctx, next) => {
    const oauth=getOAuth();

    const code = ctx.query.code;
    const data = await oauth.fetchAccessToken(code)
    const userData = await  oauth.getUserInfo(data.access_token, data.openid)
    ctx.body=userData
}