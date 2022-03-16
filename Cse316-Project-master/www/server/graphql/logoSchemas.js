var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var LogoModel = require('../models/Logo');
var UserModel = require('../models/user');

var userType = new GraphQLObjectType({
    name: 'user',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            username: {
                type: GraphQLString
            },
            password:{
                type:GraphQLString
            }
        }
    }
});

var logoType = new GraphQLObjectType({
    name: 'logo',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            username:{
                type: GraphQLString
            },
            canvasWidth:{
                type:GraphQLInt
            },
            canvasHeight:{
                type:GraphQLInt
            },
            xpos:{
                type: GraphQLList(GraphQLInt)
            },
            ypos:{
                type: GraphQLList(GraphQLInt)
            },
            text: {
                type: GraphQLList(GraphQLString)
            },
            color: {
                type: GraphQLList(GraphQLString)
            },
            fontSize: {
                type: GraphQLList(GraphQLInt)
            },
            backgroundColor:{
                type:GraphQLString
            },
            borderColor:{
                type:GraphQLString
            },
            borderRadius: {
                type: GraphQLInt
            },
            borderWidth: {
                type: GraphQLInt
            },
            padding: {
                type: GraphQLInt
            },
            margin: {
                type: GraphQLInt
            },
            lastUpdate: {
                type: GraphQLDate
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            logos: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    const logos = LogoModel.find().exec()
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return logos
                }
            },
            logo: {
                type: logoType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const logoDetails = LogoModel.findById(params.id).exec()
                    if (!logoDetails) {
                        throw new Error('Error')
                    }
                    return logoDetails
                }
            },
            users: {
                type: new GraphQLList(userType),
                resolve: function () {
                    const users = UserModel.find().exec()
                    if (!users) {
                        throw new Error('Error')
                    }
                    return users
                }
            },
            user: {
                type: userType,
                args: {
                    username: {
                        name: 'username',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const userDetails = UserModel.findById(params.id).exec()
                    if (!userDetails) {
                        throw new Error('Error')
                    }
                    return userDetails
                }
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addLogo: {
                type: logoType,
                args: {
                    username:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    canvasWidth:{
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    canvasHeight:{
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    xpos:{
                        type: new GraphQLList(new GraphQLNonNull(GraphQLInt))
                    },
                    ypos:{
                        type: new GraphQLList(new GraphQLNonNull(GraphQLInt))
                    }, 
                    text: {
                        type: new GraphQLList(new GraphQLNonNull(GraphQLString))
                    },
                    color: {
                        type: new GraphQLList(new GraphQLNonNull(GraphQLString))
                    },
                    fontSize: {
                        type: new GraphQLList(new GraphQLNonNull(GraphQLInt))
                    },
                    backgroundColor:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    const logoModel = new LogoModel(params);
                    const newLogo = logoModel.save();
                    if (!newLogo) {
                        throw new Error('Error');
                    }
                    return newLogo
                }
            },
            updateLogo: {
                type: logoType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    username:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    canvasWidth:{
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    canvasHeight:{
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    xpos:{
                        type: new GraphQLList(new GraphQLNonNull(GraphQLInt))
                    },
                    ypos:{
                        type: new GraphQLList(new GraphQLNonNull(GraphQLInt))
                    }, 
                    text: {
                        type: new GraphQLList(new GraphQLNonNull(GraphQLString))
                    },
                    color: {
                        type: new GraphQLList(new GraphQLNonNull(GraphQLString))
                    },
                    fontSize: {
                        type: new GraphQLList(new GraphQLNonNull(GraphQLInt))
                    },
                    backgroundColor:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {
                    return LogoModel.findByIdAndUpdate(params.id, {username:params.username, canvasWidth:params.canvasWidth, canvasHeight:params.canvasHeight, xpos:params.xpos,ypos:params.ypos,
                        text: params.text, color: params.color, fontSize: params.fontSize,
                        backgroundColor: params.backgroundColor, borderColor: params.borderColor, borderRadius: params.borderRadius,
                        borderWidth: params.borderWidth, padding: params.padding, margin: params.margin, lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removeLogo: {
                type: logoType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remLogo = LogoModel.findByIdAndRemove(params.id).exec();
                    if (!remLogo) {
                        throw new Error('Error')
                    }
                    return remLogo;
                }
            },
            addUser: {
                type: userType,
                args: {
                    username:{
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password:{
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const userModel = new UserModel(params);
                    const newUser = userModel.save();
                    if (!newUser) {
                        throw new Error('Error');
                    }
                    return newUser
                }
            },
            removeUser: {
                type: userType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remUser = UserModel.findByIdAndRemove(params.id).exec();
                    if (!remUser) {
                        throw new Error('Error')
                    }
                    return remUser;
                }
            },
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation});