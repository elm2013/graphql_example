const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const User = require('./model/users');
const Article = require('./model/articles');
const Comment = require('./model/comments');
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/graphql-project");

let schema = buildSchema(`

    type Query {
        getAllUser(page : Int, limit : Int) : userData
        getUser(id : ID!) : User
    }

    type User {
        fname : String
        lname : String
        age : Int @deprecated(reason : "not use this")
        gender : Gender
        email : String
        password : String
        articles : [Article]
    }

    type Paginate {
        total : Int
        limit : Int
        page : Int
        pages : Int
    }

    type userData {
        users : [User],
        paginate : Paginate
    }

    enum Gender {
        Male
        Female
    }

    type Comment {
        user : User
        article : Article
        title : String
        body : String
    }

    type Article {
        user : User
        title : String
        body : String
        comments : [Comment]
    }

    
`);

let resolver = {
    

    getAllUser : async (args) => {
        let page = args.page || 1;
        let limit = args.limit || 10;
        // const users = await User.find({}).skip((page - 1) * limit).limit(limit);
        const users = await User.paginate({}, {page, limit, populate : [{ path : 'articles', populate : ['comments']}]});
        return {
            users : users.docs,
            paginate : {
                total : users.total,
                limit : users.limit,
                page : users.page,
                pages : users.pages
            }
        }
    },

    getUser : async (args) => {
        const user = await User.findById(args.id)
        return user;
    }
}

app.use('/graphql', graphqlHTTP({
    schema : schema,
    rootValue : resolver,
    graphiql : true
}))


app.listen(5000, () => {console.log('server run on port 5000 ...')});