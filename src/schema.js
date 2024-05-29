/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const NameType = new GraphQLObjectType({
  name: 'Name',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  }
})

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: NameType,
  },
});

const peopleData = [
  { id: 1,
    name: {
      firstName: 'John',
      lastName: 'Smith'
    }},
  { id: 2,
    name: {
      firstName: 'Sara',
      lastName: 'Smith'
    }},
  { id: 3,
    name: {
      firstName: 'Budd',
      lastName: 'Deey'
    }},
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = {
          id: peopleData[peopleData.length - 1].id + 1,
          name: {
            firstName: name,
            lastName: name
          },
        };

        peopleData.push(person);
        return person;
      }
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });
