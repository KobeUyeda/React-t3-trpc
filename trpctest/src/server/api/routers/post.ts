import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  returnAll: publicProcedure
    .query(async ({ ctx }) => {
      const tasks = await ctx.db.posts.findMany({
        where:{
          finished: {not: true}
        }
      })
      return tasks.map((task)=>({id: task.id, title: task.name}))
    }),

  create: publicProcedure
    .input(z.object({ task: z.string({required_error: "Enter the task title"}).min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.posts.create({
        data: {
          name: input.task,
          finished: false,
          createdAt: new Date(),
        }
      })
    }),

  finish: publicProcedure.input(z.object({id: z.string({required_error: "Enter the id of the task"}).min(1)})).mutation(({ ctx, input }) => {
    return ctx.db.posts.update({
      where: {
        id: input.id,
      },
      data: {
        finished: true,
        updatedAt: new Date(),
      }
    })
  }),
});
