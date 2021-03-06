const { intArg, queryType, stringArg } = require('@nexus/schema')
const { getUserId } = require('../utils')

const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findOne({
          where: {
            id: userId,
          },
        })
      },
    })

    t.list.field('feed', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString,
                },
              },
              {
                content: {
                  contains: searchString,
                },
              },
            ],
          },
        })
      },
    })

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: {
            id,
          },
        })
      },
    })

    t.list.field('questions', {
      type: 'Question',
      nullable: true,
      args: { userId: intArg() },
      resolve: (parent, args, ctx) => {
        return ctx.prisma.question.findMany({
          where: { userId: args.userId },
        })
      },
    })

    t.field('question', {
      type: 'Question',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.question.findOne({
          where: {
            id,
          },
        })
      },
    })
  },
})

module.exports = {
  Query,
}
