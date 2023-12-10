
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const imagesData = [
  {
    id: 1,
    title: "Stacked Brwonies",
    owner: "Ella Olson",
    category: "Desserts",
    url: "https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg",
  },
  {
    id: 2,
    title: "Shallow focus photography of Cafe Latte",
    owner: "Kevin Menajang",
    category: "Coffee",
    url: "https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg",
  },
  {
    id: 3,
    title: "Sliced Cake on White Saucer",
    owner: "Quang Nguyen Vinh",
    category: "Desserts",
    url: "https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg",
  },
  {
    id: 4,
    title: "Beverage breakfast brewed coffee caffeine",
    owner: "Burst",
    category: "Coffee",
    url: "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg",
  },
  {
    id: 5,
    title: "Pancake with Sliced Strawberry",
    owner: "Ash",
    category: "Desserts",
    url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
  },
];
// Get single Image using id

function getImage(args) {
  for (const image of imagesData) {
    if (image.id === args.id) {
      return image;
    }
  }
}

//Get images using category

function getImages(args) {
  if (args.category) {
    return imagesData.filter(
      (image) => image.category.toLowerCase() === args.category.toLowerCase()
    );
  } else {
    return imagesData;
  }
}

// Sample users
const users = [
  {
    id: 1,
    name: 'Brian',
    age: '21',
    shark: 'Great White Shark'
  },
  {
    id: 2,
    name: 'Kim',
    age: '22',
    shark: 'Whale Shark'
  },
  {
    id: 3,
    name: 'Faith',
    age: '23',
    shark: 'Hammerhead Shark'
  },
  {
    id: 4,
    name: 'Joseph',
    age: '23',
    shark: 'Tiger Shark'
  },
  {
    id: 5,
    name: 'Joy',
    age: '25',
    shark: 'Hammerhead Shark'
  }
];

// Return a single user (based on id)
var getUser = function(args) {
  var userID = args.id;
  return users.filter(user => user.id == userID)[0];
}

// Return a list of users (takes an optional shark parameter)
var retrieveUsers = function(args) {
  if (args.shark) {
    var shark = args.shark;
    return users.filter(user => user.shark === shark);
  } else {
    return users;
  }
}
var updateUser = function({id, name, age}) {
  users.map(user => {
    if (user.id === id) {
      user.name = name;
      user.age = age;
      return user;
    }
  });
  return users.filter(user => user.id === id)[0];
}
// GraphQL Schema
// const schema = buildSchema(`
//       type Query {
//         image(id: Int!): Image
//         images(category: String): [Image]
//       }
//       type Image {
//         id: Int
//         title: String
//         category: String
//         owner: String
//         url: String
//       }
// `);
// Initialize a GraphQL schema
const schema = buildSchema(`
  type Query {
    user(id: Int!): Person
    users(shark: String): [Person]
  },
  type Person {
    id: Int
    name: String
    age: Int
    shark: String
  }
  type Mutation {
    updateUser(id: Int!, name: String!, age: String): Person
  }
`);


// Resolver
// const root = {
//   image: getImage,
//   images: getImages,
// };

const root = { 
  user: getUser,  // Resolver function to return user with specific id
  users: retrieveUsers,
  updateUser: updateUser
};

//Create an express server and GraphQL endpoint
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

//Listening to our server
app.listen(5000, () => {
  console.log("GraphQL server with Express running on localhost:5000/graphql");
});